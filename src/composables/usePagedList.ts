import { computed, ref, shallowRef, type Ref } from 'vue'
import type { Paginated } from '@/types'
import { errorMessage } from './useAsyncData'

/**
 * Listado paginado con "ver más". `reload` vuelve a la página 1 (cambio de
 * filtro); `loadMore` acumula. Un filtro nuevo descarta respuestas viejas.
 */
export function usePagedList<T>(fetcher: (page: number) => Promise<Paginated<T>>) {
  const items = shallowRef<T[]>([]) as Ref<T[]>
  const page = ref(1)
  const pages = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref('')
  let ticket = 0

  const hasMore = computed(() => page.value < pages.value)
  const isEmpty = computed(() => !loading.value && !error.value && items.value.length === 0)

  async function reload(): Promise<void> {
    const mine = ++ticket
    loading.value = true
    error.value = ''
    try {
      const result = await fetcher(1)
      if (mine !== ticket) return
      items.value = result.items
      page.value = result.page
      pages.value = result.pages
    } catch (err) {
      if (mine !== ticket) return
      items.value = []
      error.value = errorMessage(err)
    } finally {
      if (mine === ticket) loading.value = false
    }
  }

  async function loadMore(): Promise<void> {
    if (!hasMore.value || loadingMore.value) return
    const mine = ticket
    loadingMore.value = true
    try {
      const result = await fetcher(page.value + 1)
      if (mine !== ticket) return
      items.value = [...items.value, ...result.items]
      page.value = result.page
      pages.value = result.pages
    } catch (err) {
      if (mine === ticket) error.value = errorMessage(err)
    } finally {
      loadingMore.value = false
    }
  }

  return { items, loading, loadingMore, error, hasMore, isEmpty, reload, loadMore }
}
