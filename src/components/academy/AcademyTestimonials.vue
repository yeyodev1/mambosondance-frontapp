<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const testimonials = site.academy.testimonials
</script>

<template>
  <section id="testimonios" class="testimonials">
    <div class="testimonials__inner">
      <SectionHeading
        v-reveal
        tone="night"
        :eyebrow="testimonials.eyebrow"
        :title="testimonials.title"
        :script="testimonials.script"
        :text="testimonials.text"
      />

      <!-- Reel vertical: es el formato en que la comunidad graba sus testimonios. -->
      <div v-reveal="120" class="testimonials__reel">
        <video
          v-if="testimonials.videoUrl"
          :src="testimonials.videoUrl"
          :poster="site.photos.community"
          controls
          playsinline
          preload="metadata"
        ></video>
        <img v-else :src="site.photos.community" alt="" loading="lazy" decoding="async" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.testimonials {
  // El header es fijo: el enlace del inicio no debe dejar el título debajo.
  scroll-margin-top: 5rem;
  background: $night;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 5rem;
    }
  }

  &__reel {
    position: relative;
    width: 100%;
    max-width: 22rem;
    aspect-ratio: 9 / 16;
    align-self: center;
    overflow: hidden;
    background: $wine;

    @include from('md') {
      flex: 0 0 22rem;
    }

    video,
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
