/**
 * Cloudinary acepta transformaciones en la URL: pedimos formato y calidad
 * automáticos y un ancho razonable. Cualquier otra URL pasa intacta.
 */
export function optimized(url: string | null | undefined, width = 900): string {
  if (!url) return ''
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  if (/\/upload\/[^/]*(f_auto|q_auto|w_\d+)/.test(url)) return url
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`)
}

/** Los CTA de promos pueden apuntar dentro o fuera del sitio. */
export function isInternalUrl(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//')
}
