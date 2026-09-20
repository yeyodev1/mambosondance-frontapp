import type { EventItem, TicketTier } from '@/types'

export type TierStatus = 'available' | 'upcoming' | 'soldout' | 'ended'

export const tierStatusLabel: Record<TierStatus, string> = {
  available: 'Disponible',
  upcoming: 'Aún no disponible',
  soldout: 'Agotada',
  ended: 'Finalizada',
}

export function tierRemaining(tier: TicketTier): number | null {
  return tier.capacity === null ? null : Math.max(0, tier.capacity - tier.sold)
}

export function tierStatus(tier: TicketTier, now = new Date()): TierStatus {
  if (tierRemaining(tier) === 0) return 'soldout'
  if (tier.availableUntil && new Date(tier.availableUntil) < now) return 'ended'
  if (tier.availableFrom && new Date(tier.availableFrom) > now) return 'upcoming'
  return 'available'
}

/** Sin hora de cierre, el evento se da por terminado 8 h después de empezar. */
export function isPastEvent(event: EventItem, now = new Date()): boolean {
  const end = event.endsAt
    ? new Date(event.endsAt)
    : new Date(new Date(event.startsAt).getTime() + 8 * 60 * 60 * 1000)
  return end < now
}

const monthShort = new Intl.DateTimeFormat('es-EC', { month: 'short' })
const weekday = new Intl.DateTimeFormat('es-EC', { weekday: 'long' })

/** Partes para la fecha estilo afiche: "07" enorme + "NOV". */
export function posterDate(iso: string) {
  const date = new Date(iso)
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: monthShort.format(date).replace('.', ''),
    year: date.getFullYear(),
    weekday: weekday.format(date),
  }
}
