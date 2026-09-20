import { ref, type Ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { Paginated } from '@/types'
import { errorMessage } from './useAction'

/** Un dato que se carga al entrar: deja carga y error listos para pintar en pantalla. */
export function useResource<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(true)
  const error = ref('')
  const toast = useToastStore()

  /** `silent` refresca sin volver a la pantalla de carga (tras una acción dentro de la vista). */
  async function load(silent: unknown = false) {
    if (silent !== true) loading.value = true
    error.value = ''
    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = errorMessage(err, 'No se pudo cargar la información')
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const refresh = () => load(true)

  return { data, loading, error, load, refresh }
}

/** Listado paginado. La vista arma los filtros; acá solo se pide la página. */
export function usePagedList<T>(fetcher: (page: number) => Promise<Paginated<T>>) {
  const items = ref<T[]>([]) as Ref<T[]>
  const page = ref(1)
  const pages = ref(1)
  const total = ref(0)
  const loading = ref(true)
  const error = ref('')
  const toast = useToastStore()
  // Si el dueño escribe rápido en el buscador, solo cuenta la última respuesta.
  let ticket = 0

  async function load(target = 1) {
    const mine = ++ticket
    loading.value = true
    error.value = ''
    try {
      const result = await fetcher(target)
      if (mine !== ticket) return
      items.value = result.items
      page.value = result.page
      pages.value = result.pages
      total.value = result.total
    } catch (err) {
      if (mine !== ticket) return
      error.value = errorMessage(err, 'No se pudo cargar el listado')
      toast.error(error.value)
    } finally {
      if (mine === ticket) loading.value = false
    }
  }

  const reload = () => load(page.value)

  return { items, page, pages, total, loading, error, load, reload }
}
