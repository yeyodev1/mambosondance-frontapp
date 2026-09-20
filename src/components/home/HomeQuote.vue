<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'
</script>

<template>
  <section class="quote">
    <div class="quote__inner">
      <span v-reveal class="quote__mark" aria-hidden="true">“</span>
      <figure v-reveal="120" class="quote__figure">
        <blockquote class="quote__text">{{ site.home.quote.text }}</blockquote>
        <figcaption class="quote__by">
          <img :src="site.logos.iso" alt="" width="40" height="29" />
          {{ site.name }}
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped lang="scss">
.quote {
  background: $paper;

  &__inner {
    @include container(1080px);
    @include flex(column, flex-start, flex-start, 0);
    padding-block: $space-section;

    @include from('md') {
      flex-direction: row;
      gap: 3rem;
    }
  }

  &__mark {
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(7rem, 5rem + 10vw, 14rem);
    line-height: 0.7;
    height: 0.45em;
    color: $accent;
  }

  &__figure {
    @include flex(column, flex-start, flex-start, 2rem);

    @include from('md') {
      // Desplazada respecto a la comilla: composición editorial, no centrada.
      padding-top: 2.5rem;
    }
  }

  &__text {
    font-size: clamp(1.45rem, 1.1rem + 1.9vw, 2.5rem);
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: $ink;
    text-wrap: balance;
  }

  &__by {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.75rem);
    color: $ink-soft;

    img {
      width: 40px;
      height: auto;
    }
  }
}
</style>
