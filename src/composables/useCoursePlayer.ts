import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { meService } from '@/services/me.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Lesson, MyCourseDetail } from '@/types'

export function useCoursePlayer() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const course = ref<MyCourseDetail | null>(null)
  const loading = ref(true)
  const error = ref('')

  const embedUrl = ref('')
  const playbackLoading = ref(false)
  const playbackError = ref('')
  const saving = ref(false)

  const slug = computed(() => String(route.params.slug || ''))
  const blocked = computed(() => Boolean(course.value) && course.value?.access.status !== 'vigente')

  const lessons = computed<Lesson[]>(() =>
    (course.value?.modules ?? []).flatMap((module) => module.lessons),
  )
  /** Solo se puede navegar a lecciones con video listo; el resto es "Próximamente". */
  const playable = computed(() => lessons.value.filter((l) => l.videoStatus === 'ready'))
  const completedCount = computed(() => lessons.value.filter((l) => l.completed).length)

  const current = computed<Lesson | null>(() => {
    const wanted = typeof route.query.leccion === 'string' ? route.query.leccion : ''
    return (
      playable.value.find((l) => l.id === wanted) ||
      // Sin lección en la URL se retoma en la primera que falta por ver.
      playable.value.find((l) => !l.completed) ||
      playable.value[0] ||
      null
    )
  })

  const index = computed(() => playable.value.findIndex((l) => l.id === current.value?.id))
  const previous = computed(() => (index.value > 0 ? playable.value[index.value - 1] : null))
  const next = computed(() =>
    index.value >= 0 && index.value < playable.value.length - 1
      ? playable.value[index.value + 1]
      : null,
  )

  async function load() {
    // Al salir de la ruta el slug queda vacío un instante antes del desmontaje.
    if (!slug.value || route.name !== 'CoursePlayer') return
    loading.value = true
    error.value = ''
    course.value = null
    try {
      course.value = await meService.course(slug.value)
      document.title = `${course.value.title} — Mis clases`
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  // Cada petición lleva su turno: si el alumno cambia rápido de lección, una
  // respuesta vieja no puede pisar el video de la lección actual.
  let turn = 0
  async function loadPlayback(lessonId: string) {
    const mine = ++turn
    embedUrl.value = ''
    playbackError.value = ''
    playbackLoading.value = true
    try {
      const playback = await meService.playback(lessonId)
      if (mine === turn) embedUrl.value = playback.embedUrl
    } catch (e) {
      if (mine === turn) playbackError.value = (e as ApiError).message
    } finally {
      if (mine === turn) playbackLoading.value = false
    }
  }

  function select(lesson: Lesson) {
    if (lesson.videoStatus !== 'ready') return
    router.replace({ query: { ...route.query, leccion: lesson.id } })
  }

  async function toggleComplete() {
    const lesson = current.value
    if (!lesson || saving.value) return
    const value = !lesson.completed
    saving.value = true
    lesson.completed = value
    try {
      await meService.complete(lesson.id, value)
    } catch (e) {
      lesson.completed = !value
      toast.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  watch(slug, load, { immediate: true })
  watch(
    () => (blocked.value ? '' : current.value?.id || ''),
    (id) => {
      if (id) loadPlayback(id)
      else embedUrl.value = ''
    },
    { immediate: true },
  )

  return {
    course,
    loading,
    error,
    blocked,
    lessons,
    completedCount,
    current,
    previous,
    next,
    embedUrl,
    playbackLoading,
    playbackError,
    saving,
    slug,
    load,
    select,
    toggleComplete,
    retryPlayback: () => current.value && loadPlayback(current.value.id),
  }
}
