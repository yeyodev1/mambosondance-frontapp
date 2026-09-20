<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useDetail } from '@/composables/useDetail'
import { formatLongDate, formatTime } from '@/utils/format'
import { optimized } from '@/utils/image'
import AsyncState from '@/components/ui/AsyncState.vue'
import DetailSkeleton from '@/components/ui/DetailSkeleton.vue'
import DetailHero from '@/components/catalog/DetailHero.vue'
import EventAccess from '@/components/catalog/EventAccess.vue'

const { data: event, loading, error, reload } = useDetail((slug) => catalogService.event(slug))

const place = computed(() => [event.value?.venue, event.value?.city].filter(Boolean).join(' · '))

const schedule = computed(() => {
  if (!event.value) return ''
  const start = formatTime(event.value.startsAt)
  return event.value.endsAt ? `${start} – ${formatTime(event.value.endsAt)}` : start
})
</script>

<template>
  <div class="event">
    <AsyncState :loading="loading" :error="error" @retry="reload">
      <template #skeleton><DetailSkeleton /></template>
      <template #error-actions>
        <RouterLink to="/eventos" class="btn btn--primary">Ver todos los eventos</RouterLink>
      </template>

      <template v-if="event">
        <DetailHero
          :image="event.cover?.url"
          :alt="event.title"
          :eyebrow="site.eventCategories[event.category]"
          :title="event.title"
          back-to="/eventos"
          :back-label="site.home.events.eyebrow"
        >
          <ul class="event__facts">
            <li>
              <i class="fa-regular fa-calendar" aria-hidden="true"></i>
              <time :datetime="event.startsAt">{{ formatLongDate(event.startsAt) }}</time>
            </li>
            <li><i class="fa-regular fa-clock" aria-hidden="true"></i> {{ schedule }}</li>
            <li v-if="place">
              <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
              <span>
                {{ place }}
                <a
                  v-if="event.mapUrl"
                  class="event__map"
                  :href="event.mapUrl"
                  target="_blank"
                  rel="noopener"
                >
                  Cómo llegar
                </a>
              </span>
            </li>
          </ul>
        </DetailHero>

        <div class="event__layout">
          <div class="event__main">
            <p v-if="event.summary" class="event__summary">{{ event.summary }}</p>

            <section v-if="event.artists.length" class="event__block">
              <h2 class="event__heading">Artistas</h2>
              <ul class="event__artists">
                <li v-for="artist in event.artists" :key="artist">{{ artist }}</li>
              </ul>
            </section>

            <section v-if="event.description" class="event__block">
              <h2 class="event__heading">Sobre el evento</h2>
              <p class="event__description">{{ event.description }}</p>
            </section>

            <section v-if="event.gallery.length" class="event__block" aria-label="Galería">
              <div class="event__gallery">
                <img
                  v-for="image in event.gallery"
                  :key="image.publicId || image.url"
                  :src="optimized(image.url, 800)"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </section>
          </div>

          <div class="event__side">
            <EventAccess :event="event" />
          </div>
        </div>
      </template>
    </AsyncState>
  </div>
</template>

<style scoped lang="scss">
.event {
  @include flex(column, stretch);
  width: 100%;

  &__facts {
    @include flex(column, stretch, flex-start, 0.7rem);
    list-style: none;
    margin-top: 0.5rem;
    font-size: $text-base;
    color: rgba($on-dark, 0.9);

    li {
      @include flex(row, baseline, flex-start, 0.8rem);
    }

    // Intl entrega "sábado, 7 de…" en minúscula.
    time {
      display: inline-block;

      &::first-letter {
        text-transform: uppercase;
      }
    }

    i {
      flex: 0 0 1rem;
      text-align: center;
      color: $accent;
    }
  }

  &__map {
    display: inline-block;
    margin-left: 0.4rem;
    padding-block: 0.6rem;
    font-size: $text-sm;
    font-weight: 600;
    color: $on-dark;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  &__layout {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: 2.5rem $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
      padding-top: 4rem;
    }
  }

  // En el celular las entradas van antes que la descripción.
  &__side {
    order: -1;

    @include from('md') {
      order: 0;
      flex: 0 0 38%;
      position: sticky;
      top: 6.5rem;
      // Deja pasar el afiche que cuelga del hero.
      margin-top: 3.5rem;
    }

    &:empty {
      display: none;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 3rem);
    flex: 1;
    min-width: 0;
  }

  &__summary {
    font-size: $text-xl;
    font-weight: 300;
    line-height: 1.45;
    color: $ink;
  }

  &__block {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__heading {
    @include eyebrow;
  }

  &__artists {
    @include flex(column, stretch);
    list-style: none;

    li {
      @include display($display-sm);
      padding-block: 0.8rem;
      border-bottom: 1px solid $line;
      overflow-wrap: anywhere;

      &:first-child {
        border-top: 1px solid $line;
      }
    }
  }

  &__description {
    font-size: $text-lg;
    font-weight: 300;
    line-height: 1.7;
    color: $ink-soft;
    white-space: pre-line;
    max-width: 40rem;
  }

  &__gallery {
    @include flex-cards(130px, 0.75rem);

    img {
      aspect-ratio: 1;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
