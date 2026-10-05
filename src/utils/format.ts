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

/** 3725 → "1 h 2 min"; 540 → "9 min"; 40 → "40 s". */
export function formatDuration(seconds: number): string {
  if (seconds > 0 && seconds < 60) return `${Math.round(seconds)} s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

/** "6 lecciones + bienvenida": la vista previa no cuenta como clase del pensum. */
export function lessonsLabel(course: {
  lessonsCount: number
  previewLessonsCount?: number
}): string {
  const previews = course.previewLessonsCount ?? 0
  const lessons = course.lessonsCount - previews
  if (lessons <= 0) return ''
  const label = `${lessons} ${lessons === 1 ? 'lección' : 'lecciones'}`
  return previews > 0 ? `${label} + bienvenida` : label
}
