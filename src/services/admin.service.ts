import APIBase from './httpBase'
import type {
  Access,
  AccessStatus,
  AdminUserDetail,
  AdminUserRow,
  CourseModule,
  Dashboard,
  EventItem,
  FulfillmentStatus,
  Image,
  Lesson,
  LoyaltyCard,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductDetail,
  ProductType,
  Promo,
  Settings,
  Teacher,
  Ticket,
  TicketTier,
  TusUpload,
} from '@/types'

export type ImageFolder = 'productos' | 'eventos' | 'profesores' | 'promos'
export type Query = Record<string, string | number | boolean | null | undefined>

/** Una tarifa nueva todavía no tiene id ni ventas. */
export type TierInput = Omit<TicketTier, 'id' | 'sold'> & { id?: string }
export type EventInput = Partial<Omit<EventItem, 'id' | 'tiers'>> & { tiers?: TierInput[] }
export type LessonInput = Partial<
  Pick<Lesson, 'title' | 'description' | 'isFreePreview' | 'isPublished'>
>
export interface ReorderInput {
  modules: { id: string; lessons: string[] }[]
}
export interface GrantAccessInput {
  email: string
  productIds: string[]
  /** ISO futura o null EXPLÍCITO: el API rechaza la petición si falta la clave. */
  expiresAt: string | null
  note?: string
}

/** Los filtros vacíos no viajan: `?status=` haría fallar la validación del API. */
function clean(query: Query = {}): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value !== '' && value !== null && value !== undefined) params[key] = value
  }
  return params
}

/** Acepta lista desnuda o paginada: los listados cortos pueden venir de las dos formas. */
function asPage<T>(data: Paginated<T> | T[]): Paginated<T> {
  if (Array.isArray(data)) return { items: data, total: data.length, page: 1, pages: 1 }
  return data
}

class AdminService extends APIBase {
  private async page<T>(endpoint: string, query?: Query): Promise<Paginated<T>> {
    const { data } = await this.get<Paginated<T> | T[]>(endpoint, undefined, {
      params: clean(query),
    })
    return asPage(data)
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    return (await this.get<T>(endpoint)).data
  }

  private async send<T>(endpoint: string, body: unknown = {}): Promise<T> {
    return (await this.post<T>(endpoint, body)).data
  }

  private async replace<T>(endpoint: string, body: unknown): Promise<T> {
    return (await this.put<T>(endpoint, body)).data
  }

  private async remove(endpoint: string): Promise<void> {
    await this.delete(endpoint)
  }

  dashboard = () => this.fetch<Dashboard>('admin/dashboard')

  // Productos
  products = (query: { type?: ProductType; q?: string; page?: number; limit?: number }) =>
    this.page<Product>('admin/products', query)
  product = (id: string) => this.fetch<ProductDetail>(`admin/products/${id}`)
  createProduct = (body: Partial<Product>) => this.send<Product>('admin/products', body)
  updateProduct = (id: string, body: Partial<Product>) =>
    this.replace<Product>(`admin/products/${id}`, body)
  deleteProduct = (id: string) => this.remove(`admin/products/${id}`)

  // Contenido de cursos
  createModule = (productId: string, title: string) =>
    this.send<CourseModule>(`admin/products/${productId}/modules`, { title })
  updateModule = (id: string, body: { title?: string; order?: number }) =>
    this.replace<CourseModule>(`admin/modules/${id}`, body)
  deleteModule = (id: string) => this.remove(`admin/modules/${id}`)
  createLesson = (moduleId: string, body: LessonInput) =>
    this.send<Lesson>(`admin/modules/${moduleId}/lessons`, body)
  updateLesson = (id: string, body: LessonInput) =>
    this.replace<Lesson>(`admin/lessons/${id}`, body)
  deleteLesson = (id: string) => this.remove(`admin/lessons/${id}`)
  reorder = (productId: string, body: ReorderInput) =>
    this.replace<{ modules: CourseModule[] }>(`admin/products/${productId}/reorder`, body)
  videoUpload = (lessonId: string) => this.send<TusUpload>(`admin/lessons/${lessonId}/video-upload`)
  videoSync = (lessonId: string) => this.send<Lesson>(`admin/lessons/${lessonId}/video-sync`)

  /** Una foto del celular pesa varios MB y la red de un local es lenta: más margen que el default. */
  async uploadImage(file: File, folder: ImageFolder): Promise<Image> {
    const form = new FormData()
    form.append('file', file)
    const { data } = await this.post<Image>(
      `admin/uploads/image?folder=${folder}`,
      form,
      undefined,
      {
        timeout: 120000,
      },
    )
    return data
  }

  // Eventos
  events = (query: Query) => this.page<EventItem>('admin/events', query)
  event = (id: string) => this.fetch<EventItem>(`admin/events/${id}`)
  createEvent = (body: EventInput) => this.send<EventItem>('admin/events', body)
  updateEvent = (id: string, body: EventInput) =>
    this.replace<EventItem>(`admin/events/${id}`, body)
  deleteEvent = (id: string) => this.remove(`admin/events/${id}`)

  // Profesores
  teachers = () => this.page<Teacher>('admin/teachers', { limit: 100 })
  createTeacher = (body: Partial<Teacher>) => this.send<Teacher>('admin/teachers', body)
  updateTeacher = (id: string, body: Partial<Teacher>) =>
    this.replace<Teacher>(`admin/teachers/${id}`, body)
  deleteTeacher = (id: string) => this.remove(`admin/teachers/${id}`)

  // Promociones
  promos = () => this.page<Promo>('admin/promos', { limit: 100 })
  createPromo = (body: Partial<Promo>) => this.send<Promo>('admin/promos', body)
  updatePromo = (id: string, body: Partial<Promo>) =>
    this.replace<Promo>(`admin/promos/${id}`, body)
  deletePromo = (id: string) => this.remove(`admin/promos/${id}`)

  // Pedidos
  orders = (query: {
    status?: OrderStatus | ''
    fulfillment?: FulfillmentStatus | ''
    q?: string
    page?: number
  }) => this.page<Order>('admin/orders', query)
  order = (id: string) => this.fetch<Order>(`admin/orders/${id}`)
  async setFulfillment(id: string, fulfillment: FulfillmentStatus): Promise<Order> {
    return (await this.patch<Order>(`admin/orders/${id}`, { fulfillment })).data
  }

  // Alumnos
  users = (query: { q?: string; page?: number }) => this.page<AdminUserRow>('admin/users', query)
  user = (id: string) => this.fetch<AdminUserDetail>(`admin/users/${id}`)

  // Accesos
  grantAccess = (body: GrantAccessInput) => this.send<unknown>('admin/access', body)
  accesses = (query: {
    product?: string
    user?: string
    status?: AccessStatus | ''
    page?: number
  }) => this.page<Access>('admin/access', query)
  async updateAccess(id: string, expiresAt: string | null): Promise<Access> {
    return (await this.patch<Access>(`admin/access/${id}`, { expiresAt })).data
  }
  revokeAccess = (id: string) => this.send<Access>(`admin/access/${id}/revoke`)

  // Entradas
  tickets = (query: { event?: string; q?: string; page?: number }) =>
    this.page<Ticket>('admin/tickets', query)
  verifyTicket = (code: string) =>
    this.fetch<Ticket>(`admin/tickets/verify/${encodeURIComponent(code)}`)
  checkIn = (id: string) => this.send<Ticket>(`admin/tickets/${id}/check-in`)
  voidTicket = (id: string) => this.send<Ticket>(`admin/tickets/${id}/void`)

  // Fidelidad
  stamp = (body: { email: string; note?: string; count?: number }) =>
    this.send<LoyaltyCard>('admin/loyalty/stamp', body)
  redeem = (body: { email: string; note?: string }) =>
    this.send<LoyaltyCard>('admin/loyalty/redeem', body)
  async removeStamp(stampId: string, email: string): Promise<LoyaltyCard> {
    const { data } = await this.delete<LoyaltyCard>(`admin/loyalty/stamp/${stampId}`, undefined, {
      params: { email },
    })
    return data
  }

  // Ajustes
  settings = () => this.fetch<Settings>('admin/settings')
  saveSettings = (body: Settings) => this.replace<Settings>('admin/settings', body)
}

export const adminService = new AdminService()
