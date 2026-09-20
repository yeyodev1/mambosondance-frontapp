<script setup lang="ts">
import { computed } from 'vue'
import type { Teacher } from '@/types'
import AppImage from '@/components/ui/AppImage.vue'

const props = defineProps<{
  teacher: Teacher
  /** Los fundadores van en formato grande, con la reseña completa. */
  featured?: boolean
}>()

const instagramUrl = computed(() => {
  const raw = props.teacher.instagram.trim()
  if (!raw) return ''
  return /^https?:\/\//i.test(raw) ? raw : `https://www.instagram.com/${raw.replace(/^@/, '')}`
})

const handle = computed(() => {
  const raw = props.teacher.instagram.trim().replace(/\/+$/, '')
  return `@${(raw.split('/').pop() || raw).replace(/^@/, '')}`
})
</script>

<template>
  <article class="teacher" :class="{ 'teacher--featured': featured }">
    <div class="teacher__media">
      <AppImage
        :src="teacher.photo?.url"
        :alt="teacher.name"
        :ratio="featured ? '4/5' : '3/4'"
        :width="featured ? 1000 : 640"
      />
    </div>
    <div class="teacher__body">
      <p v-if="teacher.role" class="teacher__role">{{ teacher.role }}</p>
      <h3 class="teacher__name">{{ teacher.name }}</h3>
      <p v-if="teacher.bio" class="teacher__bio">{{ teacher.bio }}</p>
      <a
        v-if="instagramUrl"
        class="teacher__link"
        :href="instagramUrl"
        target="_blank"
        rel="noopener"
        :aria-label="`Instagram de ${teacher.name}`"
      >
        <i class="fa-brands fa-instagram" aria-hidden="true"></i> {{ handle }}
      </a>
    </div>
  </article>
</template>

<style scoped lang="scss">
.teacher {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__media {
    overflow: hidden;
  }

  &:hover :deep(.app-image__img) {
    transform: scale(1.04);
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.5rem);
  }

  &__role {
    @include eyebrow;
  }

  &__name {
    @include display($text-xl);
    color: $ink;
  }

  &__bio {
    font-size: $text-sm;
    color: $ink-soft;
    white-space: pre-line;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__link {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }

  &--featured {
    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      gap: 3.5rem;

      // Alterna el lado de la foto para romper la simetría.
      &:nth-child(even) {
        flex-direction: row-reverse;
      }
    }

    .teacher__media {
      @include from('md') {
        flex: 0 0 44%;
      }
    }

    .teacher__body {
      gap: 0.9rem;

      @include from('md') {
        padding-bottom: 1.5rem;
      }
    }

    .teacher__name {
      font-size: $display-md;
    }

    .teacher__bio {
      display: block;
      font-size: $text-base;
      font-weight: 300;
      line-height: 1.75;
      max-width: 36rem;
    }
  }
}
</style>
