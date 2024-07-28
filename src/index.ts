import { createJukeboxSugar } from './jukeboxSugar'
import { createJukeboxSalt } from './jukeboxSalt'
import { createHeadlessPlayer } from './jukeboxHeadless'
import { createJukeboxDemo } from './jukeboxDemo'

export function main() {
  // Playlist is in playlistPlayer/playlist.ts

  // Jukebox sugar
  createJukeboxSugar()

  // Jukebox salt
  createJukeboxSalt()

  // Jukebox demo with all button options
  // createJukeboxDemo()

  // Jukebox headless mode (invisible player)
  // createHeadlessPlayer()
}
