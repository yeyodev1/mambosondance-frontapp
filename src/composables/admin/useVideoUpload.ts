import { computed, onBeforeUnmount, ref } from 'vue'
import * as tus from 'tus-js-client'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Lesson } from '@/types'
import { errorMessage } from './useAction'

type Phase = 'idle' | 'signing' | 'uploading' | 'syncing' | 'error'

/**
 * Subida de un video de lección. El archivo NO pasa por nuestro backend (Vercel
 * corta los cuerpos grandes): el API crea el video en Bunny y devuelve una firma,
 * y el navegador sube directo a Bunny por TUS, que reanuda si la red se cae.
 */
export function useVideoUpload(lessonId: () => string, onLesson: (lesson: Lesson) => void) {
  const phase = ref<Phase>('idle')
  const progress = ref(0)
  const error = ref('')
  const fileName = ref('')
  const toast = useToastStore()
  let upload: tus.Upload | null = null

  const working = computed(() => phase.value === 'signing' || phase.value === 'uploading')

  // Cerrar la pestaña a media subida deja el video roto en Bunny: el navegador avisa.
  function warnBeforeLeave(event: BeforeUnloadEvent) {
    event.preventDefault()
    event.returnValue = ''
  }

  function guard(on: boolean) {
    if (on) window.addEventListener('beforeunload', warnBeforeLeave)
    else window.removeEventListener('beforeunload', warnBeforeLeave)
  }

  function fail(message: string) {
    guard(false)
    phase.value = 'error'
    error.value = message
    toast.error(message)
  }

  async function start(file: File) {
    if (working.value) return
    if (!file.type.startsWith('video/')) {
      fail('Ese archivo no es un video. Elige un .mp4 o .mov.')
      return
    }

    error.value = ''
    progress.value = 0
    fileName.value = file.name
    phase.value = 'signing'
    guard(true)

    let signed
    try {
      signed = await adminService.videoUpload(lessonId())
    } catch (err) {
      fail(errorMessage(err, 'No se pudo preparar la subida del video'))
      return
    }

    phase.value = 'uploading'
    upload = new tus.Upload(file, {
      endpoint: signed.endpoint,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        AuthorizationSignature: signed.signature,
        AuthorizationExpire: String(signed.expire),
        VideoId: signed.videoId,
        LibraryId: String(signed.libraryId),
      },
      metadata: { filetype: file.type, title: file.name },
      // Cada subida crea un video nuevo en Bunny: no sirve reanudar una anterior.
      storeFingerprintForResuming: false,
      onProgress(sent, total) {
        progress.value = total ? Math.floor((sent / total) * 100) : 0
      },
      onError() {
        fail('La subida se interrumpió. Revisa tu conexión y vuelve a subir el video.')
      },
      onSuccess() {
        guard(false)
        progress.value = 100
        toast.success('Video subido. Ahora se está procesando.')
        void sync()
      },
    })
    upload.start()
  }

  /** Pregunta a Bunny cómo va el video; se repite hasta que quede "listo". */
  async function sync() {
    if (phase.value === 'syncing') return
    phase.value = 'syncing'
    try {
      const lesson = await adminService.videoSync(lessonId())
      onLesson(lesson)
      phase.value = 'idle'
      if (lesson.videoStatus === 'ready') toast.success('El video ya está listo')
    } catch (err) {
      phase.value = 'idle'
      toast.error(errorMessage(err, 'No se pudo consultar el estado del video'))
    }
  }

  async function cancel() {
    if (upload) await upload.abort().catch(() => undefined)
    upload = null
    guard(false)
    phase.value = 'idle'
    progress.value = 0
  }

  onBeforeUnmount(() => {
    if (upload && phase.value === 'uploading') void upload.abort().catch(() => undefined)
    guard(false)
  })

  return { phase, progress, error, fileName, working, start, sync, cancel }
}
