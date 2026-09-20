<script setup lang="ts">
// Los tres estados que toda vista del panel debe cubrir: cargando, error con
// reintentar y vacío con una acción para empezar. Si no aplica ninguno, pinta el slot.
defineProps<{
  loading?: boolean
  error?: string
  empty?: boolean
  emptyIcon?: string
  emptyTitle?: string
  emptyText?: string
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="state" aria-live="polite">
    <i class="fa-solid fa-circle-notch fa-spin state__icon"></i>
    <p class="state__text">Cargando…</p>
  </div>

  <div v-else-if="error" class="state state--error" role="alert">
    <i class="fa-solid fa-triangle-exclamation state__icon"></i>
    <p class="state__title">No se pudo cargar</p>
    <p class="state__text">{{ error }}</p>
    <button type="button" class="btn btn--ghost" @click="emit('retry')">
      <i class="fa-solid fa-rotate-right"></i>
      Reintentar
    </button>
  </div>

  <div v-else-if="empty" class="state">
    <i :class="emptyIcon || 'fa-regular fa-folder-open'" class="state__icon"></i>
    <p class="state__title">{{ emptyTitle || 'Todavía no hay nada aquí' }}</p>
    <p v-if="emptyText" class="state__text">{{ emptyText }}</p>
    <slot name="empty-action" />
  </div>

  <slot v-else />
</template>

<style scoped lang="scss">
.state {
  @include flex(column, center, center, 0.6rem);
  text-align: center;
  padding: 2.5rem 1.25rem;
  border: 1px dashed $line;
  border-radius: $radius-md;
  background: $surface;

  &__icon {
    font-size: 1.8rem;
    color: $ink-muted;
  }

  &__title {
    font-weight: 700;
    color: $ink;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 42ch;
  }

  &--error {
    border-color: rgba($danger, 0.35);
    background: $danger-bg;

    .state__icon {
      color: $danger;
    }
  }
}
</style>
