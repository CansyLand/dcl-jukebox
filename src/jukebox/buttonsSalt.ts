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
  animation: string
  sync: boolean
  onClick: () => void
}

let buttonEnumId = 200 // This is used as ID for syncEntity()

export function playlistPlayerButtons(playlistPlayer: PlaylistPlayer) {
  const parent = engine.addEntity()
  Transform.create(parent, {
    position: Vector3.create(8, 0, 8)
  })

  const sync = playlistPlayer.isSynced()

  // Define Buttons Here

  const playButton = createButton({
    parent: parent,
    modelPath: 'models/salt/salt-button-play.glb',
    hoverText: 'Play',
    animation: 'PushAndPopSalt', // the name of the animation in the GLB/GLTF file
    sync: sync,
    onClick: () => playlistPlayer.play()
  })

  const stopButton = createButton({
    parent: parent,
    modelPath: 'models/salt/salt-button-stop.glb',
    hoverText: 'Stop',
    animation: 'PushAndPopSalt',
    sync: sync,
    onClick: () => playlistPlayer.stop()
  })

  const nextButton = createButton({
    parent: parent,
    modelPath: 'models/salt/salt-button-next.glb',
    hoverText: 'Next Track',
    animation: 'PushAndPopSalt',
    sync: sync,
    onClick: () => playlistPlayer.nextTrack()
  })

  const previousButton = createButton({
    parent: parent,
    modelPath: 'models/salt/salt-button-previous.glb',
    hoverText: 'Previous Track',
    animation: 'PushAndPopSalt',
    sync: sync,
    onClick: () => playlistPlayer.previousTrack()
  })

  const volumeUpButton = createButton({
    parent: parent,
    modelPath: 'models/salt/salt-button-vol-up.glb',
    hoverText: 'Volume Up',
    animation: 'PushAndPopVolume',
    sync: sync,
    onClick: () => playlistPlayer.volumeUp()
  })

  const volumeDownButton = createButton({
    parent: parent,
    modelPath: 'models/salt/salt-button-vol-down.glb',
    hoverText: 'Volume Down',
    animation: 'PushAndPopVolume',
    sync: sync,
    onClick: () => playlistPlayer.volumeDown()
  })

  playlistPlayer.on('stop', () => {})

  playlistPlayer.on('pause', () => {})
}

function createButton(options: ButtonOptions): Entity {
  const { parent, modelPath, hoverText, animation, sync, onClick } = options

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
        clip: animation,
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
      Animator.playSingleAnimation(button, animation)
      onClick()
    }
  )
  return button
}
