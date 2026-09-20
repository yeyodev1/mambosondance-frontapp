<script setup lang="ts">
defineProps<{
  title?: string
  hint?: string
  icon?: string
}>()
</script>

<template>
  <section class="admin-card">
    <header v-if="title || $slots.actions" class="admin-card__head">
      <div class="admin-card__heading">
        <h2 v-if="title" class="admin-card__title">
          <i v-if="icon" :class="icon" class="admin-card__icon"></i>
          {{ title }}
        </h2>
        <p v-if="hint" class="admin-card__hint">{{ hint }}</p>
      </div>
      <div v-if="$slots.actions" class="admin-card__actions">
        <slot name="actions" />
      </div>
    </header>
    <slot />
  </section>
</template>

<style scoped lang="scss">
.admin-card {
  @include card;
  @include flex(column, stretch, flex-start, 1.1rem);
  padding: 1.1rem;
  min-width: 0;

  @include from('md') {
    padding: 1.5rem;
  }

  &__head {
    @include flex(row, flex-start, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__heading {
    @include flex(column, flex-start, flex-start, 0.25rem);
    min-width: 0;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-lg;
    font-weight: 700;
    line-height: 1.25;
    text-transform: none;
    color: $ink;
  }

  &__icon {
    color: $accent;
    margin-right: 0.35rem;
    font-size: 0.9em;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.4rem);
    flex-wrap: wrap;
  }
}
</style>
