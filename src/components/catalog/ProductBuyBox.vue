<script setup lang="ts">
import { toRef } from 'vue'
import type { Product } from '@/types'
import { useProductPurchase } from '@/composables/useProductPurchase'
import QuantityStepper from '@/components/ui/QuantityStepper.vue'

const props = defineProps<{ product: Product; shippingNote?: string }>()

const {
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
} = useProductPurchase(toRef(props, 'product'))
</script>

<template>
  <div class="buy">
    <fieldset v-for="variant in variants" :key="variant.name" class="buy__variant">
      <legend class="buy__legend">
        {{ variant.name }}
        <span v-if="options[variant.name]" class="buy__chosen">{{ options[variant.name] }}</span>
      </legend>
      <div class="buy__options">
        <button
          v-for="option in variant.options"
          :key="option"
          type="button"
          class="buy__option"
          :class="{ 'buy__option--active': options[variant.name] === option }"
          :aria-pressed="options[variant.name] === option"
          :disabled="soldOut"
          @click="select(variant.name, option)"
        >
          {{ option }}
        </button>
      </div>
    </fieldset>

    <p v-if="showMissing && missing.length" class="buy__error" role="alert">
      Elige {{ missing.join(' y ').toLowerCase() }} para continuar.
    </p>

    <div class="buy__row">
      <QuantityStepper v-model="quantity" :max="max" :disabled="soldOut" />
      <button
        type="button"
        class="btn btn--primary buy__add"
        :disabled="soldOut"
        @click="addToCart"
      >
        <i v-if="!soldOut" class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
        {{ soldOut ? 'Agotado' : 'Agregar al carrito' }}
      </button>
    </div>

    <p v-if="lowStock" class="buy__stock">
      {{ lowStock === 1 ? 'Queda la última unidad' : `Quedan ${lowStock} unidades` }}
    </p>

    <RouterLink v-if="added" to="/carrito" class="btn btn--ghost btn--block"
      >Ver carrito</RouterLink
    >

    <p v-if="shippingNote" class="buy__shipping">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
      <span>{{ shippingNote }}</span>
    </p>
  </div>
</template>

<style scoped lang="scss">
.buy {
  @include flex(column, stretch, flex-start, 1.5rem);

  &__variant {
    @include flex(column, stretch, flex-start, 0.75rem);
    border: 0;
    min-width: 0;
  }

  &__legend {
    @include eyebrow;
    color: $ink;
    margin-bottom: 0.75rem;
  }

  &__chosen {
    margin-left: 0.5rem;
    font-weight: 400;
    letter-spacing: 0.04em;
    text-transform: none;
    color: $ink-soft;
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__option {
    min-width: 48px;
    min-height: 48px;
    padding: 0.5rem 1rem;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    @include transition;

    &:hover:not(:disabled) {
      border-color: $ink;
    }

    &--active,
    &--active:hover:not(:disabled) {
      background: $ink;
      border-color: $ink;
      color: $surface;
    }

    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  }

  &__error {
    font-size: $text-sm;
    font-weight: 500;
    color: $danger;
  }

  &__row {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
  }

  &__add {
    flex: 1 1 12rem;
  }

  &__stock {
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
  }

  &__shipping {
    @include flex(row, baseline, flex-start, 0.8rem);
    padding-top: 1.25rem;
    border-top: 1px solid $line;
    font-size: $text-sm;
    color: $ink-soft;
    white-space: pre-line;

    i {
      color: $accent;
    }
  }
}
</style>
