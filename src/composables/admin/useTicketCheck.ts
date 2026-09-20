import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { Ticket } from '@/types'
import { errorMessage, errorStatus } from './useAction'

export type CheckKind = 'valid' | 'checked' | 'used' | 'void' | 'missing' | 'error'

export interface CheckResult {
  kind: CheckKind
  code: string
  ticket?: Ticket
  message?: string
}

const kindByStatus: Record<Ticket['status'], CheckKind> = {
  valid: 'valid',
  used: 'used',
  void: 'void',
}

/** Verificación en la puerta: un código entra, una respuesta grande e inequívoca sale. */
export function useTicketCheck(onChange?: () => void) {
  const code = ref('')
  const busy = ref(false)
  const result = ref<CheckResult | null>(null)

  // Los códigos se guardan en mayúsculas; al pegarlos suelen venir con espacios.
  const normalize = (value: string) => value.toUpperCase().replace(/\s+/g, '')

  async function verify() {
    const clean = normalize(code.value)
    if (!clean || busy.value) return
    busy.value = true
    try {
      const ticket = await adminService.verifyTicket(clean)
      result.value = { kind: kindByStatus[ticket.status], code: clean, ticket }
    } catch (err) {
      result.value =
        errorStatus(err) === 404
          ? { kind: 'missing', code: clean }
          : { kind: 'error', code: clean, message: errorMessage(err) }
    } finally {
      busy.value = false
    }
  }

  async function checkIn() {
    const current = result.value
    if (!current?.ticket || busy.value) return
    busy.value = true
    try {
      const ticket = await adminService.checkIn(current.ticket.id)
      result.value = { kind: 'checked', code: current.code, ticket }
      onChange?.()
    } catch (err) {
      if (errorStatus(err) === 409) {
        // Otra persona en la puerta la marcó primero: se muestra como usada, con su hora.
        busy.value = false
        await verify()
        return
      }
      result.value = { ...current, kind: 'error', message: errorMessage(err) }
    } finally {
      busy.value = false
    }
  }

  function reset() {
    result.value = null
    code.value = ''
  }

  return { code, busy, result, verify, checkIn, reset }
}
