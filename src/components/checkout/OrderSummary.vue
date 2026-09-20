<script setup lang="ts">
import { formatCents } from '@/utils/format'

export interface SummaryLine {
  key: string
  title: string
  subtitle?: string
  quantity: number
  totalCents: number
  image: string | null
}

defineProps<{
  lines: SummaryLine[]
  totalCents: number
  totalLabel?: string
  discountCents?: number
  heading?: string
  note?: string
}>()
</script>

<template>
  <section class="summary" aria-label="Resumen del pedido">
    <h2 class="summary__heading">{{ heading || 'Tu pedido' }}</h2>

    <ul class="summary__lines">
      <li v-for="line in lines" :key="line.key" class="summary__line">
        <div class="summary__media">
          <img v-if="line.image" :src="line.image" alt="" loading="lazy" />
          <i v-else class="fa-solid fa-music" aria-hidden="true"></i>
        </div>
        <div class="summary__info">
          <p class="summary__title">{{ line.title }}</p>
          <p class="summary__meta">
            <template v-if="line.subtitle">{{ line.subtitle }} · </template>Cant.
            {{ line.quantity }}
          </p>
        </div>
        <p class="summary__amount">{{ formatCents(line.totalCents) }}</p>
      </li>
    </ul>

    <div v-if="discountCents" class="summary__row">
      <span>Descuento</span>
      <span>− {{ formatCents(discountCents) }}</span>
    </div>
    <div class="summary__row summary__row--total">
      <span>{{ totalLabel || 'Total' }}</span>
      <strong>{{ formatCents(totalCents) }}</strong>
    </div>
    <p v-if="note" class="summary__note">{{ note }}</p>

    <slot />
  </section>
</template>

<style scoped lang="scss">
.summary {
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: $space-md;
  background: $sand;
  border-radius: $radius-md;
  min-width: 0;

  &__heading {
    @include display($text-lg, 600);
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.9rem);
    list-style: none;
    padding-bottom: 0.9rem;
    border-bottom: 1px solid $line;
  }

  &__line {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__media {
    @include flex(row, center, center);
    flex: 0 0 52px;
    height: 52px;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $surface;
    color: $accent-deep;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    font-size: $text-sm;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__meta,
  &__note {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__amount {
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
  }

  &__row {
    @include flex(row, baseline, space-between, 1rem);
    font-size: $text-sm;

    &--total {
      font-size: $text-base;

      strong {
        font-size: $text-xl;
      }
    }
  }
}
</style>
