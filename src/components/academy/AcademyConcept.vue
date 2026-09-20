<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'

const concept = site.academy.concept
</script>

<template>
  <section class="concept">
    <div class="concept__media" aria-hidden="true">
      <img :src="site.photos.studio" alt="" loading="lazy" decoding="async" />
    </div>
    <div class="concept__inner">
      <h2 v-reveal class="concept__title">{{ concept.title }}</h2>
      <p v-reveal="120" class="concept__text">{{ concept.text }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.concept {
  position: relative;
  overflow: hidden;
  background: $wine;
  color: $on-dark;

  &__media {
    position: absolute;
    inset: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba($wine, 0.7), rgba($wine, 0.94));

      @include from('md') {
        background: linear-gradient(
          90deg,
          rgba($wine, 0.97) 0%,
          rgba($accent-deep, 0.8) 45%,
          rgba($accent-deep, 0.2) 100%
        );
      }
    }
  }

  &__inner {
    @include container;
    @include flex(column, flex-start, center, 1.75rem);
    position: relative;
    min-height: 28rem;
    padding-block: $space-section;

    @include from('md') {
      min-height: 36rem;
    }
  }

  &__title {
    @include display($display-lg);
    max-width: 10em;
  }

  &__text {
    font-size: $text-xl;
    font-weight: 300;
    line-height: 1.45;
    color: rgba($on-dark, 0.9);
    max-width: 34rem;
  }
}
</style>
