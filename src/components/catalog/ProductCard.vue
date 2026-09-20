<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import AppImage from '@/components/ui/AppImage.vue'
import PriceTag from '@/components/ui/PriceTag.vue'

const props = defineProps<{ product: Product }>()

const soldOut = computed(() => props.product.stock !== null && props.product.stock <= 0)
const image = computed(() => props.product.cover?.url ?? props.product.gallery[0]?.url ?? '')
</script>

<template>
  <RouterLink :to="`/tienda/${product.slug}`" class="product" :class="{ 'product--out': soldOut }">
    <div class="product__media">
      <AppImage :src="image" :alt="product.title" ratio="4/5" :width="640" />
      <span v-if="soldOut" class="product__flag">Agotado</span>
    </div>
    <div class="product__body">
      <p v-if="product.category" class="product__category">{{ product.category }}</p>
      <h3 class="product__title">{{ product.title }}</h3>
      <PriceTag :cents="product.priceCents" :compare-at-cents="product.compareAtCents" size="sm" />
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.product {
  @include flex(column, stretch, flex-start, 0.9rem);
  @include focus-ring;

  &__media {
    position: relative;
    overflow: hidden;
  }

  &:hover :deep(.app-image__img) {
    transform: scale(1.05);
  }

  &--out :deep(.app-image__img) {
    filter: grayscale(0.6);
  }

  &__flag {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.45rem 0.8rem;
    background: $night;
    color: $on-dark;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.3rem);
  }

  &__category {
    font-size: $text-xs;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 600;
    line-height: 1.3;
    text-transform: none;
    color: $ink;
    @include transition(color);
  }

  &:hover &__title {
    color: $accent;
  }
}
</style>
