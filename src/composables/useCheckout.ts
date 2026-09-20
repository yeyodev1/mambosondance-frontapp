import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { orderService } from '@/services/order.service'
import type { ApiError, Buyer, Order, PayphoneConfig, Shipping } from '@/types'

/** La Cajita de Payphone deja de aceptar el pago a los 10 minutos. */
const ATTEMPT_SECONDS = 600

export type CheckoutStep = 'details' | 'payment'
export type CheckoutNoticeKind = 'unavailable' | 'conflict'
export type FieldErrors<T> = Partial<Record<keyof T, string>>

const digits = (value: string) => value.replace(/\D/g, '')

export function useCheckout() {
  const cart = useCartStore()
  const userStore = useUserStore()

  const step = ref<CheckoutStep>('details')
  const submitting = ref(false)
  const formError = ref('')
  const notice = ref<{ kind: CheckoutNoticeKind; message: string } | null>(null)

  const buyer = reactive<Buyer>({
    name: userStore.user?.name || '',
    phone: userStore.user?.phone || '',
    documentId: '',
  })
  const shipping = reactive<Shipping>({
    fullName: userStore.user?.name || '',
    phone: userStore.user?.phone || '',
    city: '',
    address: '',
    notes: '',
  })
  const buyerErrors = ref<FieldErrors<Buyer>>({})
  const shippingErrors = ref<FieldErrors<Shipping>>({})

  const order = ref<Order | null>(null)
  const payphone = ref<PayphoneConfig | null>(null)
  const shippingNote = ref('')
  const whatsapp = ref('')

  // El temporizador cuenta contra una hora fija y no restando de a un segundo:
  // una pestaña en segundo plano frena los intervalos y el reloj mentiría.
  const remaining = ref(ATTEMPT_SECONDS)
  const expired = computed(() => step.value === 'payment' && remaining.value <= 0)
  let deadline = 0
  let timer: number | undefined

  function stopTimer() {
    if (timer) window.clearInterval(timer)
    timer = undefined
  }

  function startTimer() {
    stopTimer()
    deadline = Date.now() + ATTEMPT_SECONDS * 1000
    remaining.value = ATTEMPT_SECONDS
    timer = window.setInterval(() => {
      remaining.value = Math.max(0, Math.round((deadline - Date.now()) / 1000))
      if (remaining.value === 0) stopTimer()
    }, 1000)
  }

  function validate(): boolean {
    const b: FieldErrors<Buyer> = {}
    if (buyer.name.trim().length < 3) b.name = 'Escribe tu nombre completo'
    if (digits(buyer.phone).length < 7) b.phone = 'Escribe un teléfono válido'
    if (![10, 13].includes(digits(buyer.documentId).length) || /\D/.test(buyer.documentId.trim())) {
      b.documentId = 'La cédula tiene 10 dígitos y el RUC 13'
    }
    buyerErrors.value = b

    const s: FieldErrors<Shipping> = {}
    if (cart.hasPhysical) {
      if (shipping.fullName.trim().length < 3) s.fullName = 'Escribe quién recibe el pedido'
      if (digits(shipping.phone).length < 7) s.phone = 'Escribe un teléfono de contacto'
      if (!shipping.city.trim()) s.city = 'Escribe la ciudad'
      if (shipping.address.trim().length < 6) s.address = 'Escribe la dirección completa'
    }
    shippingErrors.value = s

    return !Object.keys(b).length && !Object.keys(s).length
  }

  /** Sirve para el primer intento y para "Generar nuevo intento": siempre es otra orden. */
  async function createOrder() {
    if (submitting.value || cart.isEmpty) return
    formError.value = ''
    if (!validate()) {
      formError.value = 'Revisa los campos marcados antes de continuar'
      return
    }

    submitting.value = true
    try {
      const response = await orderService.create({
        items: cart.lines.map((line) => line.input),
        buyer: {
          name: buyer.name.trim(),
          phone: buyer.phone.trim(),
          documentId: buyer.documentId.trim(),
        },
        ...(cart.hasPhysical ? { shipping: { ...shipping } } : {}),
      })
      order.value = response.order
      payphone.value = response.payphone
      step.value = 'payment'
      startTimer()
      window.scrollTo({ top: 0 })
    } catch (e) {
      const error = e as ApiError
      if (error.status === 503) notice.value = { kind: 'unavailable', message: error.message }
      else if (error.status === 409) notice.value = { kind: 'conflict', message: error.message }
      else formError.value = error.message
    } finally {
      submitting.value = false
    }
  }

  function backToDetails() {
    stopTimer()
    step.value = 'details'
    payphone.value = null
  }

  onMounted(async () => {
    try {
      const settings = await orderService.publicSettings()
      shippingNote.value = settings.shippingNote
      whatsapp.value = settings.whatsapp
    } catch {
      // Sin ajustes el checkout funciona igual: solo falta la nota de envío.
    }
  })

  onUnmounted(stopTimer)

  return {
    cart,
    step,
    submitting,
    formError,
    notice,
    buyer,
    shipping,
    buyerErrors,
    shippingErrors,
    order,
    payphone,
    shippingNote,
    whatsapp,
    remaining,
    expired,
    createOrder,
    backToDetails,
  }
}
