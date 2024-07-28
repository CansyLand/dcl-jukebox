import {
  Animator,
  Entity,
  GltfContainer,
  InputAction,
  Schemas,
  Transform,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { PlaylistPlayer } from './playlistPlayer'
import { Vector3 } from '@dcl/sdk/math'
import { syncEntity } from '@dcl/sdk/network'

interface ButtonOptions {
  parent: Entity
  modelPath: string
  hoverText: string
  sync: boolean
  onClick: () => void
}

// const ButtonComponent = engine.defineComponent('ButtonComponent', {
//   active: Schemas.Boolean
// })

let buttonEnumId = 200 // This is used as ID for syncEntity()

export function playlistPlayerButtons(playlistPlayer: PlaylistPlayer) {
  const parent = engine.addEntity()
  Transform.create(parent, {
    position: Vector3.create(8, 1, 8)
  })

  const sync = playlistPlayer.isSynced()

  const playButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Play.glb',
    hoverText: 'Play',
    sync: sync,
    onClick: () => playlistPlayer.play()
  })

  const pauseButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Pause.glb',
    hoverText: 'Pause',
    sync: sync,
    onClick: () => playlistPlayer.pause()
  })

  const playPauseButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_PlayPause.glb',
    hoverText: 'Play/Pause',
    sync: sync,
    onClick: () => playlistPlayer.playPause()
  })

  const stopButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Stop.glb',
    hoverText: 'Stop',
    sync: sync,
    onClick: () => playlistPlayer.stop()
  })

  const nextButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Next.glb',
    hoverText: 'Next Track',
    sync: sync,
    onClick: () => playlistPlayer.nextTrack()
  })

  const previousButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Previous.glb',
    hoverText: 'Previous Track',
    sync: sync,
    onClick: () => playlistPlayer.previousTrack()
  })

  const windForwardButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Forward.glb',
    hoverText: 'Wind Forward',
    sync: sync,
    onClick: () => playlistPlayer.windForward()
  })

  // Uncomment and update if necessary
  // const windBackwardsButton = createButton({
  //   playlsitPlayer: playlistPlayer, parent: parent,
  //   modelPath: 'models/demo/Button_Backwards.glb',
  //   hoverText: 'Wind Backwards',
  //   animation: 'PushAndPop', // Update as needed
  //   sync: sync,
  //   onClick: () => playlistPlayer.windBackwards()
  // });

  const loopButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Loop.glb',
    hoverText: 'Loop Playlist',
    sync: sync,
    onClick: () => playlistPlayer.toggleLoop()
  })

  const loopTrackButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_LoopTrack.glb',
    hoverText: 'Loop Track',
    sync: sync,
    onClick: () => playlistPlayer.toggleLoopTrack()
  })

  const shuffleButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Shuffle.glb',
    hoverText: 'Shuffle',
    sync: sync,
    onClick: () => playlistPlayer.toggleShuffle()
  })

  const volumeUpButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_VolumeUp.glb',
    hoverText: 'Volume Up',
    sync: sync,
    onClick: () => playlistPlayer.volumeUp()
  })

  const volumeDownButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_VolumeDown.glb',
    hoverText: 'Volume Down',
    sync: sync,
    onClick: () => playlistPlayer.volumeDown()
  })

  const globalVolumeButton = createButton({
    parent: parent,
    modelPath: 'models/demo/Button_Global.glb',
    hoverText: 'Global Volume',
    sync: sync,
    onClick: () => playlistPlayer.toggleGlobal()
  })
  // createButton(parent, 'models/demo/Button_GlobalVolumeDown.glb', 'Global Volume Down', () =>

  playlistPlayer.on('stop', () => {})

  playlistPlayer.on('pause', () => {})
}

function createButton(options: ButtonOptions): Entity {
  const { parent, modelPath, hoverText, sync, onClick } = options

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
  return button
}
