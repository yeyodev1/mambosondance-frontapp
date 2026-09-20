import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { physicalLine } from '@/utils/cartLines'

const MAX_PER_LINE = 20

/** Variantes elegidas, cantidad y stock de un producto físico. */
export function useProductPurchase(product: Ref<Product>) {
  const cart = useCartStore()
  const toast = useToastStore()

  const options = reactive<Record<string, string>>({})
  const quantity = ref(1)
  const showMissing = ref(false)
  const added = ref(false)

  // Una variante sin opciones cargadas no se puede exigir.
  const variants = computed(() => product.value.variants.filter((v) => v.options.length > 0))
  const missing = computed(() => variants.value.filter((v) => !options[v.name]).map((v) => v.name))
  const soldOut = computed(() => product.value.stock !== null && product.value.stock <= 0)
  const max = computed(() =>
    product.value.stock === null ? MAX_PER_LINE : Math.min(MAX_PER_LINE, product.value.stock),
  )
  const lowStock = computed(() => {
    const stock = product.value.stock
    return stock !== null && stock > 0 && stock <= 5 ? stock : 0
  })

  watch(
    () => product.value.id,
    () => {
      for (const key of Object.keys(options)) delete options[key]
      quantity.value = 1
      showMissing.value = false
      added.value = false
    },
  )

  function select(name: string, option: string) {
    options[name] = option
    added.value = false
  }

  function addToCart() {
    if (soldOut.value) return
    if (missing.value.length) {
      showMissing.value = true
      return
    }
    const chosen: Record<string, string> = {}
    for (const variant of variants.value) chosen[variant.name] = options[variant.name] ?? ''
    cart.add(physicalLine(product.value, chosen, quantity.value))
    toast.success('Agregado al carrito')
    added.value = true
  }

  return {
    options,
    quantity,
    variants,
    missing,
    showMissing,
    soldOut,
    max,
    lowStock,
    added,
    select,
    addToCart,
  }
}
