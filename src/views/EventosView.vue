<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { usePagedList } from '@/composables/usePagedList'
import { vReveal } from '@/composables/useReveal'
import type { EventCategory, EventItem } from '@/types'
import PageHero from '@/components/ui/PageHero.vue'
import ChipFilter from '@/components/ui/ChipFilter.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import LoadMore from '@/components/ui/LoadMore.vue'
import EventCard from '@/components/catalog/EventCard.vue'

const copy = site.home.events
const when = ref<'upcoming' | 'past'>('upcoming')
const category = ref('')

const tabs = [
  { value: 'upcoming', label: 'Próximos' },
  { value: 'past', label: 'Pasados' },
] as const

const categoryOptions = [
  { value: '', label: 'Todos' },
  ...Object.entries(site.eventCategories).map(([value, label]) => ({ value, label })),
]

const { items, loading, loadingMore, error, hasMore, isEmpty, reload, loadMore } =
  usePagedList<EventItem>((page) =>
    catalogService.events({
      when: when.value,
      category: (category.value || undefined) as EventCategory | undefined,
      page,
      limit: 12,
    }),
  )

watch([when, category], reload)
onMounted(reload)
</script>

<template>
  <div class="events">
    <PageHero
      :eyebrow="copy.eyebrow"
      :title="copy.title"
      :text="copy.text"
      :image="site.photos.social"
    />

    <section class="events__section">
      <div class="events__filters">
        <div class="events__tabs" role="tablist" aria-label="Cuándo">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            role="tab"
            class="events__tab"
            :class="{ 'events__tab--active': when === tab.value }"
            :aria-selected="when === tab.value"
            @click="when = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        <ChipFilter v-model="category" :options="categoryOptions" label="Filtrar por categoría" />
      </div>

      <AsyncState
        :loading="loading"
        :error="error"
        :empty="isEmpty"
        :empty-title="when === 'upcoming' ? 'Muy pronto' : 'Sin eventos pasados'"
        :empty-text="
          when === 'upcoming' ? copy.empty : 'Cuando cerremos una fecha, la encontrarás aquí.'
        "
        @retry="reload"
      >
        <template #skeleton><SkeletonCards :count="3" /></template>
        <template v-if="category" #empty-actions>
          <button type="button" class="btn btn--ghost" @click="category = ''">Ver todos</button>
        </template>

        <div class="events__list">
          <EventCard
            v-for="(event, index) in items"
            :key="event.id"
            v-reveal="(index % 3) * 100"
            :event="event"
          />
        </div>
        <LoadMore :visible="hasMore" :loading="loadingMore" @more="loadMore" />
      </AsyncState>
    </section>
  </div>
</template>

<style scoped lang="scss">
.events {
  @include flex(column, stretch);
  width: 100%;

  &__section {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: 2rem $space-section;

    @include from('md') {
      padding-top: 3rem;
    }
  }

  &__filters {
    @include flex(column, stretch, flex-start, 1.25rem);
    min-width: 0;
  }

  &__tabs {
    @include flex(row, stretch, flex-start, 2rem);
    border-bottom: 1px solid $line;
  }

  &__tab {
    @include display($text-xl, 600);
    position: relative;
    min-height: 52px;
    padding-block: 0.75rem;
    color: $ink-muted;
    @include transition(color);

    &::after {
      content: '';
      position: absolute;
      inset: auto 0 -1px;
      height: 3px;
      background: $accent;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.45s $ease;
    }

    &:hover,
    &--active {
      color: $ink;
    }

    &--active::after {
      transform: scaleX(1);
    }
  }

  &__list {
    @include flex-cards(280px, 1.5rem);

    > * {
      max-width: 30rem;
    }
  }
}
</style>
