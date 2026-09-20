import APIBase from './httpBase'
import type {
  Buyer,
  Order,
  OrderItemInput,
  OrderStatus,
  PayphoneConfig,
  PublicSettings,
  Shipping,
} from '@/types'

export interface CreateOrderPayload {
  items: OrderItemInput[]
  buyer: Buyer
  /** Obligatorio cuando el carrito trae productos físicos. */
  shipping?: Shipping
}

export interface CreateOrderResponse {
  order: Order
  payphone: PayphoneConfig
}

export interface ConfirmOrderResponse {
  order: Order
  status: Exclude<OrderStatus, 'pending'>
}

class OrderService extends APIBase {
  /** El servidor recalcula precios: acá solo viajan ids y cantidades. */
  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload)
    return data
  }

  /** Idempotente en el backend: recargar la página de respuesta no duplica nada. */
  async confirm(id: string, clientTransactionId: string): Promise<ConfirmOrderResponse> {
    const { data } = await this.post<ConfirmOrderResponse>(
      'orders/confirm',
      { id, clientTransactionId },
      undefined,
      // Payphone puede tardar en responder; mejor esperar que dar por fallido un cobro real.
      { timeout: 30000 },
    )
    return data
  }

  async mine(): Promise<Order[]> {
    const { data } = await this.get<Order[]>('orders/mine')
    return data
  }

  async getById(id: string): Promise<Order> {
    const { data } = await this.get<Order>(`orders/${id}`)
    return data
  }

  /** Nota de envío y WhatsApp para el checkout, sin depender del store del sitio público. */
  async publicSettings(): Promise<PublicSettings> {
    const { data } = await this.get<PublicSettings>('settings/public')
    return data
  }
}

export const orderService = new OrderService()
