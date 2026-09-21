<script setup lang="ts">
// Esqueleto común de los formularios de acceso: campos, error general y botón.
defineProps<{
  error?: string
  loading?: boolean
  /** Bloquea el envío sin mostrarlo como "cargando" (p. ej. la espera entre reenvíos). */
  disabled?: boolean
  submitLabel: string
  loadingLabel?: string
}>()

defineEmits<{ submit: [] }>()
</script>

<template>
  <form class="auth-form" novalidate @submit.prevent="$emit('submit')">
    <slot />

    <Transition name="rise">
      <p v-if="error" class="auth-form__error" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i> <span>{{ error }}</span>
      </p>
    </Transition>

    <button class="btn btn--primary btn--block" type="submit" :disabled="loading || disabled">
      <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
      {{ loading ? loadingLabel || 'Enviando…' : submitLabel }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.auth-form {
  @include flex(column, stretch, flex-start, 1.1rem);
  width: 100%;

  &__error {
    @include flex(row, flex-start, flex-start, 0.55rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;

    i {
      margin-top: 0.25rem;
    }
  }
}
</style>
