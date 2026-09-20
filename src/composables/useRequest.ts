import { ref, type Ref } from 'vue'
import type { ApiError } from '@/types'

/**
 * Carga, error y dato de una petición, para que cada pestaña del área del alumno
 * maneje sus tres estados sin repetir el mismo try/catch.
 */
export function useRequest<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref('')

  async function run(): Promise<T | null> {
    loading.value = true
    error.value = ''
    try {
      data.value = await fetcher()
      return data.value
    } catch (e) {
      error.value = (e as ApiError).message || 'No se pudo cargar la información'
      return null
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, run }
}
