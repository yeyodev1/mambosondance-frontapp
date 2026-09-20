<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { usePagedList } from '@/composables/usePagedList'
import { vReveal } from '@/composables/useReveal'
import type { Product } from '@/types'
import PageHero from '@/components/ui/PageHero.vue'
import ChipFilter from '@/components/ui/ChipFilter.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import LoadMore from '@/components/ui/LoadMore.vue'
import ProductCard from '@/components/catalog/ProductCard.vue'

const copy = site.home.shop
const category = ref('')
const categories = ref<string[]>([])

const categoryOptions = computed(() => [
  { value: '', label: 'Todo' },
  ...categories.value.map((name) => ({ value: name, label: name })),
])

const { items, loading, loadingMore, error, hasMore, isEmpty, reload, loadMore } =
  usePagedList<Product>((page) =>
    catalogService.products({
      type: 'physical',
      category: category.value || undefined,
      page,
      limit: 16,
    }),
  )

async function loadCategories() {
  try {
    categories.value = await catalogService.categories()
  } catch {
    // Sin categorías la tienda se ve completa, solo que sin filtros.
    categories.value = []
  }
}

watch(category, reload)

onMounted(() => {
  loadCategories()
  reload()
})
</script>

<template>
  <div class="shop">
    <PageHero
      :eyebrow="copy.eyebrow"
      :title="copy.title"
      :text="copy.text"
      :image="site.photos.couple"
    />

    <section class="shop__section">
      <ChipFilter
        v-if="categories.length"
        v-model="category"
        :options="categoryOptions"
        label="Filtrar por categoría"
      />

      <AsyncState
        :loading="loading"
        :error="error"
        :empty="isEmpty"
        empty-title="Muy pronto"
        :empty-text="
          category
            ? 'No hay productos en esta categoría por ahora.'
            : 'Estamos preparando la tienda. Vuelve en unos días.'
        "
        @retry="reload"
      >
        <template #skeleton><SkeletonCards :count="4" basis="140px" /></template>
        <template v-if="category" #empty-actions>
          <button type="button" class="btn btn--ghost" @click="category = ''">Ver todo</button>
        </template>

        <div class="shop__list">
          <ProductCard
            v-for="(product, index) in items"
            :key="product.id"
            v-reveal="(index % 4) * 80"
            :product="product"
          />
        </div>
        <LoadMore :visible="hasMore" :loading="loadingMore" @more="loadMore" />
      </AsyncState>
    </section>
  </div>
</template>

<style scoped lang="scss">
.shop {
  @include flex(column, stretch);
  width: 100%;

  &__section {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: 2.5rem $space-section;

    @include from('md') {
      padding-top: 3.5rem;
    }
  }

  // Mosaico de dos columnas en el celular, cuatro en escritorio.
  &__list {
    @include flex-cards(140px, 2rem 1rem);

    @include from('md') {
      gap: 3rem 2rem;
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
