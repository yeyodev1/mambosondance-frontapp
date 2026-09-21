/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Contrato del API de MamboSon ─────────────────────────────────────
// Dinero siempre en centavos enteros (USD). Fechas en ISO.

export type ProductType = 'course' | 'physical'
export type CourseLevel = 'principiante' | 'intermedio' | 'avanzado' | 'todos'
export type EventCategory = 'social' | 'congreso' | 'festival' | 'taller' | 'academia'
export type SalesMode = 'online' | 'whatsapp' | 'instagram' | 'info'
export type OrderStatus = 'pending' | 'paid' | 'canceled' | 'failed'
export type FulfillmentStatus = 'none' | 'pending' | 'shipped' | 'delivered'
export type AccessStatus = 'vigente' | 'vencido' | 'revocado'
export type AccessSource = 'purchase' | 'manual' | 'demo' | 'loyalty'
export type VideoStatus = 'none' | 'processing' | 'ready' | 'error'

export interface Image {
  url: string
  publicId: string
}

export interface ProductVariant {
  name: string
  options: string[]
}

export interface Product {
  id: string
  type: ProductType
  slug: string
  title: string
  summary: string
  description: string
  priceCents: number
  compareAtCents: number | null
  cover: Image | null
  gallery: Image[]
  isPublished: boolean
  isFeatured: boolean
  order: number
  level: CourseLevel | null
  style: string
  accessDurationDays: number | null
  lessonsCount: number
  durationSeconds: number
  category: string
  variants: ProductVariant[]
  stock: number | null
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  product: string
  module: string
  title: string
  description: string
  order: number
  durationSeconds: number
  isFreePreview: boolean
  isPublished: boolean
  videoStatus: VideoStatus
  thumbnailUrl: string | null
  /** Solo llega en rutas de administración. */
  bunnyVideoId?: string
  /** Solo llega en /me/courses/:slug. */
  completed?: boolean
}

export interface CourseModule {
  id: string
  product: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface ProductDetail extends Product {
  modules: CourseModule[]
}

export interface TicketTier {
  id: string
  name: string
  priceCents: number
  availableFrom: string | null
  availableUntil: string | null
  capacity: number | null
  sold: number
}

export interface EventItem {
  id: string
  slug: string
  title: string
  category: EventCategory
  summary: string
  description: string
  startsAt: string
  endsAt: string | null
  venue: string
  city: string
  mapUrl: string
  cover: Image | null
  gallery: Image[]
  artists: string[]
  salesMode: SalesMode
  contactUrl: string
  tiers: TicketTier[]
  isPublished: boolean
  isFeatured: boolean
}

export interface Teacher {
  id: string
  name: string
  role: string
  bio: string
  photo: Image | null
  instagram: string
  order: number
  isFounder: boolean
  isPublished: boolean
}

export interface Promo {
  id: string
  title: string
  text: string
  image: Image | null
  ctaLabel: string
  ctaUrl: string
  startsAt: string | null
  endsAt: string | null
  isActive: boolean
  order: number
}

export interface PublicSettings {
  loyaltyEnabled: boolean
  loyaltyStampsRequired: number
  loyaltyRewardText: string
  whatsapp: string
  instagram: string
  shippingNote: string
}

export interface Settings extends PublicSettings {
  loyaltyStampOnPurchase: boolean
}

export interface OrderItem {
  kind: 'product' | 'ticket'
  product: string | null
  event: string | null
  tierId: string | null
  title: string
  unitCents: number
  quantity: number
  selectedOptions: Record<string, string>
  image: string | null
}

export interface Shipping {
  fullName: string
  phone: string
  city: string
  address: string
  notes: string
}

export interface Buyer {
  name: string
  /** Obligatorio al comprar sin sesión: ahí llegan los accesos. */
  email: string
  phone: string
  documentId: string
}

export interface Order {
  id: string
  number: string
  user: string
  email: string
  items: OrderItem[]
  subtotalCents: number
  discountCents: number
  totalCents: number
  status: OrderStatus
  fulfillment: FulfillmentStatus
  shipping: Shipping | null
  buyer: Buyer
  clientTransactionId: string
  paidAt: string | null
  createdAt: string
}

/** Lo que el carrito manda a POST /orders. Los precios los pone el servidor. */
export type OrderItemInput =
  | {
      kind: 'product'
      productId: string
      quantity: number
      selectedOptions?: Record<string, string>
    }
  | { kind: 'ticket'; eventId: string; tierId: string; quantity: number }

/** Respuesta de POST /orders/confirm. `session` solo llega si la compra creó la cuenta. */
export interface OrderConfirmation {
  order: Order
  status: 'paid' | 'canceled' | 'failed'
  tickets: Ticket[]
  courses: { slug: string; title: string }[]
  hasPhysical: boolean
  email: string
  session: { token: string; user: SessionUser } | null
}

export interface PayphoneConfig {
  token: string
  storeId: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: string
  reference: string
  email: string
  phoneNumber: string
  documentId: string
}

export interface Access {
  id: string
  user: { id: string; email: string; name: string }
  product: { id: string; title: string; slug: string }
  source: AccessSource
  note: string
  expiresAt: string | null
  revokedAt: string | null
  status: AccessStatus
  createdAt: string
}

export interface MyCourse {
  product: Product
  access: { expiresAt: string | null; status: AccessStatus }
  progress: { completed: number; total: number }
}

export interface MyCourseDetail extends ProductDetail {
  access: { expiresAt: string | null; status: AccessStatus }
}

export interface Playback {
  embedUrl: string
  expiresAt: string
}

export interface Ticket {
  id: string
  code: string
  event: { id: string; title: string; startsAt: string; venue: string }
  tierName: string
  holderName: string
  holderEmail: string
  order: string
  status: 'valid' | 'used' | 'void'
  usedAt: string | null
}

export interface LoyaltyStamp {
  id: string
  at: string
  note: string
  source: 'attendance' | 'purchase' | 'manual'
}

export interface LoyaltyCard {
  stampsRequired: number
  rewardText: string
  stamps: LoyaltyStamp[]
  currentCount: number
  rewardsAvailable: number
  rewardsRedeemed: number
  history: { at: string; type: 'stamp' | 'reward_earned' | 'reward_redeemed'; note: string }[]
}

export interface AdminUserRow extends SessionUser {
  accessCount: number
  stamps: number
  createdAt: string
}

export interface AdminUserDetail {
  user: SessionUser & { createdAt: string }
  accesses: Access[]
  orders: Order[]
  loyalty: LoyaltyCard
}

export interface Dashboard {
  salesCents30d: number
  orders30d: number
  students: number
  activeAccesses: number
  upcomingEvents: number
  pendingFulfillment: number
}

export interface TusUpload {
  videoId: string
  libraryId: string
  signature: string
  expire: number
  endpoint: string
}

/** Un renglón del carrito, guardado en localStorage. El precio es solo para mostrar. */
export interface CartLine {
  key: string
  input: OrderItemInput
  title: string
  subtitle: string
  unitCents: number
  image: string | null
  isPhysical: boolean
  /** Cursos y entradas con cupo único no permiten cambiar la cantidad. */
  fixedQuantity: boolean
}
