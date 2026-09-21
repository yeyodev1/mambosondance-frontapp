import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { orderService } from '@/services/order.service'
import { studentCopy } from '@/config/student'
import type { ApiError, Order, OrderConfirmation, Ticket } from '@/types'

export type PaymentState = 'confirming' | 'paid' | 'canceled' | 'failed' | 'error'

const RETRIES = 3
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

/**
 * Payphone reversa el cobro si nadie lo confirma en 5 minutos. Por eso `confirm()`
 * se llama apenas monta la vista y reintenta sola ante fallos de red; el backend es
 * idempotente, así que recargar la página repite la llamada sin efectos dobles.
 *
 * La vista no exige sesión: todo lo que pinta (entradas, cursos, correo) viene en la
 * respuesta de la confirmación, no de los endpoints `/me/*`.
 */
export function usePaymentResult() {
  const route = useRoute()
  const cart = useCartStore()
  const userStore = useUserStore()

  const state = ref<PaymentState>('confirming')
  const message = ref('')
  const order = ref<Order | null>(null)
  const tickets = ref<Ticket[]>([])
  const courses = ref<OrderConfirmation['courses']>([])
  const hasPhysical = ref(false)
  const email = ref('')
  /** La compra creó la cuenta y el backend entregó la sesión para entrar de una. */
  const accountCreated = ref(false)
  let running = false

  const hasSession = computed(() => userStore.isAuthenticated)

  const param = (value: unknown) => (typeof value === 'string' ? value : '')

  async function applyPaid(result: OrderConfirmation) {
    cart.clear()
    tickets.value = result.tickets ?? []
    courses.value = result.courses ?? []
    hasPhysical.value = Boolean(result.hasPhysical)
    email.value = result.email || result.order.buyer?.email || ''
    accountCreated.value = Boolean(result.session)

    if (result.session) {
      userStore.setSession(result.session.token, result.session.user)
    } else if (userStore.hasToken && !userStore.user) {
      // Volver de Payphone recarga la app: la sesión propia aún no está restaurada y
      // de ella depende qué botón se muestra.
      await userStore.restore()
    }
  }

  async function confirm() {
    if (running) return
    const id = param(route.query.id)
    const clientTransactionId = param(route.query.clientTransactionId)
    if (!id || !clientTransactionId) {
      state.value = 'failed'
      message.value = studentCopy.payment.missingParams
      return
    }

    running = true
    state.value = 'confirming'
    message.value = ''
    try {
      for (let attempt = 1; attempt <= RETRIES; attempt++) {
        try {
          const result = await orderService.confirm(id, clientTransactionId)
          order.value = result.order
          if (result.status === 'paid') await applyPaid(result)
          state.value = result.status
          return
        } catch (e) {
          const error = e as ApiError
          // 4xx es una respuesta definitiva del API; insistir solo tiene sentido si
          // el servidor o la red fallaron.
          // Un 401 es una sesión vencida, que httpBase ya borró: la confirmación no
          // necesita sesión, así que se repite sin token en vez de dejar el cobro en el aire.
          const transient = error.status >= 500 || error.status === 408 || error.status === 401
          if (!transient || attempt === RETRIES) {
            state.value = 'error'
            message.value = error.message
            return
          }
          await wait(1500 * attempt)
        }
      }
    } finally {
      running = false
    }
  }

  return {
    state,
    message,
    order,
    tickets,
    courses,
    hasPhysical,
    email,
    accountCreated,
    hasSession,
    confirm,
  }
}
