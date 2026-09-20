const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return money.format(value)
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

/** El API habla en centavos enteros; la UI en dólares. */
export function formatCents(cents: number): string {
  return money.format(cents / 100)
}

const longDate = new Intl.DateTimeFormat('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatLongDate(value: string | Date): string {
  return longDate.format(typeof value === 'string' ? new Date(value) : value)
}

const time = new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit' })

export function formatTime(value: string | Date): string {
  return time.format(typeof value === 'string' ? new Date(value) : value)
}

/** 3725 → "1 h 2 min"; 540 → "9 min". */
export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}
