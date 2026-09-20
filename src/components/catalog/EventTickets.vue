<script setup lang="ts">
import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import type { EventItem } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useTicketSelection } from '@/composables/useTicketSelection'
import { ticketLine } from '@/utils/cartLines'
import { tierStatusLabel } from '@/utils/events'
import { formatCents, formatDate } from '@/utils/format'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'

const props = defineProps<{ event: EventItem }>()

const router = useRouter()
const cart = useCartStore()
const { rows, selectedId, selected, quantity, max, totalCents, anyAvailable } = useTicketSelection(
  toRef(props, 'event'),
)

function hint(row: (typeof rows.value)[number]): string {
  if (row.status === 'upcoming' && row.tier.availableFrom) {
    return `Desde el ${formatDate(row.tier.availableFrom)}`
  }
  if (row.status === 'available' && row.tier.availableUntil) {
    return `Hasta el ${formatDate(row.tier.availableUntil)}`
  }
  if (row.status === 'available' && row.remaining !== null && row.remaining <= 10) {
    return row.remaining === 1 ? 'Queda 1' : `Quedan ${row.remaining}`
  }
  return ''
}

function buy() {
  if (!selected.value) return
  cart.add(ticketLine(props.event, selected.value.tier, quantity.value))
  router.push('/carrito')
}
</script>

<template>
  <div class="tickets">
    <h2 class="tickets__heading">Entradas</h2>

    <div class="tickets__list" role="radiogroup" aria-label="Tipo de entrada">
      <label
        v-for="row in rows"
        :key="row.tier.id"
        class="tickets__tier"
        :class="[
          `tickets__tier--${row.status}`,
          { 'tickets__tier--selected': selectedId === row.tier.id },
        ]"
      >
        <input
          v-model="selectedId"
          class="visually-hidden"
          type="radio"
          name="tier"
          :value="row.tier.id"
          :disabled="row.status !== 'available'"
        />
        <span class="tickets__radio" aria-hidden="true"></span>
        <span class="tickets__info">
          <span class="tickets__name">{{ row.tier.name }}</span>
          <span class="tickets__status">
            {{ tierStatusLabel[row.status]
            }}<template v-if="hint(row)"> · {{ hint(row) }}</template>
          </span>
        </span>
        <span class="tickets__price">
          {{ row.tier.priceCents === 0 ? 'Gratis' : formatCents(row.tier.priceCents) }}
        </span>
      </label>
    </div>

    <p v-if="!anyAvailable" class="tickets__none">
      Por ahora no hay entradas a la venta para este evento.
    </p>

    <div v-else class="tickets__buy">
      <QuantityStepper v-model="quantity" :max="max" :disabled="!selected" />
      <p class="tickets__total">
        <span>Total</span>
        <strong>{{ formatCents(totalCents) }}</strong>
      </p>
      <button type="button" class="btn btn--primary btn--block" :disabled="!selected" @click="buy">
        Comprar entradas
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tickets {
  @include flex(column, stretch, flex-start, 1.25rem);
  padding: 1.75rem 1.25rem;
  background: $sand;
  border-top: 3px solid $accent;

  @include from('md') {
    padding: 2.25rem 2rem;
  }

  &__heading {
    @include display($display-sm);
  }

  &__list {
    @include flex(column, stretch);
    border-top: 1px solid $line;
  }

  &__tier {
    @include flex(row, center, flex-start, 0.9rem);
    min-height: 64px;
    margin: 0;
    padding: 0.85rem 0.25rem;
    border-bottom: 1px solid $line;
    font-size: $text-base;
    color: $ink;
    cursor: pointer;

    &:focus-within .tickets__radio {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &:not(.tickets__tier--available) {
      cursor: not-allowed;
      color: $ink-muted;

      .tickets__price {
        text-decoration: line-through;
      }
    }
  }

  &__radio {
    flex: 0 0 20px;
    height: 20px;
    border: 1.5px solid $ink-muted;
    border-radius: 50%;
    @include transition;
  }

  &__tier--selected &__radio {
    border: 6px solid $accent;
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    line-height: 1.3;
  }

  &__status {
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__tier--available &__status {
    color: $ink-soft;
  }

  &__tier--soldout &__status {
    color: $danger;
  }

  &__price {
    font-family: $font-display;
    font-weight: 700;
    font-size: $text-lg;
    white-space: nowrap;
  }

  &__none {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__buy {
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-top: 0.5rem;
  }

  &__total {
    @include flex(column, flex-end, flex-start, 0);
    font-size: $text-xs;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $ink-muted;

    strong {
      font-family: $font-display;
      font-size: $text-xl;
      letter-spacing: 0;
      color: $ink;
    }
  }
}
</style>
