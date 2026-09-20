import { reactive, ref, type Ref, type UnwrapNestedRefs } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useAction } from './useAction'
import { useResource } from './useResource'

interface CrudOptions<T extends { id: string }, F extends object> {
  list: () => Promise<T[]>
  create: (body: F) => Promise<T>
  update: (id: string, body: Partial<F>) => Promise<T>
  remove: (id: string) => Promise<void>
  /** Formulario vacío para "nuevo". Recibe la lista para proponer el siguiente orden. */
  empty: (items: T[]) => F
  toForm: (item: T) => F
  /** Devuelve el primer problema en palabras simples, o '' si todo está bien. */
  validate: (form: F) => string
  /** Limpia el formulario antes de enviarlo (trim, fechas a ISO…). */
  toBody: (form: F) => F
}

/** Listado corto + modal para crear y editar: profesores, promociones. */
export function useCrudModal<T extends { id: string }, F extends object>(
  options: CrudOptions<T, F>,
) {
  const toast = useToastStore()
  const { data, loading, error, load, refresh } = useResource(options.list)
  const { busy, run } = useAction()

  const open = ref(false)
  const editing = ref<T | null>(null) as Ref<T | null>
  const toDelete = ref<T | null>(null) as Ref<T | null>
  const form = reactive(options.empty([])) as UnwrapNestedRefs<F>

  function openNew() {
    editing.value = null
    Object.assign(form, options.empty(data.value ?? []))
    open.value = true
  }

  function openEdit(item: T) {
    editing.value = item
    Object.assign(form, options.toForm(item))
    open.value = true
  }

  async function save() {
    const problem = options.validate(form as F)
    if (problem) {
      toast.error(problem)
      return
    }
    const body = options.toBody(form as F)
    const current = editing.value
    const ok = await run(
      () => (current ? options.update(current.id, body) : options.create(body)),
      'Guardado',
    )
    if (!ok) return
    open.value = false
    await refresh()
  }

  /** Prender o apagar un solo campo desde el listado, sin abrir el modal. */
  async function patch(item: T, body: Partial<F>, message: string) {
    await run(async () => {
      Object.assign(item, await options.update(item.id, body))
    }, message)
  }

  async function confirmDelete() {
    const item = toDelete.value
    if (!item) return
    const ok = await run(() => options.remove(item.id), 'Eliminado')
    toDelete.value = null
    if (ok) await refresh()
  }

  return {
    items: data,
    loading,
    error,
    load,
    busy,
    open,
    editing,
    toDelete,
    form,
    openNew,
    openEdit,
    save,
    patch,
    confirmDelete,
  }
}
