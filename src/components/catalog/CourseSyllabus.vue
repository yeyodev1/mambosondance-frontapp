<script setup lang="ts">
import type { CourseModule, Lesson } from '@/types'
import { formatDuration } from '@/utils/format'

defineProps<{ modules: CourseModule[] }>()
const emit = defineEmits<{ preview: [lesson: Lesson] }>()
</script>

<template>
  <div class="syllabus">
    <details
      v-for="(module, index) in modules"
      :key="module.id"
      class="syllabus__module"
      :open="index === 0"
    >
      <summary class="syllabus__summary">
        <span class="syllabus__index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="syllabus__name">{{ module.title }}</span>
        <span class="syllabus__count">
          {{ module.lessons.length }} {{ module.lessons.length === 1 ? 'lección' : 'lecciones' }}
        </span>
        <i class="fa-solid fa-chevron-down syllabus__chevron" aria-hidden="true"></i>
      </summary>

      <ol class="syllabus__lessons">
        <li v-for="lesson in module.lessons" :key="lesson.id" class="syllabus__lesson">
          <div class="syllabus__info">
            <p class="syllabus__title">{{ lesson.title }}</p>
            <p v-if="lesson.durationSeconds > 0" class="syllabus__time">
              {{ formatDuration(lesson.durationSeconds) }}
            </p>
          </div>

          <button
            v-if="lesson.isFreePreview"
            type="button"
            class="syllabus__preview"
            @click="emit('preview', lesson)"
          >
            <i class="fa-solid fa-play" aria-hidden="true"></i> Vista previa gratis
          </button>
          <span v-else class="syllabus__lock">
            <i class="fa-solid fa-lock" aria-hidden="true"></i>
            <span class="visually-hidden">Disponible al comprar</span>
          </span>
        </li>
      </ol>
    </details>
  </div>
</template>

<style scoped lang="scss">
.syllabus {
  @include flex(column, stretch);
  border-top: 1px solid $line;

  &__module {
    border-bottom: 1px solid $line;

    &[open] .syllabus__chevron {
      transform: rotate(180deg);
    }
  }

  &__summary {
    @include flex(row, center, flex-start, 0.9rem);
    min-height: 64px;
    padding-block: 1rem;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }
  }

  &__index {
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: $accent;
  }

  &__name {
    @include display($text-lg);
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
  }

  &__count {
    display: none;
    font-size: $text-sm;
    color: $ink-muted;

    @include from('md') {
      display: block;
    }
  }

  &__chevron {
    font-size: 0.8rem;
    color: $ink-soft;
    transition: transform 0.4s $ease;
  }

  &__lessons {
    @include flex(column, stretch);
    list-style: none;
    padding-bottom: 1rem;
  }

  &__lesson {
    @include flex(row, center, space-between, 0.5rem 1rem);
    flex-wrap: wrap;
    padding: 0.7rem 0 0.7rem 1.9rem;
    border-top: 1px dashed $line;
  }

  &__info {
    flex: 1 1 12rem;
    min-width: 0;
  }

  &__title {
    font-weight: 500;
    line-height: 1.35;
    color: $ink;
  }

  &__time {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__preview {
    @include flex(row, center, center, 0.5rem);
    flex: 0 0 auto;
    min-height: 44px;
    padding-inline: 1rem;
    border: 1px solid $accent;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $accent;
    @include transition;

    &:hover {
      background: $accent;
      color: $surface;
    }
  }

  &__lock {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    font-size: 0.85rem;
    color: $ink-muted;
  }
}
</style>
