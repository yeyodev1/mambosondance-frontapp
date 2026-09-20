<script setup lang="ts">
import { site } from '@/config/site'

// Dos paneles en desktop (foto con velo vino + frase | formulario); en móvil solo
// el formulario con el logo, para que el teclado no tape nada.
defineProps<{
  eyebrow: string
  title: string
  script?: string
  text?: string
  photo?: string
  phrase?: string
}>()
</script>

<template>
  <section class="auth">
    <aside class="auth__visual" aria-hidden="true">
      <img class="auth__photo" :src="photo || site.photos.couple" alt="" />
      <div class="auth__veil"></div>
      <p class="auth__phrase">{{ phrase || site.phrases[0] }}</p>
    </aside>

    <div class="auth__panel">
      <div class="auth__inner">
        <RouterLink class="auth__logo" to="/" :aria-label="site.name">
          <img :src="site.logos.iso" :alt="site.name" />
        </RouterLink>

        <p class="auth__eyebrow">{{ eyebrow }}</p>
        <h1 class="auth__title">
          {{ title }} <span v-if="script" class="auth__script">{{ script }}</span>
        </h1>
        <p v-if="text" class="auth__text">{{ text }}</p>

        <slot />

        <div class="auth__links">
          <slot name="links" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.auth {
  @include flex(column, stretch);
  flex: 1;
  width: 100%;

  @include from('md') {
    flex-direction: row;
    min-height: 720px;
  }

  &__visual {
    display: none;

    @include from('md') {
      @include flex(column, flex-start, flex-end);
      position: relative;
      flex: 1 1 46%;
      padding: $space-lg;
      overflow: hidden;
      background: $wine;
      color: $on-dark;
    }
  }

  &__photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba($wine, 0.55) 0%, rgba($night, 0.88) 100%);
  }

  &__phrase {
    position: relative;
    @include display($display-sm, 600);
    max-width: 16ch;
  }

  &__panel {
    @include flex(column, center, center);
    flex: 1 1 54%;
    padding: $space-lg 1.25rem $space-xl;

    @include from('md') {
      padding: $space-xl 2rem;
    }
  }

  &__inner {
    @include flex(column, stretch, flex-start, 0.5rem);
    width: 100%;
    max-width: 420px;
  }

  &__logo {
    align-self: flex-start;
    margin-bottom: $space-md;

    // El header ya trae el logotipo completo: acá va solo el isotipo, como firma.
    img {
      height: 40px;
      width: auto;
    }

    @include from('md') {
      display: none;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
  }

  &__script {
    @include script($display-sm);
    color: $accent;
  }

  &__text {
    color: $ink-soft;
    margin-bottom: $space-sm;
  }

  &__links {
    @include flex(column, flex-start, flex-start, 0.35rem);
    margin-top: $space-md;
    padding-top: $space-md;
    border-top: 1px solid $line;
    font-size: $text-sm;
    color: $ink-soft;

    &:empty {
      display: none;
    }

    :deep(a) {
      // Área táctil cómoda sin agrandar el texto.
      display: inline-block;
      padding-block: 0.55rem;
      font-weight: 700;
      color: $accent;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
