import { computed, reactive, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { Product } from '@/types'
import { useAction } from './useAction'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Formulario "Dar acceso". El vencimiento arranca sin elegir y así bloquea el envío. */
export function useAccessGrant(onGranted: () => void, initialEmail = '') {
  const courses = ref<Product[]>([])
  const coursesLoading = ref(true)
  const coursesError = ref(false)
  const { busy, run } = useAction()

  const form = reactive({
    email: initialEmail,
    productIds: [] as string[],
    /** undefined = sin elegir · null = no se revoca · ISO = se revoca ese día */
    expiresAt: undefined as string | null | undefined,
    note: '',
  })
  /** Cambiar la key remonta ExpiryChoice y lo deja otra vez sin selección. */
  const expiryKey = ref(0)

  const emailOk = computed(() => EMAIL.test(form.email.trim()))
  const ready = computed(
    () => emailOk.value && form.productIds.length > 0 && form.expiresAt !== undefined,
  )
  const missing = computed(() => {
    if (!emailOk.value) return 'Escribe el correo del alumno.'
    if (!form.productIds.length) return 'Elige al menos una clase.'
    if (form.expiresAt === undefined)
      return 'Elige si el acceso se revoca en una fecha o no se revoca.'
    return ''
  })

  async function loadCourses() {
    coursesLoading.value = true
    coursesError.value = false
    try {
      courses.value = (await adminService.products({ type: 'course', limit: 100 })).items
    } catch {
      coursesError.value = true
    } finally {
      coursesLoading.value = false
    }
  }

  function toggle(id: string) {
    form.productIds = form.productIds.includes(id)
      ? form.productIds.filter((item) => item !== id)
      : [...form.productIds, id]
  }

  async function submit() {
    if (!ready.value || form.expiresAt === undefined) return
    // La clave expiresAt viaja SIEMPRE, también cuando es null: el API la exige.
    const body = {
      email: form.email.trim().toLowerCase(),
      productIds: form.productIds,
      expiresAt: form.expiresAt,
      note: form.note.trim(),
    }
    const ok = await run(
      () => adminService.grantAccess(body),
      'Acceso dado. Al alumno le llega un correo con los detalles.',
    )
    if (!ok) return
    form.email = ''
    form.productIds = []
    form.expiresAt = undefined
    form.note = ''
    expiryKey.value += 1
    onGranted()
  }

  return {
    form,
    courses,
    coursesLoading,
    coursesError,
    busy,
    ready,
    missing,
    expiryKey,
    loadCourses,
    toggle,
    submit,
  }
}
