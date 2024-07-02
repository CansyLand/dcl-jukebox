import {
  AudioSource,
  AudioStream,
  Entity,
  GltfContainer,
  PBAudioSource,
  PBGltfContainer,
  Transform,
  TransformType,
  engine,
  executeTask
} from '@dcl/sdk/ecs'
import { jukeBoxMessageBus } from './messageBus'
import { Vector3 } from '@dcl/sdk/math'
import { setupButtons } from './buttons'
import { randomString } from './utils'

type JukeBoxSetup = {
  playlist: JukeboxTrack[]
  pathToTracks: string
  transform: Partial<TransformType>
  models: {
    body: string
    buttons: JukeBoxButtonModels
  }
  options: JukeboxOptions
}

export type JukeBoxButtonModels = {
  play?: string
  pause?: string
  playPause?: string
  stop?: string
  next?: string
  previous?: string
  backwards?: string
  forward?: string
  loop?: string
  loopTrack?: string
  shuffle?: string
  localVolumeUp?: string
  localVolumeDown?: string
  globalVolumeUp?: string
  globalVolumeDown?: string
  multiplayer?: string
}

type JukeboxOptions = {
  id: string
  isPlaying: boolean
  // playMode: PlayMode
  global: boolean // whether the audio plays at constant volume across the scene.
  volume: number
  currentTrackIndex: number
  isLooping: boolean
  isLoopingTrack: boolean
  isShuffeling: boolean
  multiplayer: boolean
}

// export enum PlayMode {
//   SINGLE_TRACK,
//   FULL_PLAYLIST
// }

type JukeboxTrack = {
  filename: string
  title?: string
  author?: string
  published?: string
  duration?: number
}

export type JukeboxPlaylist = JukeboxTrack[]

export class Jukebox {
  private pathToTracks
  private options: JukeboxOptions = {
    id: 'Jukebox',
    isPlaying: false,
    // playMode: PlayMode.FULL_PLAYLIST,
    currentTrackIndex: 0,
    global: false,
    volume: 1,
    isLooping: false,
    isLoopingTrack: false,
    isShuffeling: false,
    multiplayer: true
  }
  private uniqueId: string = randomString()
  private entity: Entity
  private speaker: Entity
  private audioSource: PBAudioSource
  private playlist: JukeboxPlaylist
  private shuffledPlaylist: JukeboxPlaylist
  // private currentTrackIndex: number = 0
  private timer: number = 0
  private currentTrackDuration: number = 0

  constructor(setup: JukeBoxSetup) {
    this.uniqueId = setup.options.id + randomString()

    this.pathToTracks = setup.pathToTracks
    this.playlist = setup.playlist
    this.shuffledPlaylist = this.shufflePlaylist()
    console.log(this.shuffledPlaylist)
    this.options = setup.options

    this.entity = engine.addEntity()
    GltfContainer.create(this.entity, {
      src: setup.models.body
    })
    Transform.create(this.entity, setup.transform)

    // Speaker 🔊
    this.speaker = engine.addEntity()
    Transform.create(this.speaker, {
      parent: this.entity,
      position: Vector3.create(0, 1, 0)
    })
    this.audioSource = AudioSource.create(this.speaker)
    this.audioSource.global = this.options.global
    this.audioSource.volume = this.options.volume

    // Multiplayer
    if (this.options.multiplayer) {
      // Jukebox is synched with all players
      setupButtons(this.options.id, this.entity, setup.models.buttons)
    } else {
      // Jukebox is in local instance (by adding random string to ID)
      setupButtons(this.uniqueId, this.entity, setup.models.buttons)
    }

    this.setUpMessageBus()

    // Autoplay
    if (this.options.isPlaying) this.play()
  }

  setUpMessageBus() {
    // Singleplayer, you interact with the radio in your own instance
    jukeBoxMessageBus.on(this.uniqueId + '-button', (data) => {
      console.log('received ' + this.options.id + ' message: ' + data.hoverText)
      this.messageBusActions(data.hoverText)
    })

    // Multiplayer, other players can hear your radio manupulations
    jukeBoxMessageBus.on(this.options.id + '-button', (data) => {
      console.log('Multiplayer')
      console.log('received ' + this.options.id + ' message: ' + data.hoverText)
      this.messageBusActions(data.hoverText)
    })
  }

  messageBusActions(action: string) {
    switch (action) {
      case 'Play': {
        this.play()
        break
      }
      case 'Play/Pause': {
        this.playPause()
        break
      }
      case 'Pause': {
        this.pause()
        break
      }
      case 'Stop': {
        this.stop()
        break
      }
      case 'Next': {
        this.nextTrack()
        break
      }
      case 'Previous': {
        this.previousTrack()
        break
      }
      case 'Wind Forward': {
        this.windForward()
        break
      }
      case 'Wind Backward': {
        this.windBackwards()
        break
      }
      case 'Loop': {
        this.toggleLoop()
        break
      }
      case 'Loop Track': {
        this.toggleLoopTrack()
        break
      }
      case 'Shuffle': {
        this.toggleShuffle()
        break
      }
      case 'My Volume Up': {
        this.localVolumeUp()
        break
      }
      case 'My Volume Down': {
        this.localVolumeDown()
        break
      }
      case 'Global Volume Up': {
        this.globalVolumeUp()
        break
      }
      case 'Global Volume Down': {
        this.globalVolumeDown()
        break
      }
      case 'Global': {
        this.toggleGlobal()
        break
      }
    }
  }

  play() {
    this.updateCurrentTrackDuration()
    // ExecuteTask makes sure, that pause() executes first in the priority order
    // This fixes the issue, that clicking on play or other buttons pauses the audio
    executeTask(async () => {
      await this.pause()
      const audioSource = AudioSource.getMutable(this.speaker)
      audioSource.audioClipUrl = this.getCurrentTrack()
      audioSource.playing = true
      audioSource.volume = this.options.volume
      audioSource.loop = this.options.isLoopingTrack
      audioSource.global = this.options.global
      // audioSource.currentTime = 5
    })
  }

  playPause() {
    if (this.isPlaying()) {
      this.pause()
    } else {
      this.play()
    }
  }

  // will pause when SDK7 updates
  pause(): void {
    this.stop()
  }

  stop(): void {
    const audioSource = AudioSource.getMutable(this.speaker)
    audioSource.playing = false
  }

  nextTrack(): boolean {
    // Check if this is last track in playlist
    if (this.isLastTrack() && this.options.isLooping && this.options.isShuffeling) {
      this.shufflePlaylist()
      this.selectTrack(0, this.shuffledPlaylist) // Shuffle playlist and start new list
      console.log('Playing new shuffled track, index: ' + this.options.currentTrackIndex)
      return true
    }

    if (this.isLastTrack() && this.options.isLooping) {
      this.selectTrack(0) // Start from first track again
      console.log('Playlist is over, jumping to first track')
      return true
    }

    if (!this.isLastTrack()) {
      this.options.currentTrackIndex++
      this.selectTrack(this.options.currentTrackIndex)
      console.log('Playing new track index: ' + this.options.currentTrackIndex)
      return true
    } else {
      console.log('This is the last track in this playlist.')
      return false
    }
  }

  previousTrack() {
    if (this.isFirstTrack() && this.options.isLooping && this.options.isShuffeling) {
      this.selectTrack(this.playlist.length - 1, this.shuffledPlaylist) // Go to last shuffled track
      console.log('Playing previous track in shuffled playlist, index: ' + this.options.currentTrackIndex)
      return
    }

    if (this.isFirstTrack() && this.options.isLooping) {
      this.selectTrack(this.playlist.length - 1) // Go to last track
      console.log('Jump to end of playlist')
      return
    }

    if (!this.isFirstTrack) {
      this.options.currentTrackIndex--
      this.selectTrack(this.options.currentTrackIndex)
      console.log('Playing new track index: ' + this.options.currentTrackIndex)
      return
    }
    if (!this.isFirstTrack()) {
      this.options.currentTrackIndex--
      this.selectTrack(this.options.currentTrackIndex)
      console.log('Playing new track index: ' + this.options.currentTrackIndex)
      return
    } else {
      console.log('This is the first track')
      return
    }
  }

  // Waiting for SDK7 update
  windForward() {
    AudioSource.getMutable(this.speaker).pitch = 5
    this.play()
  }

  windBackwards() {
    // pitch does not accept negative values
    AudioSource.getMutable(this.speaker).pitch = -5
    this.play()
  }

  selectTrack(trackIndex: number, playlist: JukeboxPlaylist = this.playlist) {
    this.options.currentTrackIndex = trackIndex
    this.pause()
    this.play()
  }

  isPlaying(): boolean {
    const audioSource = AudioSource.get(this.speaker)
    if (audioSource.playing) {
      this.options.isPlaying = true
      return audioSource.playing
    } else {
      this.options.isPlaying = false
      return false
    }
  }

  shufflePlaylist(): JukeboxPlaylist {
    // Create a copy of the original playlist
    const shuffledPlaylist: JukeboxPlaylist = [...this.playlist]

    // Apply the shuffle algorithm to the copied playlist
    for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]]
    }

    this.shuffledPlaylist = shuffledPlaylist

    return shuffledPlaylist
  }

  isLastTrack(): boolean {
    return this.options.currentTrackIndex === this.playlist.length - 1
  }

  isFirstTrack(): boolean {
    return this.options.currentTrackIndex === 0
  }

  toggleLoop() {
    if (this.options.isLooping) {
      this.options.isLooping = false
    } else {
      this.options.isLooping = true
    }
    console.log('Is looping: ' + this.options.isLooping)
  }

  toggleLoopTrack() {
    if (this.options.isLoopingTrack) {
      this.options.isLoopingTrack = false
      //AudioSource.getMutable(this.speaker).loop = false
    } else {
      this.options.isLoopingTrack = true
      //AudioSource.getMutable(this.speaker).loop = true
    }
    console.log('Track is looping: ' + this.options.isLoopingTrack)
    this.pause()
    this.play()
  }

  toggleShuffle() {
    if (this.options.isShuffeling) {
      this.options.isShuffeling = false
    } else {
      this.options.isShuffeling = true
    }
    console.log('I shuffeling: ' + this.options.isShuffeling)
  }

  localVolumeUp() {
    if (this.options.volume < 1.1) this.options.volume += 0.1
    console.log('Volume Up ' + this.options.volume)
    this.play()
  }

  localVolumeDown() {
    if (this.options.volume > -0.1) this.options.volume -= 0.1
    console.log('Volume Down ' + this.options.volume)
    this.play()
  }

  globalVolumeUp() {
    this.localVolumeUp()
  }

  globalVolumeDown() {
    this.localVolumeDown()
  }

  toggleGlobal() {
    this.options.global = !this.options.global
  }

  getPlaylist(): JukeboxPlaylist {
    if (this.options.isShuffeling) {
      return this.shuffledPlaylist
    } else {
      return this.playlist
    }
  }

  getCurrentTrack(): string {
    return this.pathToTracks + this.getPlaylist()[this.options.currentTrackIndex].filename
  }

  updateCurrentTrackDuration() {
    this.timer = 0
    const duration = this.getPlaylist()[this.options.currentTrackIndex].duration
    if (duration) {
      // seconds to milliseconds ?
      this.currentTrackDuration = duration
    } else {
      this.currentTrackDuration = 0
    }
  }

  handleNextTrackPlay(dt: number) {
    this.timer += dt

    if (!this.isPlaying()) {
      return
    }

    if (this.currentTrackDuration == 0) {
      return
    }

    if (this.options.isLoopingTrack) {
      // Do nothing
    }

    // check if track is over
    if (this.timer > this.currentTrackDuration) {
      if (this.nextTrack() == false) {
        this.pause()
      }
    }
  }

  // private autoPlayNextTrackSystem(dt: number) {
  //   // iterate over all entiities with a Transform
  //   //console.log(this.checkIfTrackIsOver())
  //   // component: time & trackTime
  // }
}
