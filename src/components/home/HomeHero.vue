<script setup lang="ts">
import { site } from '@/config/site'

const hero = site.home.hero
</script>

<template>
  <section class="hero">
    <div class="hero__media" aria-hidden="true">
      <img :src="site.photos.hero" alt="" fetchpriority="high" decoding="async" />
    </div>

    <div class="hero__inner">
      <p class="hero__eyebrow">{{ hero.eyebrow }}</p>
      <h1 class="hero__title">
        <span>{{ hero.title }}</span>
        <span class="hero__script">{{ hero.script }}</span>
      </h1>
      <p class="hero__text">{{ hero.text }}</p>
      <div class="hero__actions">
        <RouterLink :to="hero.primaryCta.to" class="btn btn--primary">
          {{ hero.primaryCta.label }}
        </RouterLink>
        <RouterLink :to="hero.secondaryCta.to" class="btn btn--outline-light">
          {{ hero.secondaryCta.label }}
        </RouterLink>
      </div>
    </div>

    <p class="hero__side" aria-hidden="true">{{ site.tagline }}</p>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  display: flex;
  min-height: 100vh;
  min-height: 100svh;
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
      object-position: 62% center;
      animation: hero-drift 18s $ease both;
    }

    // Velo del manual: vino denso donde va el texto, foto limpia al otro lado.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba($night, 0.55) 0%,
        rgba($wine, 0.35) 30%,
        rgba($wine, 0.88) 68%,
        $night 100%
      );

      @include from('md') {
        background:
          linear-gradient(0deg, rgba($night, 0.7) 0%, transparent 35%),
          linear-gradient(
            90deg,
            rgba($wine, 0.96) 0%,
            rgba($accent-deep, 0.78) 36%,
            rgba($accent-deep, 0.25) 64%,
            transparent 100%
          );
      }
    }
  }

  &__inner {
    @include container(1320px);
    @include flex(column, flex-start, flex-end, 1.4rem);
    position: relative;
    padding-block: 7rem 3.5rem;

    @include from('md') {
      justify-content: center;
      padding-block: 9rem 6rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.75rem);
    color: $on-dark;
    animation: hero-rise 1s $ease 0.1s both;

    &::before {
      content: '';
      width: 2rem;
      height: 1px;
      background: $accent;
    }
  }

  &__title {
    @include display($display-lg);
    @include flex(column, flex-start);
    max-width: 11em;
    animation: hero-rise 1.1s $ease 0.2s both;
  }

  &__script {
    @include script($display-lg);
    display: block;
    margin-top: -0.12em;
    padding-left: 0.3em;
    color: $on-dark;
    transform: rotate(-4deg);
    transform-origin: left bottom;
  }

  &__text {
    font-size: $text-lg;
    font-weight: 300;
    line-height: 1.6;
    color: rgba($on-dark, 0.86);
    max-width: 34rem;
    animation: hero-rise 1.1s $ease 0.35s both;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);
    width: 100%;
    margin-top: 0.6rem;
    animation: hero-rise 1.1s $ease 0.5s both;

    @include from('sm') {
      flex-direction: row;
      width: auto;
    }
  }

  // El concepto de marca, en vertical, como en el lomo de una revista.
  &__side {
    display: none;

    @include from('lg') {
      display: block;
      position: absolute;
      right: 2rem;
      bottom: 6rem;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: $text-xs;
      font-weight: 500;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: $on-dark-soft;
    }
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(26px);
  }
}

@keyframes hero-drift {
  from {
    transform: scale(1.08);
  }
}
</style>
