import { computed, ref, watch, type Ref } from 'vue'
import type { EventItem, TicketTier } from '@/types'
import { tierRemaining, tierStatus, type TierStatus } from '@/utils/events'

export interface TierRow {
  tier: TicketTier
  status: TierStatus
  remaining: number | null
}

const MAX_PER_ORDER = 10

/** Qué tier está elegido, cuántas entradas y hasta cuántas se pueden pedir. */
export function useTicketSelection(event: Ref<EventItem>) {
  const selectedId = ref('')
  const quantity = ref(1)

  const rows = computed<TierRow[]>(() =>
    event.value.tiers.map((tier) => ({
      tier,
      status: tierStatus(tier),
      remaining: tierRemaining(tier),
    })),
  )

  const selected = computed(
    () =>
      rows.value.find((row) => row.tier.id === selectedId.value && row.status === 'available') ??
      null,
  )

  const max = computed(() => Math.min(MAX_PER_ORDER, selected.value?.remaining ?? MAX_PER_ORDER))
  const totalCents = computed(() => (selected.value?.tier.priceCents ?? 0) * quantity.value)
  const anyAvailable = computed(() => rows.value.some((row) => row.status === 'available'))

  // Arranca con la primera disponible ya marcada: un toque menos para comprar.
  watch(
    rows,
    (list) => {
      if (!selected.value)
        selectedId.value = list.find((r) => r.status === 'available')?.tier.id ?? ''
    },
    { immediate: true },
  )

  watch(max, (limit) => {
    if (quantity.value > limit) quantity.value = Math.max(1, limit)
  })

  return { rows, selectedId, selected, quantity, max, totalCents, anyAvailable }
}
