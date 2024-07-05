// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { engine } from '@dcl/sdk/ecs'

import { setupUi } from './ui'

import { Jukebox, JukeboxPlaylist } from './jukebox'
import { getTrackTime, playAudioButton } from './experimen'
import { PlaylistPlayer, PlaylistPlayerSettings, Playlist } from './jukebox/playlistPlayer'
import { playlistPlayerButtons } from './jukebox/buttons'

export function main() {
  const playlist: Playlist = [
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
      duration: 5
    },
    {
      filename: 'whats-this.mp3',
      title: 'Whats this?',
      author: 'A musician',
      published: '1912',
      duration: 5
    }
  ]

  // 🚧 🚧 🚧🚧 🚧 🚧🚧 🚧 🚧🚧 🚧 🚧 🚧 Make things optional
  const settings: PlaylistPlayerSettings = {
    pathToTracks: 'audio/jukebox/',
    autoplay: true,
    isPlaying: true, // defines if music is autoplaying on scene start
    global: false, // whether the audio plays at constant volume across the scene.
    volume: 1, // a number between 0 - 1
    currentTrackIndex: 2, // the starting track
    loopPlaylist: false,
    loopTrack: false,
    playlist: playlist,
    shufflePlaylist: false,
    shuffledPlaylist: [3, 2, 1, 0],
    synced: true
  }
  const musicPlayer = new PlaylistPlayer(settings)

  playlistPlayerButtons(musicPlayer)

  // 🚧 🚧 🚧 Experiments
  // playAudioButton()
  // getTrackTime()
}
