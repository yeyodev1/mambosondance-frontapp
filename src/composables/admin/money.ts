/** El dueño escribe dólares ("19.90" o "19,90"); el API solo entiende centavos enteros. */
export function dollarsToCents(value: string): number | null {
  const normalized = value.trim().replace(/\s|\$/g, '').replace(',', '.')
  if (!normalized) return null
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null
  // Math.round: 19.9 * 100 da 1989.9999… en coma flotante.
  return Math.round(Number(normalized) * 100)
}

export function centsToDollars(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return ''
  return (cents / 100).toFixed(2)
}
