import { ref, shallowRef, type Ref } from 'vue'
import type { ApiError } from '@/types'

export function errorMessage(error: unknown): string {
  const message = (error as ApiError | undefined)?.message
  return message || 'Algo salió mal. Inténtalo de nuevo.'
}

/**
 * Carga, error y dato de una sola petición. Si se relanza antes de que termine
 * la anterior, gana la última: una respuesta vieja no pisa a una nueva.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = shallowRef<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref('')
  let ticket = 0

  async function run(): Promise<void> {
    const mine = ++ticket
    loading.value = true
    error.value = ''
    try {
      const result = await fetcher()
      if (mine === ticket) data.value = result
    } catch (err) {
      if (mine === ticket) error.value = errorMessage(err)
    } finally {
      if (mine === ticket) loading.value = false
    }
  }

  return { data, loading, error, run }
}
