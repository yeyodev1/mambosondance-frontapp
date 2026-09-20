<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  subtitle?: string
  /** Si viene, muestra un enlace "volver" arriba del título. */
  back?: RouteLocationRaw
  backLabel?: string
}>()
</script>

<template>
  <header class="page-header">
    <RouterLink v-if="back" :to="back" class="page-header__back">
      <i class="fa-solid fa-arrow-left"></i>
      {{ backLabel || 'Volver' }}
    </RouterLink>
    <div class="page-header__row">
      <div class="page-header__text">
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="page-header__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.default" class="page-header__actions">
        <slot />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-header {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__back {
    @include flex(row, center, flex-start, 0.45rem);
    align-self: flex-start;
    min-height: 40px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    &:hover {
      color: $accent;
    }
  }

  &__row {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.45rem);
    min-width: 0;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
    overflow-wrap: anywhere;
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 60ch;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.5rem);

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
    }

    @include from('md') {
      flex: 0 0 auto;
      justify-content: flex-end;
    }
  }
}
</style>
