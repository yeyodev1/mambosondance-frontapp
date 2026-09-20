import APIBase from './httpBase'
import type {
  CourseLevel,
  EventCategory,
  EventItem,
  Paginated,
  Playback,
  Product,
  ProductDetail,
  ProductType,
  Promo,
  PublicSettings,
  Teacher,
} from '@/types'

export interface ProductsParams {
  type?: ProductType
  level?: CourseLevel
  category?: string
  featured?: boolean
  page?: number
  limit?: number
}

export interface EventsParams {
  category?: EventCategory
  when?: 'upcoming' | 'past'
  featured?: boolean
  page?: number
  limit?: number
}

export interface ContactPayload {
  name: string
  email: string
  phone?: string
  message: string
}

/** Quita claves vacías para no mandar `?level=&category=` al API. */
function clean(params: object): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') out[key] = value
  }
  return out
}

class CatalogService extends APIBase {
  async products(params: ProductsParams = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>('products', undefined, {
      params: clean(params),
    })
    return data
  }

  async product(slug: string): Promise<ProductDetail> {
    const { data } = await this.get<ProductDetail>(`products/${encodeURIComponent(slug)}`)
    // Un producto físico no trae módulos: la vista siempre puede iterar.
    return { ...data, modules: data.modules ?? [] }
  }

  async categories(): Promise<string[]> {
    const { data } = await this.get<string[]>('products/categories')
    return data
  }

  async events(params: EventsParams = {}): Promise<Paginated<EventItem>> {
    const { data } = await this.get<Paginated<EventItem>>('events', undefined, {
      params: clean(params),
    })
    return data
  }

  async event(slug: string): Promise<EventItem> {
    const { data } = await this.get<EventItem>(`events/${encodeURIComponent(slug)}`)
    return data
  }

  async teachers(): Promise<Teacher[]> {
    const { data } = await this.get<Teacher[]>('teachers')
    return data
  }

  async promos(): Promise<Promo[]> {
    const { data } = await this.get<Promo[]>('promos')
    return data
  }

  async publicSettings(): Promise<PublicSettings> {
    const { data } = await this.get<PublicSettings>('settings/public')
    return data
  }

  async contact(payload: ContactPayload): Promise<void> {
    await this.post<{ ok: boolean }>('contact', clean(payload))
  }

  /** Las lecciones con vista previa gratis no exigen sesión; el resto responde 403. */
  async lessonPlayback(lessonId: string): Promise<Playback> {
    const { data } = await this.get<Playback>(`lessons/${lessonId}/playback`)
    return data
  }
}

export const catalogService = new CatalogService()
