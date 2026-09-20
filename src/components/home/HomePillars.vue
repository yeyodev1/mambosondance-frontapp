<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const cta = site.home.hero.secondaryCta
</script>

<template>
  <section class="pillars">
    <div class="pillars__inner">
      <div class="pillars__aside">
        <SectionHeading
          v-reveal
          tone="night"
          :eyebrow="site.academy.eyebrow"
          :title="site.academy.title"
          :script="site.academy.script"
        />
        <div v-reveal="120" class="pillars__photo">
          <img :src="site.photos.couple" alt="" loading="lazy" decoding="async" />
        </div>
      </div>

      <div class="pillars__list">
        <article
          v-for="(pillar, index) in site.home.pillars"
          :key="pillar.key"
          v-reveal="index * 100"
          class="pillars__item"
        >
          <p class="pillars__key">
            <span class="pillars__index">0{{ index + 1 }}</span>
            <span class="pillars__word">{{ pillar.key }}</span>
          </p>
          <div class="pillars__copy">
            <h3 class="pillars__title">{{ pillar.title }}</h3>
            <p class="pillars__text">{{ pillar.text }}</p>
          </div>
        </article>

        <RouterLink v-reveal :to="cta.to" class="btn btn--outline-light pillars__cta">
          {{ cta.label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pillars {
  background: $night;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: $space-section;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 5rem;
    }
  }

  &__aside {
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('lg') {
      flex: 0 0 40%;
      position: sticky;
      top: 7rem;
    }
  }

  &__photo {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    @include from('lg') {
      aspect-ratio: 4 / 5;
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
      background: linear-gradient(200deg, transparent 40%, rgba($wine, 0.8) 100%);
    }
  }

  &__list {
    @include flex(column, stretch);
    flex: 1;
  }

  &__item {
    @include flex(column, flex-start, flex-start, 1rem);
    padding-block: 2.25rem;
    border-top: 1px solid $line-dark;

    @include from('md') {
      flex-direction: row;
      gap: 2.5rem;
      padding-block: 3rem;
    }
  }

  &__key {
    @include flex(row, baseline, flex-start, 1rem);

    white-space: nowrap;

    @include from('md') {
      flex: 0 0 11.5rem;
    }
  }

  &__index {
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: $on-dark-soft;
  }

  &__word {
    @include script($display-sm);
    display: inline-block;
    color: $accent;
    transform: rotate(-4deg);
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.8rem);
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    font-weight: 300;
    color: $on-dark-soft;
    max-width: 36rem;
  }

  &__cta {
    align-self: flex-start;
    margin-top: 1rem;
  }
}
</style>
