<script setup lang="ts">
import { site } from '@/config/site'
import BeatCounter from '@/components/notfound/BeatCounter.vue'
import BrandMarquee from '@/components/ui/BrandMarquee.vue'

const copy = site.notFound
</script>

<template>
  <section class="nf">
    <div class="nf__media" aria-hidden="true">
      <img :src="site.photos.steps" alt="" decoding="async" />
    </div>

    <!-- El número gigante es decoración: el mensaje real está en el h1. -->
    <p class="nf__code" aria-hidden="true">
      <span>4</span><span class="nf__zero"><img :src="site.logos.isoWhite" alt="" /></span
      ><span>4</span>
    </p>

    <div class="nf__inner">
      <div class="nf__copy">
        <p class="nf__eyebrow">{{ copy.eyebrow }}</p>
        <h1 class="nf__title">
          {{ copy.title }}
          <span class="nf__script">{{ copy.script }}</span>
        </h1>
        <p class="nf__text">{{ copy.text }}</p>

        <BeatCounter class="nf__beats" :label="copy.countLabel" :pause-label="copy.pause" />

        <div class="nf__actions">
          <RouterLink :to="copy.primaryCta.to" class="btn btn--light">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            {{ copy.primaryCta.label }}
          </RouterLink>
        </div>
      </div>

      <nav class="nf__links" :aria-label="copy.linksTitle">
        <p class="nf__links-title">{{ copy.linksTitle }}</p>
        <RouterLink v-for="link in copy.links" :key="link.to" :to="link.to" class="nf__link">
          <i class="fa-solid" :class="link.icon" aria-hidden="true"></i>
          <span>{{ link.label }}</span>
          <i class="fa-solid fa-arrow-right nf__link-arrow" aria-hidden="true"></i>
        </RouterLink>
      </nav>
    </div>

    <BrandMarquee class="nf__marquee" :items="site.academy.values" tone="red" />
  </section>
</template>

<style scoped lang="scss">
.nf {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: calc(100vh - 64px);
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
      animation: nf-drift 24s ease-in-out infinite alternate;
    }

    // Velo vino a la izquierda, donde va el texto; la pista asoma a la derecha.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba($night, 0.55) 0%, transparent 35%, rgba($night, 0.9) 100%),
        linear-gradient(100deg, $night 0%, rgba($wine, 0.94) 42%, rgba($accent-deep, 0.55) 100%);
    }
  }

  // 404 de fondo: trazo fino, enorme, cortado por el borde. Presencia sin gritar.
  &__code {
    @include display(clamp(11rem, 2rem + 46vw, 34rem));
    position: absolute;
    right: -0.06em;
    bottom: 0.12em;
    display: flex;
    align-items: center;
    line-height: 0.78;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba($on-dark, 0.1);
    pointer-events: none;
    user-select: none;

    @include from('md') {
      bottom: 0.2em;
      -webkit-text-stroke-width: 2px;
    }
  }

  // El cero es el isotipo MS dentro de un aro: la marca ocupa la pausa.
  &__zero {
    @include flex(row, center, center);
    width: 0.62em;
    height: 0.62em;
    margin-inline: 0.04em;
    border: 1.5px solid rgba($on-dark, 0.1);
    border-radius: 50%;

    img {
      width: 58%;
      opacity: 0.08;
    }
  }

  &__inner {
    @include container;
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    gap: $space-lg;
    padding-block: $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 38rem;
    animation: nf-rise 0.9s $ease both;
  }

  &__eyebrow {
    @include eyebrow;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: $on-dark-soft;

    &::before {
      content: '';
      width: 2rem;
      height: 1px;
      background: $accent;
    }
  }

  &__title {
    @include display($display-lg);
    margin-top: 1.1rem;
  }

  &__script {
    @include script($display-md);
    display: block;
    margin-top: -0.05em;
    white-space: nowrap;
    padding-left: 0.35em;
    color: $accent;
    transform: rotate(-4deg);
    transform-origin: left center;
  }

  &__text {
    max-width: 32rem;
    margin-top: 1.6rem;
    font-size: $text-lg;
    line-height: 1.6;
    color: $on-dark-soft;
  }

  &__beats {
    width: 100%;
    max-width: 27rem;
    margin-top: 2rem;
    padding-bottom: 1.4rem; // aire para el rótulo "Pausa"
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.75rem;
    width: 100%;

    .btn {
      flex: 1 1 100%;

      @include from('sm') {
        flex: 0 0 auto;
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    width: 100%;
    animation: nf-rise 0.9s 0.15s $ease both;

    @include from('lg') {
      flex: 0 0 20rem;
    }
  }

  &__links-title {
    @include eyebrow;
    margin-bottom: 0.5rem;
    color: $on-dark-soft;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    min-height: 56px;
    border-top: 1px solid $line-dark;
    font-weight: 600;
    transition:
      color 0.28s $ease,
      padding 0.28s $ease;

    &:last-child {
      border-bottom: 1px solid $line-dark;
    }

    > i:first-child {
      width: 1.2rem;
      color: $accent;
    }

    &:hover,
    &:focus-visible {
      padding-left: 0.5rem;
      color: $surface;
    }
  }

  &__link-arrow {
    margin-left: auto;
    font-size: 0.8rem;
    opacity: 0.5;
    transition:
      transform 0.28s $ease,
      opacity 0.28s $ease;

    .nf__link:hover & {
      opacity: 1;
      transform: translateX(4px);
    }
  }

  &__marquee {
    position: relative;
  }
}

@keyframes nf-drift {
  from {
    transform: scale(1.04) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.12) translate3d(-1.5%, -1%, 0);
  }
}

@keyframes nf-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
