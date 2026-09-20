<script setup lang="ts">
import { computed } from 'vue'
import type { EventItem } from '@/types'
import { site } from '@/config/site'
import { isPastEvent, posterDate } from '@/utils/events'
import AppImage from '@/components/ui/AppImage.vue'

const props = defineProps<{ event: EventItem }>()

const date = computed(() => posterDate(props.event.startsAt))
const past = computed(() => isPastEvent(props.event))
const place = computed(() => [props.event.venue, props.event.city].filter(Boolean).join(' · '))
</script>

<template>
  <RouterLink :to="`/eventos/${event.slug}`" class="event" :class="{ 'event--past': past }">
    <AppImage :src="event.cover?.url" :alt="event.title" ratio="4/5" :width="760" />

    <!-- La fecha manda, como en un afiche: día enorme y mes debajo. -->
    <time class="event__date" :datetime="event.startsAt">
      <span class="event__day">{{ date.day }}</span>
      <span class="event__month">{{ date.month }} {{ date.year }}</span>
    </time>

    <div class="event__body">
      <p class="event__category">{{ site.eventCategories[event.category] }}</p>
      <h3 class="event__title">{{ event.title }}</h3>
      <p v-if="place" class="event__place">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ place }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.event {
  position: relative;
  display: block;
  overflow: hidden;
  color: $on-dark;
  background: $wine;
  @include focus-ring($on-dark);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba($night, 0.15) 0%,
      rgba($wine, 0.35) 45%,
      rgba($night, 0.94) 100%
    );
    pointer-events: none;
    @include transition(opacity);
  }

  &:hover :deep(.app-image__img) {
    transform: scale(1.05);
  }

  &--past :deep(.app-image__img) {
    filter: grayscale(0.85);
  }

  &__date {
    @include flex(column, flex-start, flex-start, 0.2rem);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 0.9rem 1rem 0.8rem;
    background: $accent;
  }

  &--past &__date {
    background: $night;
  }

  &__day {
    @include display(clamp(3rem, 2.2rem + 3vw, 4.4rem));
    line-height: 0.85;
  }

  &__month {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  &__body {
    @include flex(column, flex-start, flex-end, 0.45rem);
    position: absolute;
    inset: auto 0 0;
    z-index: 1;
    padding: 1.25rem;

    @include from('md') {
      padding: 1.6rem;
    }
  }

  &__category {
    @include eyebrow;
    color: $on-dark-soft;
  }

  &__title {
    // Tamaño contenido: una palabra larga ("aniversario") debe caber entera en la tarjeta.
    @include display($text-xl);
    overflow-wrap: break-word;
  }

  &__place {
    font-size: $text-sm;
    color: $on-dark-soft;

    i {
      margin-right: 0.3rem;
      color: $accent;
    }
  }
}
</style>
