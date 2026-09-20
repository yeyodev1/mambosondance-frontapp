<script setup lang="ts">
import AppImage from '@/components/ui/AppImage.vue'

// Cabecera compartida por los detalles de clase y de evento: portada tipo
// afiche a un lado, y a quien la usa le toca llenar el texto por slots.
defineProps<{
  image?: string | null
  alt: string
  eyebrow?: string
  title: string
  backTo: string
  backLabel: string
  ratio?: string
}>()
</script>

<template>
  <section class="detail-hero">
    <div class="detail-hero__inner">
      <div class="detail-hero__copy">
        <RouterLink :to="backTo" class="detail-hero__back">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ backLabel }}
        </RouterLink>
        <p v-if="eyebrow" class="detail-hero__eyebrow">{{ eyebrow }}</p>
        <h1 class="detail-hero__title">{{ title }}</h1>
        <slot />
      </div>

      <div class="detail-hero__media">
        <AppImage :src="image" :alt="alt" :ratio="ratio || '4/5'" :width="1100" eager />
        <slot name="media" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.detail-hero {
  background: radial-gradient(circle at 90% 10%, rgba($accent-deep, 0.6), transparent 55%), $night;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column-reverse, stretch, flex-start, 2rem);
    padding-block: 1.5rem 3rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding-block: 3rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.1rem);
    flex: 1;
    min-width: 0;
  }

  &__back {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 44px;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $on-dark-soft;
    @include transition(color);

    &:hover {
      color: $on-dark;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $on-dark;
    padding: 0.4rem 0.8rem;
    background: $accent;
  }

  &__title {
    @include display($display-md);
    overflow-wrap: anywhere;
  }

  &__media {
    position: relative;
    overflow: hidden;

    @include from('md') {
      flex: 0 0 34%;
      // El afiche sobresale por debajo del bloque oscuro.
      margin-bottom: -6rem;
      box-shadow: 0 40px 80px rgba($night, 0.5);
    }
  }
}
</style>
