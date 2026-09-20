import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { CourseLevel, Image, Product, ProductType } from '@/types'
import { errorMessage, useAction } from './useAction'

export interface VariantDraft {
  name: string
  /** Como lo escribe el dueño: "S, M, L". */
  optionsText: string
}

export type AccessMode = 'lifetime' | 'days' | null

export interface ProductForm {
  title: string
  summary: string
  description: string
  priceCents: number | null
  compareAtCents: number | null
  cover: Image | null
  gallery: Image[]
  isPublished: boolean
  isFeatured: boolean
  level: CourseLevel | ''
  style: string
  /** Sin valor inicial en un curso nuevo: el dueño DEBE elegir cuánto dura el acceso. */
  accessMode: AccessMode
  accessDays: number | null
  category: string
  variants: VariantDraft[]
  stock: number | null
}

function emptyForm(): ProductForm {
  return {
    title: '',
    summary: '',
    description: '',
    priceCents: null,
    compareAtCents: null,
    cover: null,
    gallery: [],
    isPublished: false,
    isFeatured: false,
    level: '',
    style: '',
    accessMode: null,
    accessDays: null,
    category: '',
    variants: [],
    stock: null,
  }
}

export function useProductForm(id: () => string, initialType: () => ProductType) {
  const router = useRouter()
  const toast = useToastStore()
  const { busy: saving, run } = useAction()

  const isNew = computed(() => id() === 'nuevo')
  const type = ref<ProductType>(initialType())
  const form = reactive<ProductForm>(emptyForm())
  const loading = ref(false)
  const error = ref('')
  const categories = ref<string[]>([])
  const tried = ref(false)

  function fill(product: Product) {
    type.value = product.type
    Object.assign(form, {
      title: product.title,
      summary: product.summary,
      description: product.description,
      priceCents: product.priceCents,
      compareAtCents: product.compareAtCents,
      cover: product.cover,
      gallery: [...product.gallery],
      isPublished: product.isPublished,
      isFeatured: product.isFeatured,
      level: product.level ?? '',
      style: product.style,
      accessMode: product.accessDurationDays === null ? 'lifetime' : 'days',
      accessDays: product.accessDurationDays,
      category: product.category,
      variants: product.variants.map((v) => ({ name: v.name, optionsText: v.options.join(', ') })),
      stock: product.stock,
    } satisfies ProductForm)
  }

  async function load() {
    type.value = initialType()
    Object.assign(form, emptyForm())
    tried.value = false
    error.value = ''
    void loadCategories()
    if (isNew.value) return

    loading.value = true
    try {
      fill(await adminService.product(id()))
    } catch (err) {
      error.value = errorMessage(err, 'No se pudo cargar el producto')
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }

  // Sugerencias: las categorías que ya se usan, para no terminar con "Camiseta" y "Camisetas".
  async function loadCategories() {
    try {
      const { items } = await adminService.products({ type: 'physical', limit: 100 })
      categories.value = [...new Set(items.map((p) => p.category).filter(Boolean))].sort()
    } catch {
      categories.value = []
    }
  }

  const problems = computed(() => {
    const list: Partial<Record<keyof ProductForm, string>> = {}
    if (!form.title.trim()) list.title = 'Ponle un nombre.'
    if (form.priceCents === null) list.priceCents = 'Escribe el precio, por ejemplo 19.90.'
    if (
      form.compareAtCents !== null &&
      form.priceCents !== null &&
      form.compareAtCents <= form.priceCents
    ) {
      list.compareAtCents = 'El precio tachado debe ser mayor que el precio de venta.'
    }
    if (type.value === 'course') {
      if (!form.level) list.level = 'Elige un nivel.'
      if (form.accessMode === null) list.accessMode = 'Elige cuánto dura el acceso.'
      if (form.accessMode === 'days' && (!form.accessDays || form.accessDays < 1)) {
        list.accessDays = 'Escribe cuántos días dura el acceso.'
      }
    } else if (!form.category.trim()) {
      list.category = 'Escribe una categoría, por ejemplo Camisetas.'
    }
    return list
  })

  const valid = computed(() => Object.keys(problems.value).length === 0)
  /** Los errores se muestran recién después del primer intento de guardar. */
  const errors = computed(() => (tried.value ? problems.value : {}))

  function payload(): Partial<Product> {
    const base: Partial<Product> = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      description: form.description.trim(),
      priceCents: form.priceCents ?? 0,
      compareAtCents: form.compareAtCents,
      cover: form.cover,
      gallery: form.gallery,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
    }
    // El tipo solo viaja al crear: el API no deja cambiarlo después.
    if (isNew.value) base.type = type.value

    if (type.value === 'course') {
      return {
        ...base,
        level: form.level || null,
        style: form.style.trim(),
        accessDurationDays: form.accessMode === 'days' ? form.accessDays : null,
      }
    }
    return {
      ...base,
      category: form.category.trim(),
      stock: form.stock,
      variants: form.variants
        .map((v) => ({
          name: v.name.trim(),
          options: v.optionsText
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean),
        }))
        .filter((v) => v.name && v.options.length),
    }
  }

  async function save() {
    tried.value = true
    if (!valid.value) {
      toast.error('Revisa los campos marcados en rojo')
      return
    }
    await run(async () => {
      if (isNew.value) {
        const created = await adminService.createProduct(payload())
        // Un curso recién creado está vacío: lo lógico es seguir con los videos.
        await router.replace(
          created.type === 'course'
            ? { name: 'AdminCourseContent', params: { id: created.id } }
            : { name: 'AdminProducts', query: { type: 'physical' } },
        )
      } else {
        fill(await adminService.updateProduct(id(), payload()))
      }
    }, 'Guardado')
  }

  return { form, type, isNew, loading, error, saving, errors, categories, load, save }
}
