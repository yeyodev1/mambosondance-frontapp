import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

/** El API siempre responde `{ message }` en español; si no hay, algo genérico. */
export function errorMessage(error: unknown, fallback = 'Algo salió mal. Intenta de nuevo.') {
  const message = (error as ApiError | undefined)?.message
  return typeof message === 'string' && message ? message : fallback
}

export function errorStatus(error: unknown): number {
  return (error as ApiError | undefined)?.status ?? 0
}

/**
 * Envuelve una acción del panel: marca ocupado, avisa el resultado con un toast
 * y devuelve si salió bien, para que la vista decida qué hacer después.
 */
export function useAction() {
  const busy = ref(false)
  const toast = useToastStore()

  async function run(action: () => Promise<unknown>, success?: string): Promise<boolean> {
    if (busy.value) return false
    busy.value = true
    try {
      await action()
      if (success) toast.success(success)
      return true
    } catch (error) {
      toast.error(errorMessage(error))
      return false
    } finally {
      busy.value = false
    }
  }

  return { busy, run }
}
