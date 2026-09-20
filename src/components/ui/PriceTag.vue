<script setup lang="ts">
import { computed } from 'vue'
import { formatCents } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    cents: number
    compareAtCents?: number | null
    size?: 'sm' | 'md' | 'lg'
    tone?: 'light' | 'dark'
  }>(),
  { compareAtCents: null, size: 'md', tone: 'light' },
)

const hasDiscount = computed(
  () => props.compareAtCents !== null && props.compareAtCents > props.cents,
)
const isFree = computed(() => props.cents === 0)
</script>

<template>
  <p class="price" :class="[`price--${size}`, `price--${tone}`]">
    <span class="price__now">{{ isFree ? 'Gratis' : formatCents(cents) }}</span>
    <s v-if="hasDiscount && compareAtCents !== null" class="price__before">
      <span class="visually-hidden">Antes</span>
      {{ formatCents(compareAtCents) }}
    </s>
  </p>
</template>

<style scoped lang="scss">
.price {
  @include flex(row, baseline, flex-start, 0.6rem);
  flex-wrap: wrap;

  &__now {
    font-family: $font-display;
    font-weight: 700;
    font-size: $text-lg;
    line-height: 1;
    letter-spacing: 0.01em;
    color: $ink;
  }

  &__before {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &--sm &__now {
    font-size: $text-base;
  }

  &--lg &__now {
    font-size: $display-sm;
  }

  &--dark &__now {
    color: $on-dark;
  }

  &--dark &__before {
    color: $on-dark-soft;
  }
}
</style>
