// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { engine } from '@dcl/sdk/ecs'

import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'

import { Jukebox, JukeboxPlaylist } from './jukebox'
import { getTrackTime, playAudioButton } from './experimen'

// import { myProfile, syncEntity } from '@dcl/sdk/network'
// syncEntity()

export function main() {
  const playlist: JukeboxPlaylist = [
    {
      filename: 'as-we-parted-at-the-gate.mp3',
      title: 'As we parted at the gate',
      author: 'Jimmy',
      published: '1910',
      duration: 5
    },
    {
      filename: 'sounds_hit01.mp3',
      duration: 1
    },

    {
      filename: 'atlantic-dance-orchestra.mp3',
      title: 'Dance with me',
      author: 'Atlantic dance orchestra',
      published: '1899',
      duration: 20
    },
    {
      filename: 'whats-this.mp3',
      title: 'Whats this?',
      author: 'A musician',
      published: '1912',
      duration: 20
    }
  ]

  const jukebox = new Jukebox({
    playlist: playlist,
    pathToTracks: 'audio/jukebox/',
    transform: {
      position: Vector3.create(8, 0, 8)
    },
    models: {
      body: 'models/Boombox_01.glb',
      buttons: {
        play: 'models/Buttons/Button_Play.glb',
        pause: 'models/Buttons/Button_Pause.glb',
        playPause: 'models/Buttons/Button_PlayPause.glb',
        stop: 'models/Buttons/Button_Stop.glb',
        next: 'models/Buttons/Button_Next.glb',
        previous: 'models/Buttons/Button_Previous.glb',
        forward: 'models/Buttons/Button_Forward.glb',
        backwards: 'models/Buttons/Button_Backwards.glb',
        loop: 'models/Buttons/Button_Loop.glb',
        loopTrack: 'models/Buttons/Button_LoopTrack.glb',
        shuffle: 'models/Buttons/Button_Shuffle.glb',
        localVolumeUp: 'models/Buttons/Button_VolumeUp.glb',
        localVolumeDown: 'models/Buttons/Button_VolumeDown.glb',
        globalVolumeUp: 'models/Buttons/Button_GlobalVolumeUp.glb',
        globalVolumeDown: 'models/Buttons/Button_GlobalVolumeDown.glb',
        multiplayer: 'models/Buttons/Button_Multiplayer.glb'
      }
    },
    options: {
      id: 'Jukebox-1',
      isPlaying: true,
      currentTrackIndex: 0,
      //playMode: PlayMode.SINGLE_TRACK, // whether one track is played or the playlist. PlayMode.SINGLE_TRACK or PlayMode.FULL_PLAYLIST
      global: true, // whether the audio plays at constant volume across the scene.
      volume: 1,
      isLooping: false,
      isLoopingTrack: false,
      isShuffeling: false,
      multiplayer: true
    }
  })

  // 🔥🔥🔥 can i get this instance?
  // Start system that plays next song when track is finished
  function autoPlayNextTrackSystem(dt: number) {
    jukebox.handleNextTrackPlay(dt)
  }
  engine.addSystem(autoPlayNextTrackSystem)

  // 🚧 Make things optional

  // 🚧 🚧 🚧 Experiments
  // playAudioButton()
  // getTrackTime()

  // Defining behavior. See `src/systems.ts` file.
  // engine.addSystem(circularSystem)
  // engine.addSystem(changeColorSystem)

  // draw UI. Here is the logic to spawn cubes.
  // setupUi()
}
