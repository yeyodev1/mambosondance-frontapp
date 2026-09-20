<script setup lang="ts">
import { studentCopy } from '@/config/student'
import { formatDuration } from '@/utils/format'
import type { CourseModule, Lesson } from '@/types'

defineProps<{ modules: CourseModule[]; currentId?: string; completed: number; total: number }>()
defineEmits<{ select: [lesson: Lesson] }>()

const isReady = (lesson: Lesson) => lesson.videoStatus === 'ready'
</script>

<template>
  <nav class="lessons" aria-label="Contenido de la clase">
    <header class="lessons__head">
      <h2 class="lessons__heading">Contenido</h2>
      <p class="lessons__count">{{ completed }} de {{ total }} vistas</p>
    </header>

    <section v-for="module in modules" :key="module.id" class="lessons__module">
      <h3 class="lessons__module-title">{{ module.title }}</h3>
      <ol class="lessons__list">
        <li v-for="lesson in module.lessons" :key="lesson.id">
          <button
            class="lessons__item"
            :class="{
              'lessons__item--current': lesson.id === currentId,
              'lessons__item--soon': !isReady(lesson),
            }"
            type="button"
            :disabled="!isReady(lesson)"
            :aria-current="lesson.id === currentId ? 'true' : undefined"
            @click="$emit('select', lesson)"
          >
            <span class="lessons__check" :class="{ 'lessons__check--done': lesson.completed }">
              <i v-if="lesson.completed" class="fa-solid fa-check" aria-hidden="true"></i>
              <i v-else-if="!isReady(lesson)" class="fa-regular fa-clock" aria-hidden="true"></i>
              <i v-else class="fa-solid fa-play" aria-hidden="true"></i>
            </span>
            <span class="lessons__title">
              {{ lesson.title }}
              <span v-if="lesson.completed" class="visually-hidden">(vista)</span>
            </span>
            <span class="lessons__meta">
              {{
                isReady(lesson)
                  ? lesson.durationSeconds
                    ? formatDuration(lesson.durationSeconds)
                    : ''
                  : studentCopy.player.soon
              }}
            </span>
          </button>
        </li>
      </ol>
    </section>
  </nav>
</template>

<style scoped lang="scss">
.lessons {
  @include flex(column, stretch, flex-start, 1.2rem);
  min-width: 0;

  &__head {
    @include flex(row, baseline, space-between, 1rem);
  }

  &__heading {
    @include display($text-lg, 600);
  }

  &__count {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__module-title {
    @include eyebrow;
    color: $ink-muted;
    margin-bottom: 0.4rem;
  }

  &__list {
    list-style: none;
    border-top: 1px solid $line;
  }

  &__item {
    @include flex(row, center, flex-start, 0.75rem);
    width: 100%;
    min-height: 52px;
    padding: 0.6rem 0.5rem;
    text-align: left;
    border-bottom: 1px solid $line;
    @include transition(background-color);

    &:hover:not(:disabled) {
      background: $sand;
    }

    &--current {
      background: $sand;
      box-shadow: inset 3px 0 0 $accent;
    }

    &--soon {
      cursor: default;
      color: $ink-muted;
    }
  }

  &__check {
    @include flex(row, center, center);
    flex: 0 0 26px;
    height: 26px;
    font-size: 0.65rem;
    color: $ink-soft;
    border: 1.5px solid $line;
    border-radius: 50%;

    &--done {
      color: $surface;
      background: $accent;
      border-color: $accent;
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
    white-space: nowrap;
  }
}
</style>
