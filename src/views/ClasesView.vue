<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { usePagedList } from '@/composables/usePagedList'
import { vReveal } from '@/composables/useReveal'
import type { CourseLevel, Product } from '@/types'
import PageHero from '@/components/ui/PageHero.vue'
import ChipFilter from '@/components/ui/ChipFilter.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import LoadMore from '@/components/ui/LoadMore.vue'
import CourseCard from '@/components/catalog/CourseCard.vue'

const copy = site.home.online
const level = ref('')

const levelOptions = [
  { value: '', label: 'Todas' },
  ...Object.entries(site.levels).map(([value, label]) => ({ value, label })),
]

const { items, loading, loadingMore, error, hasMore, isEmpty, reload, loadMore } =
  usePagedList<Product>((page) =>
    catalogService.products({
      type: 'course',
      level: (level.value || undefined) as CourseLevel | undefined,
      page,
      limit: 12,
    }),
  )

watch(level, reload)
onMounted(reload)
</script>

<template>
  <div class="courses">
    <PageHero
      :eyebrow="copy.eyebrow"
      :title="copy.title"
      :script="copy.script"
      :text="copy.text"
      :image="site.photos.steps"
    />

    <section class="courses__section">
      <ChipFilter v-model="level" :options="levelOptions" label="Filtrar por nivel" />

      <AsyncState
        :loading="loading"
        :error="error"
        :empty="isEmpty"
        empty-title="Aún no hay clases aquí"
        :empty-text="
          level
            ? 'No encontramos clases de este nivel. Prueba con otro.'
            : 'Estamos grabando las primeras sesiones. Muy pronto las verás aquí.'
        "
        @retry="reload"
      >
        <template #skeleton><SkeletonCards :count="3" /></template>
        <template v-if="level" #empty-actions>
          <button type="button" class="btn btn--ghost" @click="level = ''">Ver todas</button>
        </template>

        <div class="courses__list">
          <CourseCard
            v-for="(course, index) in items"
            :key="course.id"
            v-reveal="(index % 3) * 100"
            :course="course"
          />
        </div>
        <LoadMore :visible="hasMore" :loading="loadingMore" @more="loadMore" />
      </AsyncState>
    </section>
  </div>
</template>

<style scoped lang="scss">
.courses {
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

  &__list {
    @include flex-cards(270px, 3rem 2rem);

    > * {
      max-width: 26rem;
    }
  }
}
</style>
