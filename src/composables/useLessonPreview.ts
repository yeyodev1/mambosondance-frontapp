import { ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { errorMessage } from './useAsyncData'
import type { Lesson } from '@/types'

/** Estado del modal de vista previa: pide la URL firmada recién al abrir. */
export function useLessonPreview() {
  const lesson = ref<Lesson | null>(null)
  const embedUrl = ref('')
  const loading = ref(false)
  const error = ref('')

  async function open(target: Lesson) {
    lesson.value = target
    embedUrl.value = ''
    error.value = ''
    loading.value = true
    try {
      const playback = await catalogService.lessonPlayback(target.id)
      // Si cerraron o abrieron otra mientras cargaba, esta respuesta ya no aplica.
      if (lesson.value?.id === target.id) embedUrl.value = playback.embedUrl
    } catch (err) {
      if (lesson.value?.id === target.id) error.value = errorMessage(err)
    } finally {
      if (lesson.value?.id === target.id) loading.value = false
    }
  }

  function close() {
    lesson.value = null
    embedUrl.value = ''
    loading.value = false
  }

  function retry() {
    if (lesson.value) open(lesson.value)
  }

  return { lesson, embedUrl, loading, error, open, close, retry }
}
