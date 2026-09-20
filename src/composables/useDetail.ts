import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useAsyncData } from './useAsyncData'

/**
 * Carga el detalle que corresponde al :slug de la ruta, lo recarga si el slug
 * cambia sin desmontar la vista y pone el título del documento.
 */
export function useDetail<T extends { title: string }>(fetcher: (slug: string) => Promise<T>) {
  const route = useRoute()
  const routeName = route.name
  const { data, loading, error, run } = useAsyncData<T>(() => fetcher(String(route.params.slug)))

  // Arranca en carga: la vista pinta el esqueleto desde el primer cuadro.
  loading.value = true

  watch(
    () => route.params.slug,
    (slug) => {
      // Al salir hacia otra ruta el slug desaparece antes del desmontaje.
      if (slug && route.name === routeName) run()
    },
    { immediate: true },
  )

  watch(data, (item) => {
    if (item) document.title = `${item.title} — ${site.name}`
  })

  return { data, loading, error, reload: run }
}
