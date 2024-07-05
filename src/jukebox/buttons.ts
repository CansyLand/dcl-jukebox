import { Animator, Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { PlaylistPlayer } from './playlistPlayer'
import { Vector3 } from '@dcl/sdk/math'
import { syncEntity } from '@dcl/sdk/network'

let buttonEnumId = 200 // This is used as ID for syncEntity()

export function playlistPlayerButtons(playlistPlayer: PlaylistPlayer) {
  const parent = engine.addEntity()
  Transform.create(parent, {
    position: Vector3.create(8, 1, 8)
  })

  const sync = playlistPlayer.isSynced()

  createButton(parent, 'models/Buttons/Button_Play.glb', 'Play', sync, () => playlistPlayer.play())
  createButton(parent, 'models/Buttons/Button_Pause.glb', 'Pause', sync, () => playlistPlayer.pause())
  createButton(parent, 'models/Buttons/Button_PlayPause.glb', 'Pause', sync, () => playlistPlayer.playPause())
  createButton(parent, 'models/Buttons/Button_Stop.glb', 'Stop', sync, () => playlistPlayer.stop())
  createButton(parent, 'models/Buttons/Button_Next.glb', 'Next Track', sync, () => playlistPlayer.nextTrack())
  createButton(parent, 'models/Buttons/Button_Previous.glb', 'Previous Track', sync, () =>
    playlistPlayer.previousTrack()
  )
  createButton(parent, 'models/Buttons/Button_Forward.glb', 'Wind Forward', sync, () => playlistPlayer.windForward())
  //   createButton(parent, 'models/Buttons/Button_Backwards.glb', 'Wind Backwards', () => playlistPlayer.windBackwards())

  createButton(parent, 'models/Buttons/Button_Loop.glb', 'Loop Playlist', sync, () => playlistPlayer.toggleLoop())
  createButton(parent, 'models/Buttons/Button_LoopTrack.glb', 'Loop Track', sync, () =>
    playlistPlayer.toggleLoopTrack()
  )
  createButton(parent, 'models/Buttons/Button_Shuffle.glb', 'Shuffle', sync, () => playlistPlayer.toggleShuffle())

  createButton(parent, 'models/Buttons/Button_VolumeUp.glb', 'Volume Up', sync, () => playlistPlayer.volumeUp())
  createButton(parent, 'models/Buttons/Button_VolumeDown.glb', 'Volume Down', sync, () => playlistPlayer.volumeDown())
  createButton(parent, 'models/Buttons/Button_Global.glb', 'Global Volume', sync, () => playlistPlayer.toggleGlobal())
  // createButton(parent, 'models/Buttons/Button_GlobalVolumeDown.glb', 'Global Volume Down', () =>
  //   playlistPlayer.volumeDown()
  // )

  //   createButton(parent, 'models/Buttons/Button_Multiplayer.glb', 'Multiplayer', () => playlistPlayer.multiplayer())
}

function createButton(
  parent: Entity,
  modelPath: string,
  hoverText: string,
  sync: boolean,
  //   buttonEnumId: ButtonEnumId,
  onClick: () => void
): void {
  const button = engine.addEntity()

  GltfContainer.create(button, {
    src: modelPath
  })

  Transform.create(button, {
    parent: parent,
    position: Vector3.create(0, 0, 0)
  })

  Animator.create(button, {
    states: [
      {
        clip: 'PushAndPop',
        playing: true,
        loop: false
      }
    ]
  })

  if (sync) {
    syncEntity(button, [Animator.componentId], buttonEnumId++)
  }

  pointerEventsSystem.onPointerDown(
    {
      entity: button,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: hoverText
      }
    },
    function () {
      console.log('Clicked button: ' + hoverText)
      Animator.playSingleAnimation(button, 'PushAndPop')
      onClick()
    }
  )
}
