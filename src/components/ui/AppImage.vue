<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { site } from '@/config/site'
import { optimized } from '@/utils/image'

const props = withDefaults(
  defineProps<{
    src?: string | null
    alt?: string
    /** Proporción CSS: "4/5", "16/9"… Reserva el espacio y evita saltos al cargar. */
    ratio?: string
    width?: number
    eager?: boolean
    fit?: 'cover' | 'contain'
  }>(),
  { src: '', alt: '', ratio: '4/5', width: 900, eager: false, fit: 'cover' },
)

const failed = ref(false)
const loaded = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
    loaded.value = false
  },
)

const url = computed(() => (failed.value ? '' : optimized(props.src, props.width)))
</script>

<template>
  <div class="app-image" :style="{ aspectRatio: ratio }">
    <img
      v-if="url"
      class="app-image__img"
      :class="{ 'app-image__img--ready': loaded, 'app-image__img--contain': fit === 'contain' }"
      :src="url"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @load="loaded = true"
      @error="failed = true"
    />
    <div v-else class="app-image__fallback" role="img" :aria-label="alt || site.name">
      <img :src="site.logos.isoWhite" alt="" width="72" height="53" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: $wine;

  &__img,
  &__fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__img {
    object-fit: cover;
    opacity: 0;
    transition:
      opacity 0.6s ease,
      transform 1.1s $ease;

    &--ready {
      opacity: 1;
    }

    &--contain {
      object-fit: contain;
    }
  }

  // Sin foto: vino de marca con el isotipo, nunca un recuadro gris roto.
  &__fallback {
    @include flex(row, center, center);
    background:
      radial-gradient(circle at 30% 20%, rgba($accent-deep, 0.75), transparent 60%), $wine;

    img {
      width: 28%;
      max-width: 96px;
      min-width: 40px;
      height: auto;
      opacity: 0.55;
    }
  }
}
</style>
