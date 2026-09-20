<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'

const [lead, ...rest] = site.academy.manifesto
</script>

<template>
  <section class="manifesto">
    <div class="manifesto__inner">
      <div v-reveal class="manifesto__photo">
        <img :src="site.photos.community" alt="" loading="lazy" decoding="async" />
      </div>

      <div class="manifesto__copy">
        <p v-reveal class="manifesto__lead">{{ lead }}</p>
        <p
          v-for="(paragraph, index) in rest"
          :key="index"
          v-reveal="index * 100"
          class="manifesto__text"
        >
          {{ paragraph }}
        </p>
        <img
          v-reveal
          class="manifesto__mark"
          :src="site.logos.iso"
          alt=""
          width="72"
          height="53"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.manifesto {
  background: $paper;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 5rem;
    }
  }

  &__photo {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    @include from('md') {
      flex: 0 0 42%;
      aspect-ratio: 4 / 5;
      // La foto baja más que el texto: rompe la rejilla a propósito.
      margin-top: 4rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(10deg, rgba($wine, 0.7) 0%, transparent 50%);
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.75rem);
    flex: 1;
  }

  &__lead {
    font-size: clamp(1.45rem, 1.1rem + 1.8vw, 2.4rem);
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: $ink;
    text-wrap: balance;
  }

  &__text {
    font-size: $text-lg;
    font-weight: 300;
    color: $ink-soft;
    max-width: 36rem;
  }

  &__mark {
    width: 72px;
    height: auto;
    margin-top: 1rem;
  }
}
</style>
