import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services/order.service'
import { meService } from '@/services/me.service'
import type { ApiError, Order, Ticket } from '@/types'

export type PaymentState = 'confirming' | 'paid' | 'canceled' | 'failed' | 'error'

const RETRIES = 3
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

/**
 * Payphone reversa el cobro si nadie lo confirma en 5 minutos. Por eso `confirm()`
 * se llama apenas monta la vista y reintenta sola ante fallos de red; el backend es
 * idempotente, así que recargar la página repite la llamada sin efectos dobles.
 */
export function usePaymentResult() {
  const route = useRoute()
  const cart = useCartStore()

  const state = ref<PaymentState>('confirming')
  const message = ref('')
  const order = ref<Order | null>(null)
  const tickets = ref<Ticket[]>([])
  const hasCourses = ref(false)
  let running = false

  const hasPhysical = computed(
    () => Boolean(order.value?.shipping) || (order.value?.fulfillment ?? 'none') !== 'none',
  )

  const param = (value: unknown) => (typeof value === 'string' ? value : '')

  /** El pedido no dice qué ítems son cursos: se cruza con lo que el alumno ya tiene. */
  async function loadExtras(paid: Order) {
    const productIds = paid.items.filter((i) => i.kind === 'product').map((i) => i.product)
    const wantsTickets = paid.items.some((i) => i.kind === 'ticket')

    const [mine, courses] = await Promise.allSettled([
      wantsTickets ? meService.tickets() : Promise.resolve([]),
      productIds.length ? meService.courses() : Promise.resolve([]),
    ])
    if (mine.status === 'fulfilled') {
      tickets.value = mine.value.filter((ticket) => ticket.order === paid.id)
    }
    if (courses.status === 'fulfilled') {
      hasCourses.value = courses.value.some((c) => productIds.includes(c.product.id))
    }
  }

  async function confirm() {
    if (running) return
    const id = param(route.query.id)
    const clientTransactionId = param(route.query.clientTransactionId)
    if (!id || !clientTransactionId) {
      state.value = 'failed'
      message.value =
        'No recibimos los datos del pago. Si pagaste, revisa tus pedidos en tu cuenta.'
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
          state.value = result.status
          if (result.status === 'paid') {
            cart.clear()
            await loadExtras(result.order)
          }
          return
        } catch (e) {
          const error = e as ApiError
          // 4xx es una respuesta definitiva del API; insistir solo tiene sentido si
          // el servidor o la red fallaron.
          const transient = error.status >= 500 || error.status === 408
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

  return { state, message, order, tickets, hasCourses, hasPhysical, confirm }
}
