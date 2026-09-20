<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '@/types'
import { optimized } from '@/utils/image'
import AppImage from '@/components/ui/AppImage.vue'

const props = defineProps<{ product: Product }>()

// La portada primero y sin repetirse si también está en la galería.
const images = computed(() => {
  const all = [props.product.cover, ...props.product.gallery].filter(
    (image): image is NonNullable<typeof image> => Boolean(image?.url),
  )
  return all.filter((image, index) => all.findIndex((other) => other.url === image.url) === index)
})

const current = ref(0)

watch(
  () => props.product.id,
  () => (current.value = 0),
)
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <AppImage :src="images[current]?.url" :alt="product.title" ratio="4/5" :width="1200" eager />
    </div>

    <div
      v-if="images.length > 1"
      class="gallery__thumbs"
      role="group"
      aria-label="Fotos del producto"
    >
      <button
        v-for="(image, index) in images"
        :key="image.url"
        type="button"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': index === current }"
        :aria-label="`Ver foto ${index + 1}`"
        :aria-pressed="index === current"
        @click="current = index"
      >
        <img :src="optimized(image.url, 200)" alt="" loading="lazy" decoding="async" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gallery {
  @include flex(column, stretch, flex-start, 0.75rem);
  min-width: 0;

  @include from('lg') {
    flex-direction: row-reverse;
  }

  &__main {
    flex: 1;
    min-width: 0;
    background: $sand;
  }

  &__thumbs {
    display: flex;
    gap: 0.6rem;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      flex: 0 0 76px;
      flex-direction: column;
      overflow: visible;
    }
  }

  &__thumb {
    flex: 0 0 64px;
    height: 80px;
    overflow: hidden;
    background: $sand;
    opacity: 0.6;
    border-bottom: 2px solid transparent;
    @include transition;

    @include from('lg') {
      flex-basis: auto;
      width: 76px;
      height: 95px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover,
    &--active {
      opacity: 1;
    }

    &--active {
      border-color: $accent;
    }
  }
}
</style>
