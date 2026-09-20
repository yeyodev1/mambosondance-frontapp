import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SessionUser } from '@/types'

/**
 * `?next=` viaja entre login, registro y recuperar para que quien venía a comprar
 * termine en el checkout. Solo se aceptan rutas internas: un `next` externo sería
 * una redirección abierta.
 */
export function useAuthRedirect() {
  const route = useRoute()
  const router = useRouter()

  const next = computed(() => {
    const raw = typeof route.query.next === 'string' ? route.query.next : ''
    return raw.startsWith('/') && !raw.startsWith('//') ? raw : ''
  })

  /** Para los enlaces entre pantallas de acceso: conserva el destino. */
  const nextQuery = computed(() => (next.value ? { next: next.value } : {}))

  function goAfterAuth(user: SessionUser) {
    if (user.accountType === 'admin') return router.replace('/admin')
    return router.replace(next.value || '/cuenta')
  }

  return { next, nextQuery, goAfterAuth }
}
