// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { engine, GltfContainer, Transform } from '@dcl/sdk/ecs'

import { Jukebox, JukeboxPlaylist } from './jukebox'
import { PlaylistPlayer, PlaylistPlayerSettings, Playlist } from './jukebox/playlistPlayer'
import { playlistPlayerButtons } from './jukebox/buttons'
import { playlistPlayerButtons as jukeboxButtonsSugar } from './jukebox/buttonsSugar'
import { playlistPlayerButtons as jukeboxButtonsSalt } from './jukebox/buttonsSalt'
import { ButtonConfig, createPlaylistButtons } from './jukebox/playlistButtons'

export function main() {
  const playlist: Playlist = [
    {
      filename: 'as-we-parted-at-the-gate.mp3',
      duration: 20
    },
    {
      filename: 'sounds_hit01.mp3',
      duration: 1
    },

    {
      filename: 'atlantic-dance-orchestra.mp3',
      duration: 20
    },
    {
      filename: 'whats-this.mp3',
      duration: 20
    }
  ]

  const settings: PlaylistPlayerSettings = {
    pathToTracks: 'audio/jukebox/',
    playlist: playlist,
    autoplay: true, // defines wheter next trac is played automaticaly
    isPlaying: false, // defines if music is autoplaying on scene start
    global: false, // whether the audio plays at constant volume across the scene.
    volume: 1, // a number between 0 - 1
    currentTrackIndex: 2, // the starting track
    loopPlaylist: true,
    loopTrack: false,
    shufflePlaylist: false,
    synced: true
  }

  // Basic Music Player
  // const musicPlayer = new PlaylistPlayer(settings)
  // playlistPlayerButtons(musicPlayer)

  // const body = engine.addEntity()
  // GltfContainer.create(body, {
  //   src: 'models/body.glb'
  // })
  // Transform.create(body, {
  //   position: Vector3.create(8, 1, 8)
  // })

  // JUKEBOX SUGAR
  // JUKEBOX SUGAR
  // JUKEBOX SUGAR

  // Place jukebox model in scene
  const sugarJukeboxModel = engine.addEntity()
  GltfContainer.create(sugarJukeboxModel, {
    src: 'models/sugar/sugar-jukebox.glb'
  })
  Transform.create(sugarJukeboxModel, {
    position: Vector3.create(8, 0, 6)
  })

  // Attach playlist player to jukebox model
  const sugarPlaylistPlayer = new PlaylistPlayer(settings, sugarJukeboxModel)

  // Define buttons
  const sugarJukeboxButtons: ButtonConfig[] = [
    {
      modelPath: 'models/sugar/sugar-button-play.glb',
      hoverText: 'Play',
      animation: 'PushAndPop',
      action: () => sugarPlaylistPlayer.play()
    },
    {
      modelPath: 'models/sugar/sugar-button-stop.glb',
      hoverText: 'Stop',
      animation: 'PushAndPop',
      action: () => sugarPlaylistPlayer.stop()
    },
    {
      modelPath: 'models/sugar/sugar-button-next.glb',
      hoverText: 'Next',
      animation: 'PushAndPop',
      action: () => sugarPlaylistPlayer.nextTrack()
    },
    {
      modelPath: 'models/sugar/sugar-button-previous.glb',
      hoverText: 'Back',
      animation: 'PushAndPop',
      action: () => sugarPlaylistPlayer.previousTrack()
    }
  ]

  // Attach buttons to playlist player
  createPlaylistButtons(sugarPlaylistPlayer, sugarJukeboxModel, sugarJukeboxButtons)

  // JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT
  // JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT
  // JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT JUKEBOX SALT

  const settingsSalt: PlaylistPlayerSettings = {
    pathToTracks: 'audio/jukebox/',
    playlist: playlist
  }

  // Place jukebox model in scene
  const saltJukeboxModel = engine.addEntity()
  GltfContainer.create(saltJukeboxModel, {
    src: 'models/salt/salt-jukebox.glb'
  })
  Transform.create(saltJukeboxModel, {
    position: Vector3.create(8, 0, 10)
  })

  // Attach playlist player to jukebox model
  const saltPlaylistPlayer = new PlaylistPlayer(settingsSalt, saltJukeboxModel)

  // Define buttons
  const saltJukeboxButtons: ButtonConfig[] = [
    {
      modelPath: 'models/salt/salt-button-play.glb',
      hoverText: 'Play',
      animation: 'PushAndPopSalt',
      action: () => saltPlaylistPlayer.play()
    },
    {
      modelPath: 'models/salt/salt-button-stop.glb',
      hoverText: 'Stop',
      animation: 'PushAndPopSalt',
      action: () => saltPlaylistPlayer.stop()
    },
    {
      modelPath: 'models/salt/salt-button-next.glb',
      hoverText: 'Next',
      animation: 'PushAndPopSalt',
      action: () => saltPlaylistPlayer.nextTrack()
    },
    {
      modelPath: 'models/salt/salt-button-previous.glb',
      hoverText: 'Back',
      animation: 'PushAndPopSalt',
      action: () => saltPlaylistPlayer.previousTrack()
    },
    {
      modelPath: 'models/salt/salt-button-vol-up.glb',
      hoverText: 'Volume Up',
      animation: 'PushAndPopVolume',
      action: () => saltPlaylistPlayer.volumeUp()
    },
    {
      modelPath: 'models/salt/salt-button-vol-down.glb',
      hoverText: 'Volume Up',
      animation: 'PushAndPopVolume',
      action: () => saltPlaylistPlayer.volumeDown()
    }
  ]

  // Attach buttons to playlist player
  createPlaylistButtons(saltPlaylistPlayer, saltJukeboxModel, saltJukeboxButtons)
}
