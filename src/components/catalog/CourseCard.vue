<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { site } from '@/config/site'
import { formatDuration } from '@/utils/format'
import AppImage from '@/components/ui/AppImage.vue'
import PriceTag from '@/components/ui/PriceTag.vue'

const props = defineProps<{ course: Product }>()

const meta = computed(() => {
  const parts: string[] = []
  const lessons = props.course.lessonsCount
  if (lessons > 0) parts.push(`${lessons} ${lessons === 1 ? 'lección' : 'lecciones'}`)
  if (props.course.durationSeconds > 0) parts.push(formatDuration(props.course.durationSeconds))
  return parts.join(' · ')
})
</script>

<template>
  <RouterLink :to="`/clases/${course.slug}`" class="course">
    <div class="course__media">
      <AppImage :src="course.cover?.url" :alt="course.title" ratio="4/5" :width="720" />
      <span v-if="course.level" class="course__level">{{ site.levels[course.level] }}</span>
      <span class="course__play" aria-hidden="true"><i class="fa-solid fa-play"></i></span>
    </div>
    <div class="course__body">
      <p v-if="course.style" class="course__style">{{ course.style }}</p>
      <h3 class="course__title">{{ course.title }}</h3>
      <p v-if="meta" class="course__meta">{{ meta }}</p>
      <PriceTag :cents="course.priceCents" :compare-at-cents="course.compareAtCents" />
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.course {
  @include flex(column, stretch, flex-start, 1.1rem);
  @include focus-ring;

  &__media {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 40% 0 0;
      background: linear-gradient(transparent, rgba($wine, 0.75));
      pointer-events: none;
    }
  }

  &__level {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 0.5rem 0.9rem;
    background: $accent;
    color: $surface;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  &__play {
    @include flex(row, center, center);
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 1;
    width: 48px;
    height: 48px;
    border: 1px solid rgba($on-dark, 0.7);
    border-radius: 50%;
    color: $on-dark;
    font-size: 0.85rem;
    padding-left: 3px;
    @include transition;
  }

  &:hover &__play {
    background: $on-dark;
    color: $accent;
  }

  &:hover :deep(.app-image__img) {
    transform: scale(1.05);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.45rem);
  }

  &__style {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl, 700);
    color: $ink;
    @include transition(color);
  }

  &:hover &__title {
    color: $accent;
  }

  &__meta {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
