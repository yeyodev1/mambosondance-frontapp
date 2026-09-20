<script setup lang="ts">
import SectionHeading from './SectionHeading.vue'

// Cabecera de las páginas interiores: continúa el negro del header y deja la
// foto a sangre a la derecha, con el velo vino donde va el texto.
defineProps<{
  eyebrow?: string
  title: string
  script?: string
  text?: string
  image?: string
}>()
</script>

<template>
  <section class="page-hero">
    <div v-if="image" class="page-hero__media" aria-hidden="true">
      <img :src="image" alt="" loading="eager" decoding="async" />
    </div>
    <div class="page-hero__inner">
      <SectionHeading
        as="h1"
        tone="wine"
        :eyebrow="eyebrow"
        :title="title"
        :script="script"
        :text="text"
      />
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-hero {
  position: relative;
  overflow: hidden;
  background: $night;
  color: $on-dark;

  &__media {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba($night, 0.78) 0%, rgba($wine, 0.9) 100%);

      @include from('md') {
        background: linear-gradient(
          90deg,
          $night 0%,
          rgba($wine, 0.94) 38%,
          rgba($accent-deep, 0.55) 68%,
          rgba($accent-deep, 0.15) 100%
        );
      }
    }
  }

  &__inner {
    @include container;
    @include flex(column, flex-start, flex-end, 1.75rem);
    position: relative;
    min-height: 19rem;
    padding-block: 3.5rem 3rem;

    @include from('md') {
      min-height: 26rem;
      padding-block: 5.5rem 4.5rem;
    }
  }
}
</style>
