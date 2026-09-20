import { inject, provide, ref, type InjectionKey } from 'vue'
import { adminService, type LessonInput } from '@/services/admin.service'
import type { CourseModule, Lesson, ProductDetail } from '@/types'
import { useAction } from './useAction'
import { useResource } from './useResource'

function swap<T>(list: T[], index: number, direction: -1 | 1): boolean {
  const target = index + direction
  if (target < 0 || target >= list.length) return false
  const [item] = list.splice(index, 1)
  if (item === undefined) return false
  list.splice(target, 0, item)
  return true
}

function createCourseContent(productId: () => string) {
  const {
    data: course,
    loading,
    error,
    load,
  } = useResource<ProductDetail>(async () => {
    const product = await adminService.product(productId())
    product.modules = (product.modules ?? []).map((m) => ({ ...m, lessons: m.lessons ?? [] }))
    return product
  })
  const { busy, run } = useAction()
  /** La lección abierta: solo una a la vez para que la pantalla del celular no se alargue. */
  const openLessonId = ref<string | null>(null)

  const modules = () => course.value?.modules ?? []

  async function addModule(title: string): Promise<boolean> {
    return run(async () => {
      const created = await adminService.createModule(productId(), title.trim())
      modules().push({ ...created, lessons: [] })
    }, 'Módulo creado')
  }

  async function renameModule(module: CourseModule, title: string): Promise<boolean> {
    return run(async () => {
      await adminService.updateModule(module.id, { title: title.trim() })
      module.title = title.trim()
    }, 'Nombre actualizado')
  }

  async function removeModule(module: CourseModule): Promise<boolean> {
    return run(async () => {
      await adminService.deleteModule(module.id)
      if (course.value) course.value.modules = modules().filter((m) => m.id !== module.id)
    }, 'Módulo eliminado')
  }

  async function addLesson(module: CourseModule, title: string): Promise<boolean> {
    return run(async () => {
      const created = await adminService.createLesson(module.id, { title: title.trim() })
      module.lessons.push(created)
      // Se abre de una para subirle el video, que es lo que sigue.
      openLessonId.value = created.id
    }, 'Lección creada. Ahora súbele el video.')
  }

  async function saveLesson(lesson: Lesson, patch: LessonInput): Promise<boolean> {
    return run(async () => {
      replaceLesson(await adminService.updateLesson(lesson.id, patch))
    }, 'Lección guardada')
  }

  async function removeLesson(lesson: Lesson): Promise<boolean> {
    return run(async () => {
      await adminService.deleteLesson(lesson.id)
      for (const module of modules()) {
        module.lessons = module.lessons.filter((l) => l.id !== lesson.id)
      }
    }, 'Lección eliminada')
  }

  /** Lo que devuelve el API (al guardar o al sincronizar el video) reemplaza a la copia local. */
  function replaceLesson(lesson: Lesson) {
    for (const module of modules()) {
      const index = module.lessons.findIndex((l) => l.id === lesson.id)
      if (index >= 0) module.lessons[index] = { ...module.lessons[index], ...lesson }
    }
  }

  // Se mueve primero en pantalla y después se guarda; si el API falla, se recarga lo real.
  async function persistOrder() {
    const ok = await run(() =>
      adminService.reorder(productId(), {
        modules: modules().map((m) => ({ id: m.id, lessons: m.lessons.map((l) => l.id) })),
      }),
    )
    if (!ok) await load()
  }

  function moveModule(index: number, direction: -1 | 1) {
    if (!busy.value && swap(modules(), index, direction)) void persistOrder()
  }

  function moveLesson(module: CourseModule, index: number, direction: -1 | 1) {
    if (!busy.value && swap(module.lessons, index, direction)) void persistOrder()
  }

  return {
    course,
    loading,
    error,
    busy,
    openLessonId,
    load,
    addModule,
    renameModule,
    removeModule,
    addLesson,
    saveLesson,
    removeLesson,
    replaceLesson,
    moveModule,
    moveLesson,
  }
}

export type CourseContent = ReturnType<typeof createCourseContent>

const KEY: InjectionKey<CourseContent> = Symbol('course-content')

/** La vista lo crea y lo comparte; módulos y lecciones lo reciben sin pasar props en cadena. */
export function provideCourseContent(productId: () => string): CourseContent {
  const content = createCourseContent(productId)
  provide(KEY, content)
  return content
}

export function useCourseContent(): CourseContent {
  const content = inject(KEY)
  if (!content) throw new Error('useCourseContent se usa dentro de AdminCourseContentView')
  return content
}
