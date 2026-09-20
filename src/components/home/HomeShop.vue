<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import ProductCard from '@/components/catalog/ProductCard.vue'
import type { Product } from '@/types'

const copy = site.home.shop

const { data, loading, error, run } = useAsyncData<Product[]>(async () => {
  const featured = await catalogService.products({ type: 'physical', featured: true, limit: 4 })
  if (featured.items.length) return featured.items
  return (await catalogService.products({ type: 'physical', limit: 4 })).items
})

const products = computed(() => (data.value ?? []).slice(0, 4))
// Sin productos todavía, la sección se queda en el titular y el enlace.
const showList = computed(() => loading.value || Boolean(error.value) || products.value.length > 0)

onMounted(run)
</script>

<template>
  <section class="shop">
    <div class="shop__inner">
      <div class="shop__head">
        <SectionHeading v-reveal :eyebrow="copy.eyebrow" :title="copy.title" :text="copy.text" />
        <RouterLink v-reveal="120" :to="copy.cta.to" class="btn btn--dark">
          {{ copy.cta.label }}
        </RouterLink>
      </div>

      <AsyncState v-if="showList" :loading="loading" :error="error" @retry="run">
        <template #skeleton><SkeletonCards :count="4" basis="200px" /></template>
        <div class="shop__list">
          <ProductCard
            v-for="(product, index) in products"
            :key="product.id"
            v-reveal="index * 80"
            :product="product"
          />
        </div>
      </AsyncState>
    </div>
  </section>
</template>

<style scoped lang="scss">
.shop {
  background: $paper;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: $space-section;
  }

  &__head {
    @include flex(column, flex-start, flex-start, 2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }

    .btn {
      flex: 0 0 auto;
    }
  }

  // Dos columnas en el celular: una tienda se recorre mejor en mosaico.
  &__list {
    @include flex-cards(140px, 1.75rem 1rem);

    @include from('md') {
      gap: 2rem;
    }

    > * {
      max-width: 22rem;

      @include from('md') {
        flex-basis: 220px;
      }
    }
  }
}
</style>
