const pad = (n: number) => String(n).padStart(2, '0')

/** ISO → valor de un `datetime-local`, en la hora del dispositivo. */
export function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Valor de un `datetime-local` → ISO. Vacío o inválido → null. */
export function localInputToIso(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

export function isoToDateInput(iso: string | null | undefined): string {
  return isoToLocalInput(iso).slice(0, 10)
}

/**
 * Una fecha sin hora vence al FINAL de ese día: si el dueño dice "se revoca el 30",
 * el alumno todavía entra el 30 por la noche.
 */
export function dateInputToIsoEndOfDay(value: string): string | null {
  if (!value) return null
  const d = new Date(`${value}T23:59:59`)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

/** Inicio del día, para "disponible desde". */
export function dateInputToIsoStartOfDay(value: string): string | null {
  if (!value) return null
  const d = new Date(`${value}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

/** Mañana en formato de `input type="date"`: el mínimo para una fecha futura. */
export function tomorrowDateInput(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dateTime.format(d)
}
