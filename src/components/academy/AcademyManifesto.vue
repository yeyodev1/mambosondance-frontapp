<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'

const [lead, ...rest] = site.academy.manifesto
</script>

<template>
  <section class="manifesto">
    <div class="manifesto__inner">
      <!-- El texto vive dentro de la foto: la frase y quienes la sostienen, juntos. -->
      <figure v-reveal class="manifesto__photo">
        <img :src="site.photos.founders" alt="" loading="lazy" decoding="async" />
        <figcaption class="manifesto__lead">{{ lead }}</figcaption>
      </figure>

      <div class="manifesto__copy">
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
  background: linear-gradient(180deg, $paper 0%, $sand 100%);

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: $space-section;
  }

  &__photo {
    position: relative;
    display: flex;
    align-items: flex-end;
    min-height: 26rem;
    overflow: hidden;

    @include from('md') {
      min-height: 0;
      aspect-ratio: 16 / 8;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 30%;
    }

    // Velo vino desde abajo para que la frase se lea sobre cualquier foto.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        0deg,
        rgba($wine, 0.95) 0%,
        rgba($wine, 0.6) 40%,
        transparent 75%
      );

      @include from('md') {
        background: linear-gradient(
          90deg,
          rgba($wine, 0.95) 0%,
          rgba($accent-deep, 0.6) 45%,
          transparent 75%
        );
      }
    }
  }

  &__lead {
    position: relative;
    z-index: 1;
    padding: 1.75rem 1.5rem;
    font-size: clamp(1.45rem, 1.1rem + 1.8vw, 2.4rem);
    font-weight: 300;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: $on-dark;
    text-wrap: balance;

    @include from('md') {
      align-self: center;
      max-width: 52%;
      padding: 3rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.5rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3rem;
    }
  }

  &__text {
    flex: 1;
    font-size: $text-lg;
    font-weight: 300;
    color: $ink-soft;
    max-width: 36rem;
  }

  &__mark {
    width: 72px;
    height: auto;
  }
}
</style>
