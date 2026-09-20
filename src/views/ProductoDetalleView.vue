<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useSettingsStore } from '@/stores/settings'
import { useDetail } from '@/composables/useDetail'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import PriceTag from '@/components/ui/PriceTag.vue'
import ProductGallery from '@/components/catalog/ProductGallery.vue'
import ProductBuyBox from '@/components/catalog/ProductBuyBox.vue'

const settings = useSettingsStore()
const { data: product, loading, error, reload } = useDetail((slug) => catalogService.product(slug))

// Un curso abierto desde un enlace de tienda se manda a su página de clase.
const router = useRouter()
watch(product, (item) => {
  if (item?.type === 'course') router.replace(`/clases/${item.slug}`)
})

onMounted(() => settings.load())
</script>

<template>
  <div class="product">
    <div class="product__inner">
      <RouterLink to="/tienda" class="product__back">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ site.home.shop.eyebrow }}
      </RouterLink>

      <AsyncState :loading="loading" :error="error" @retry="reload">
        <template #skeleton><SkeletonCards :count="2" basis="300px" /></template>
        <template #error-actions>
          <RouterLink to="/tienda" class="btn btn--primary">{{
            site.home.shop.cta.label
          }}</RouterLink>
        </template>

        <div v-if="product" class="product__layout">
          <ProductGallery class="product__gallery" :product="product" />

          <div class="product__info">
            <header class="product__head">
              <p v-if="product.category" class="product__category">{{ product.category }}</p>
              <h1 class="product__title">{{ product.title }}</h1>
              <PriceTag
                :cents="product.priceCents"
                :compare-at-cents="product.compareAtCents"
                size="lg"
              />
              <p v-if="product.summary" class="product__summary">{{ product.summary }}</p>
            </header>

            <ProductBuyBox :product="product" :shipping-note="settings.shippingNote" />

            <section v-if="product.description" class="product__details">
              <h2 class="product__heading">Detalles</h2>
              <p class="product__description">{{ product.description }}</p>
            </section>
          </div>
        </div>
      </AsyncState>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product {
  width: 100%;
  background: $paper;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 1rem);
    padding-block: 1rem $space-section;

    @include from('md') {
      padding-top: 2rem;
    }
  }

  &__back {
    @include flex(row, center, flex-start, 0.6rem);
    align-self: flex-start;
    min-height: 44px;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $ink-soft;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  &__gallery {
    @include from('md') {
      flex: 0 0 52%;
      position: sticky;
      top: 6.5rem;
    }
  }

  &__info {
    @include flex(column, stretch, flex-start, 2.25rem);
    flex: 1;
    min-width: 0;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 0.9rem);
  }

  &__category {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    overflow-wrap: anywhere;
  }

  &__summary {
    font-size: $text-lg;
    font-weight: 300;
    color: $ink-soft;
  }

  &__details {
    @include flex(column, stretch, flex-start, 0.9rem);
    padding-top: 2rem;
    border-top: 1px solid $line;
  }

  &__heading {
    @include eyebrow;
    color: $ink;
  }

  &__description {
    font-weight: 300;
    line-height: 1.75;
    color: $ink-soft;
    white-space: pre-line;
  }
}
</style>
