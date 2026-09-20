<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import EventCard from '@/components/catalog/EventCard.vue'
import type { EventItem } from '@/types'

const copy = site.home.events

// Primero los destacados; si no hay ninguno marcado, los próximos a secas.
const { data, loading, error, run } = useAsyncData<EventItem[]>(async () => {
  const featured = await catalogService.events({ when: 'upcoming', featured: true, limit: 3 })
  if (featured.items.length) return featured.items
  return (await catalogService.events({ when: 'upcoming', limit: 3 })).items
})

const events = computed(() => (data.value ?? []).slice(0, 3))

onMounted(run)
</script>

<template>
  <section class="events">
    <div class="events__inner">
      <div class="events__head">
        <SectionHeading
          v-reveal
          tone="wine"
          :eyebrow="copy.eyebrow"
          :title="copy.title"
          :text="copy.text"
        />
        <RouterLink v-reveal="120" :to="copy.cta.to" class="btn btn--outline-light">
          {{ copy.cta.label }}
        </RouterLink>
      </div>

      <AsyncState
        tone="dark"
        :loading="loading"
        :error="error"
        :empty="!events.length"
        :empty-text="copy.empty"
        @retry="run"
      >
        <template #skeleton><SkeletonCards tone="dark" :count="3" /></template>
        <div class="events__list">
          <EventCard
            v-for="(event, index) in events"
            :key="event.id"
            v-reveal="index * 100"
            :event="event"
          />
        </div>
      </AsyncState>
    </div>
  </section>
</template>

<style scoped lang="scss">
.events {
  background: radial-gradient(circle at 85% 0%, rgba($accent-deep, 0.65), transparent 55%), $wine;
  color: $on-dark;

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

  &__list {
    @include flex-cards(280px, 1.5rem);

    // Con uno o dos eventos, que no se estiren a lo ancho de la página.
    > * {
      max-width: 30rem;
    }
  }
}
</style>
