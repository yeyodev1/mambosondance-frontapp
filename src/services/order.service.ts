import APIBase from './httpBase'
import type {
  Buyer,
  Order,
  OrderConfirmation,
  OrderItemInput,
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

class OrderService extends APIBase {
  /** El servidor recalcula precios: acá solo viajan ids y cantidades. */
  async create(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const { data } = await this.post<CreateOrderResponse>('orders', payload)
    return data
  }

  /**
   * Idempotente en el backend: recargar la página de respuesta no duplica nada.
   * No exige sesión: el `clientTransactionId` hace de credencial del comprador.
   */
  async confirm(id: string, clientTransactionId: string): Promise<OrderConfirmation> {
    const { data } = await this.post<OrderConfirmation>(
      'orders/confirm',
      { id, clientTransactionId },
      undefined,
      // Payphone puede tardar en responder; mejor esperar que dar por fallido un cobro real.
      { timeout: 30000 },
    )
    return data
  }

  /**
   * "Encontrar mi compra": reenvía por correo los accesos de las compras pagadas.
   * Responde siempre lo mismo, exista o no el correo, para no revelar quién compró.
   */
  async find(email: string, number?: string): Promise<void> {
    await this.post<{ ok: boolean }>('orders/find', { email, ...(number ? { number } : {}) })
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
