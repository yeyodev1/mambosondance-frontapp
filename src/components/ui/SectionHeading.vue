<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    /** La palabra manuscrita que remata el título: el gesto de la marca. */
    script?: string
    text?: string
    tone?: 'light' | 'night' | 'wine' | 'red'
    size?: 'md' | 'lg'
    as?: 'h1' | 'h2' | 'h3'
    align?: 'left' | 'center'
  }>(),
  { tone: 'light', size: 'md', as: 'h2', align: 'left' },
)
</script>

<template>
  <header class="heading" :class="[`heading--${tone}`, `heading--${size}`, `heading--${align}`]">
    <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
    <component :is="as" class="heading__title">
      <span class="heading__words">{{ title }}</span>
      <span v-if="script" class="heading__script">{{ script }}</span>
    </component>
    <p v-if="text" class="heading__text">{{ text }}</p>
  </header>
</template>

<style scoped lang="scss">
.heading {
  @include flex(column, flex-start, flex-start, 1.1rem);
  max-width: 44rem;

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.75rem);

    &::before {
      content: '';
      width: 2rem;
      height: 1px;
      background: $accent;
    }
  }

  &__title {
    @include display($display-md);
    @include flex(column, flex-start);
    color: $ink;
  }

  &__script {
    @include script($display-md);
    display: block;
    color: $accent;
    // Roza la última línea del título, como en el manual de marca, sin taparla.
    margin-top: 0.02em;
    padding-left: 0.35em;
    transform: rotate(-4deg);
    transform-origin: left bottom;
  }

  &__text {
    font-size: $text-lg;
    font-weight: 300;
    line-height: 1.6;
    color: $ink-soft;
    max-width: 38rem;
  }

  &--lg &__title {
    font-size: $display-lg;
  }

  &--lg &__script {
    font-size: calc(#{$display-lg} * 1.2);
  }

  &--center {
    align-items: center;
    text-align: center;
    margin-inline: auto;

    .heading__title {
      align-items: center;
    }

    .heading__script {
      padding-left: 0;
      transform-origin: center;
    }
  }

  // Sobre fondos oscuros el eyebrow rojo pierde contraste: pasa a claro.
  &--night,
  &--wine,
  &--red {
    .heading__eyebrow {
      color: $on-dark-soft;
    }

    .heading__title {
      color: $on-dark;
    }

    .heading__text {
      color: $on-dark-soft;
    }
  }

  &--wine,
  &--red {
    .heading__script {
      color: $on-dark;
    }
  }

  &--red {
    .heading__eyebrow {
      color: $on-dark;

      &::before {
        background: $on-dark;
      }
    }

    .heading__text {
      color: rgba($on-dark, 0.88);
    }
  }
}
</style>
