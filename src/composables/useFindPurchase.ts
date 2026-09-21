import { computed, onUnmounted, ref } from 'vue'
import { rules, useFormErrors } from '@/composables/useFormErrors'
import { orderService } from '@/services/order.service'
import { studentCopy } from '@/config/student'
import type { ApiError } from '@/types'

/** El backend admite 3 reenvíos cada 15 minutos: la espera evita gastarlos por impaciencia. */
const COOLDOWN_SECONDS = 30

/**
 * "Encontrar mi compra": pide el reenvío de los accesos por correo. El resultado es
 * siempre el mismo mensaje, exista o no una compra, para no revelar quién compró.
 */
export function useFindPurchase() {
  const { errors, check } = useFormErrors<'email' | 'number'>()

  const email = ref('')
  const number = ref('')
  const loading = ref(false)
  const error = ref('')
  const sent = ref(false)

  // Cuenta contra una hora fija: una pestaña en segundo plano frena los intervalos.
  const cooldown = ref(0)
  const waiting = computed(() => cooldown.value > 0)
  let deadline = 0
  let timer: number | undefined

  function stopTimer() {
    if (timer) window.clearInterval(timer)
    timer = undefined
  }

  function startCooldown() {
    stopTimer()
    deadline = Date.now() + COOLDOWN_SECONDS * 1000
    cooldown.value = COOLDOWN_SECONDS
    timer = window.setInterval(() => {
      cooldown.value = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      if (cooldown.value === 0) stopTimer()
    }, 1000)
  }

  /** Acepta "123", "ms000123" o "MS-000123" y devuelve siempre la forma del backend. */
  function normalizeNumber(value: string): string | null {
    const raw = value.trim()
    if (!raw) return ''
    if (!/^(ms)?[\s-]*\d{1,9}$/i.test(raw)) return null
    return `MS-${raw.replace(/\D/g, '').padStart(6, '0')}`
  }

  async function submit() {
    if (loading.value || waiting.value) return
    error.value = ''
    const normalized = normalizeNumber(number.value)
    const valid = check({
      email: rules.email(email.value),
      number: normalized === null ? studentCopy.auth.findPurchase.numberError : '',
    })
    if (!valid) return

    loading.value = true
    try {
      await orderService.find(email.value.trim().toLowerCase(), normalized || undefined)
      if (normalized) number.value = normalized
      sent.value = true
      startCooldown()
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  /** Vuelve al formulario; la espera sigue corriendo para que no sirva de atajo. */
  function editEmail() {
    sent.value = false
  }

  onUnmounted(stopTimer)

  return { email, number, errors, loading, error, sent, cooldown, waiting, submit, editEmail }
}
