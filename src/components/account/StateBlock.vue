<script setup lang="ts">
// Carga, error y vacío con la misma voz en todo el área del alumno y el checkout.
defineProps<{
  kind: 'loading' | 'error' | 'empty'
  title?: string
  text?: string
  icon?: string
}>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="state" :class="`state--${kind}`" :role="kind === 'error' ? 'alert' : 'status'">
    <i v-if="kind === 'loading'" class="state__icon fa-solid fa-circle-notch fa-spin"></i>
    <i v-else-if="kind === 'error'" class="state__icon fa-solid fa-circle-exclamation"></i>
    <i v-else class="state__icon" :class="icon || 'fa-regular fa-folder-open'"></i>

    <h2 v-if="title" class="state__title">{{ title }}</h2>
    <p class="state__text">{{ text || (kind === 'loading' ? 'Cargando…' : '') }}</p>

    <div class="state__actions">
      <button v-if="kind === 'error'" class="btn btn--ghost" type="button" @click="$emit('retry')">
        Reintentar
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.7rem);
  text-align: center;
  width: 100%;
  padding: $space-lg 1rem;
  border: 1px dashed $line;
  border-radius: $radius-md;

  &--loading {
    border-color: transparent;
  }

  &__icon {
    font-size: 1.6rem;
    color: $accent;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    max-width: 44ch;
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;

    &:empty {
      display: none;
    }
  }
}
</style>
