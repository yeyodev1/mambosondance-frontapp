<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import type { Lesson } from '@/types'

const props = defineProps<{
  lesson: Lesson | null
  embedUrl: string
  loading: boolean
  error: string
}>()

const emit = defineEmits<{ close: []; retry: [] }>()

const open = computed(() => props.lesson !== null)
useBodyScroll(open)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="lesson" class="preview" @click.self="emit('close')">
        <div class="preview__box" role="dialog" aria-modal="true" :aria-label="lesson.title">
          <header class="preview__head">
            <div>
              <p class="preview__eyebrow">Vista previa gratis</p>
              <h2 class="preview__title">{{ lesson.title }}</h2>
            </div>
            <button type="button" class="preview__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <div class="preview__stage">
            <iframe
              v-if="embedUrl"
              class="preview__frame"
              :src="embedUrl"
              :title="lesson.title"
              allow="
                accelerometer;
                gyroscope;
                autoplay;
                encrypted-media;
                picture-in-picture;
                fullscreen;
              "
              allowfullscreen
            ></iframe>
            <div v-else-if="error" class="preview__state">
              <p>{{ error }}</p>
              <button type="button" class="btn btn--outline-light" @click="emit('retry')">
                Reintentar
              </button>
            </div>
            <div v-else class="preview__state" aria-busy="true">
              <i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
              <span class="visually-hidden">Cargando video…</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.preview {
  @include flex(row, center, center);
  position: fixed;
  inset: 0;
  z-index: 200;
  padding: 1rem;
  background: rgba($night, 0.9);

  &__box {
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 60rem;
    color: $on-dark;
  }

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__eyebrow {
    @include eyebrow;
    color: $on-dark-soft;
    margin-bottom: 0.4rem;
  }

  &__title {
    @include display($text-xl);
  }

  &__close {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border: 1px solid $line-dark;
    border-radius: 50%;
    font-size: 1.1rem;
    @include transition;

    &:hover {
      background: $on-dark;
      color: $night;
    }
  }

  &__stage {
    position: relative;
    aspect-ratio: 16 / 9;
    background: $wine;
  }

  &__frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  &__state {
    @include flex(column, center, center, 1rem);
    position: absolute;
    inset: 0;
    padding: 1.5rem;
    text-align: center;
    font-size: 1.6rem;

    p {
      font-size: $text-base;
      color: $on-dark-soft;
    }
  }
}
</style>
