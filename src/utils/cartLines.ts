import type { CartLine, EventItem, Product, TicketTier } from '@/types'
import { formatDate } from './format'

/** "Color=Rojo|Talla=M": ordenado para que la misma combinación dé la misma key. */
function optionsKey(options: Record<string, string>): string {
  return Object.keys(options)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => `${name}=${options[name]}`)
    .join('|')
}

export function courseLine(product: Product): CartLine {
  return {
    key: `product:${product.id}:`,
    input: { kind: 'product', productId: product.id, quantity: 1 },
    title: product.title,
    subtitle: 'Clase online',
    unitCents: product.priceCents,
    image: product.cover?.url ?? null,
    isPhysical: false,
    // El servidor solo acepta un acceso por curso.
    fixedQuantity: true,
  }
}

export function physicalLine(
  product: Product,
  options: Record<string, string>,
  quantity: number,
): CartLine {
  const names = Object.keys(options).sort((a, b) => a.localeCompare(b))
  return {
    key: `product:${product.id}:${optionsKey(options)}`,
    input: {
      kind: 'product',
      productId: product.id,
      quantity,
      ...(names.length ? { selectedOptions: { ...options } } : {}),
    },
    title: product.title,
    subtitle: names.map((name) => `${name}: ${options[name]}`).join(' · '),
    unitCents: product.priceCents,
    image: product.cover?.url ?? product.gallery[0]?.url ?? null,
    isPhysical: true,
    fixedQuantity: false,
  }
}

export function ticketLine(event: EventItem, tier: TicketTier, quantity: number): CartLine {
  return {
    key: `ticket:${event.id}:${tier.id}`,
    input: { kind: 'ticket', eventId: event.id, tierId: tier.id, quantity },
    title: event.title,
    subtitle: `${tier.name} · ${formatDate(event.startsAt)}`,
    unitCents: tier.priceCents,
    image: event.cover?.url ?? null,
    isPhysical: false,
    fixedQuantity: false,
  }
}
