<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <section class="not-found">
    <div class="not-found__media" aria-hidden="true">
      <img :src="site.photos.expression" alt="" decoding="async" />
    </div>

    <div class="not-found__inner">
      <p class="not-found__code" aria-hidden="true">404</p>
      <h1 class="not-found__title">Esta página no existe</h1>
      <p class="not-found__text">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>
      <div class="not-found__actions">
        <RouterLink to="/" class="btn btn--light">Volver al inicio</RouterLink>
        <RouterLink :to="site.home.online.cta.to" class="btn btn--outline-light">
          {{ site.home.online.cta.label }}
        </RouterLink>
      </div>
      <p class="not-found__tagline">{{ site.tagline }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 80vh;
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
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        120deg,
        $night 0%,
        rgba($wine, 0.92) 50%,
        rgba($accent-deep, 0.6) 100%
      );
    }
  }

  &__inner {
    @include container;
    @include flex(column, flex-start, center, 1.1rem);
    position: relative;
    padding-block: $space-xl;
  }

  // El número como trazo, no como bloque: presencia sin gritar.
  &__code {
    @include display(clamp(7rem, 4rem + 22vw, 20rem));
    line-height: 0.8;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba($on-dark, 0.55);
  }

  &__title {
    @include display($display-md);
  }

  &__text {
    font-size: $text-lg;
    font-weight: 300;
    color: $on-dark-soft;
    max-width: 32rem;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);
    width: 100%;
    margin-top: 0.75rem;

    @include from('sm') {
      flex-direction: row;
      width: auto;
    }
  }

  &__tagline {
    @include script($text-xl);
    margin-top: 2rem;
    color: $on-dark;
    transform: rotate(-4deg);
    transform-origin: left;
  }
}
</style>
