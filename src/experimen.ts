import {
  AudioSource,
  GltfContainer,
  InputAction,
  Transform,
  VideoTexture,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

export function playAudioButton() {
  // Result
  // AudioSource.getMutable(audioSource).playing is stopping audio
  // AudioSource.get(audioSource).playing is not stopping audio

  const audioSource = engine.addEntity()
  Transform.create(audioSource, {
    position: Vector3.create(8, 1, 8)
  })
  AudioSource.create(audioSource, {
    audioClipUrl: 'audio/jukebox/whats-this.mp3',
    playing: false
  })

  const playButton = engine.addEntity()
  Transform.create(playButton, {
    parent: audioSource
  })

  GltfContainer.create(playButton, {
    src: 'models/CardboardBox_02.glb'
  })

  pointerEventsSystem.onPointerDown(
    {
      entity: playButton,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'play'
      }
    },
    function () {
      console.log('Clicked Play ')
      console.log(AudioSource.get(audioSource).playing)
      if (AudioSource.get(audioSource).playing == true) {
        console.log('already playing')
      } else {
        AudioSource.getMutable(audioSource).playing = true
      }
    }
  )
}

export function getTrackTime() {
  // Result
  // Undefined

  const audioSource = engine.addEntity()
  Transform.create(audioSource, {
    position: Vector3.create(2, 1, 2)
  })
  AudioSource.create(audioSource, {
    audioClipUrl: 'audio/jukebox/whats-this.mp3',
    playing: true,
    currentTime: 10,
    loop: true
  })

  const button = engine.addEntity()
  Transform.create(button, {
    parent: audioSource
  })

  GltfContainer.create(button, {
    src: 'models/CardboardBox_02.glb'
  })

  pointerEventsSystem.onPointerDown(
    {
      entity: button,
      opts: {
        button: InputAction.IA_POINTER,
        hoverText: 'play'
      }
    },
    function () {
      console.log('Clicked Get Tracks Time ')
      console.log('Time first ' + AudioSource.get(audioSource).currentTime)
      if (AudioSource.get(audioSource).playing == true) {
        AudioSource.stopSound(audioSource, false)
        console.log('Time ' + AudioSource.get(audioSource).currentTime)
      } else {
        AudioSource.playSound(audioSource, 'audio/jukebox/whats-this.mp3', false)
        console.log('Time ' + AudioSource.get(audioSource).currentTime)
      }
      //   console.log(AudioSource.stopSound())
      // if (AudioSource.get(audioSource).playing == true) {
      //   console.log('already playing')
      // } else {
      //   AudioSource.getMutable(audioSource).playing = true
      // }
    }
  )
}
