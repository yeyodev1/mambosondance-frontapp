import type {
  AccessSource,
  AccessStatus,
  CourseLevel,
  EventCategory,
  FulfillmentStatus,
  OrderStatus,
  SalesMode,
  Ticket,
  VideoStatus,
} from '@/types'

// Los textos del panel viven acá (y no en config/site.ts, que es del sitio público).

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'
export interface ChipInfo {
  label: string
  tone: Tone
  icon?: string
}

export const accessStatusChip: Record<AccessStatus, ChipInfo> = {
  vigente: { label: 'Vigente', tone: 'success', icon: 'fa-circle-check' },
  vencido: { label: 'Vencido', tone: 'warning', icon: 'fa-hourglass-end' },
  revocado: { label: 'Revocado', tone: 'danger', icon: 'fa-ban' },
}

export const accessSourceLabel: Record<AccessSource, string> = {
  purchase: 'Compra',
  manual: 'Dado por el equipo',
  demo: 'Demo',
  loyalty: 'Premio de fidelidad',
}

export const orderStatusChip: Record<OrderStatus, ChipInfo> = {
  pending: { label: 'Pago pendiente', tone: 'warning', icon: 'fa-clock' },
  paid: { label: 'Pagado', tone: 'success', icon: 'fa-circle-check' },
  canceled: { label: 'Cancelado', tone: 'neutral', icon: 'fa-circle-xmark' },
  failed: { label: 'Pago fallido', tone: 'danger', icon: 'fa-triangle-exclamation' },
}

export const fulfillmentChip: Record<FulfillmentStatus, ChipInfo> = {
  none: { label: 'Sin envío', tone: 'neutral' },
  pending: { label: 'Por enviar', tone: 'warning', icon: 'fa-box' },
  shipped: { label: 'Enviado', tone: 'info', icon: 'fa-truck' },
  delivered: { label: 'Entregado', tone: 'success', icon: 'fa-circle-check' },
}

export const videoStatusChip: Record<VideoStatus, ChipInfo> = {
  none: { label: 'Sin video', tone: 'neutral', icon: 'fa-video-slash' },
  processing: { label: 'Procesando video', tone: 'warning', icon: 'fa-spinner' },
  ready: { label: 'Video listo', tone: 'success', icon: 'fa-circle-check' },
  error: { label: 'Error en el video', tone: 'danger', icon: 'fa-triangle-exclamation' },
}

export const ticketStatusChip: Record<Ticket['status'], ChipInfo> = {
  valid: { label: 'Válida', tone: 'success', icon: 'fa-circle-check' },
  used: { label: 'Usada', tone: 'warning', icon: 'fa-door-open' },
  void: { label: 'Anulada', tone: 'danger', icon: 'fa-ban' },
}

export const levelOptions: { value: CourseLevel; label: string }[] = [
  { value: 'principiante', label: 'Principiante' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
  { value: 'todos', label: 'Todos los niveles' },
]

export const eventCategoryOptions: { value: EventCategory; label: string }[] = [
  { value: 'social', label: 'Social' },
  { value: 'congreso', label: 'Congreso' },
  { value: 'festival', label: 'Festival' },
  { value: 'taller', label: 'Taller' },
  { value: 'academia', label: 'Academia' },
]

export const salesModeOptions: { value: SalesMode; label: string; help: string; icon: string }[] = [
  {
    value: 'online',
    label: 'En línea',
    help: 'Se paga en la web con tarjeta. Tú defines las preventas.',
    icon: 'fa-solid fa-credit-card',
  },
  {
    value: 'whatsapp',
    label: 'Por WhatsApp',
    help: 'El botón lleva a un chat de WhatsApp.',
    icon: 'fa-brands fa-whatsapp',
  },
  {
    value: 'instagram',
    label: 'Por Instagram',
    help: 'El botón lleva a un perfil o publicación.',
    icon: 'fa-brands fa-instagram',
  },
  {
    value: 'info',
    label: 'Solo informativo',
    help: 'No se venden entradas desde la web.',
    icon: 'fa-solid fa-circle-info',
  },
]

export function publishedChip(isPublished: boolean): ChipInfo {
  return isPublished
    ? { label: 'Publicado', tone: 'success', icon: 'fa-eye' }
    : { label: 'Oculto', tone: 'neutral', icon: 'fa-eye-slash' }
}
