import {
  Animator,
  Entity,
  GltfContainer,
  InputAction,
  PointerEventType,
  PointerEvents,
  Transform,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { JukeBoxButtonModels } from '.'
import { Vector3 } from '@dcl/sdk/math'
import { jukeBoxMessageBus } from './messageBus'

export function setupButtons(JBID: string, parent: Entity, models: JukeBoxButtonModels): void {
  const buttons = engine.addEntity()
  Transform.create(buttons, {
    parent: parent
  })

  createButton(buttons, models.play, 'Play')
  createButton(buttons, models.pause, 'Pause')
  createButton(buttons, models.playPause, 'Play/Pause')
  createButton(buttons, models.stop, 'Stop')

  createButton(buttons, models.next, 'Next')
  createButton(buttons, models.previous, 'Previous')
  createButton(buttons, models.backwards, 'Wind Forward')
  createButton(buttons, models.forward, 'Wind Backward')

  createButton(buttons, models.loop, 'Loop')
  createButton(buttons, models.loopTrack, 'Loop Track')
  createButton(buttons, models.shuffle, 'Shuffle')

  createButton(buttons, models.localVolumeUp, 'My Volume Up')
  createButton(buttons, models.localVolumeDown, 'My Volume Down')
  createButton(buttons, models.globalVolumeUp, 'Global Volume Up')
  createButton(buttons, models.globalVolumeDown, 'Global Volume Down')

  createButton(buttons, models.multiplayer, 'Multiplayer')

  function createButton(parent: Entity, modelPath?: string, hoverText?: string): void {
    if (modelPath && modelPath !== '') {
      const button = engine.addEntity()
      GltfContainer.create(button, {
        src: modelPath
      })
      Transform.create(button, {
        parent: parent,
        // position: Vector3.create(Math.random() * 14 - 7, 0, Math.random() * 14 - 7) // 🚧🚧🚧 DEV 🚧🚧🚧
        position: Vector3.create(0, 1, 0) // 🚧🚧🚧 DEV 🚧🚧🚧
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
          jukeBoxMessageBus.emit(JBID + '-button', { hoverText })
          Animator.playSingleAnimation(button, 'PushAndPop')
          // const animation = Animator.getClipOrNull(button, 'Push')
          // console.log(animation)
          // if (animation) animation.playing = true
        }
      )
    }
  }
}
