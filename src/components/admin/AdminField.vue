<script setup lang="ts">
defineProps<{
  label: string
  /** id del control, para que tocar la etiqueta lo enfoque. */
  for?: string
  help?: string
  error?: string
  required?: boolean
}>()
</script>

<template>
  <div class="field">
    <label class="field__label" :for="$props.for">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
    </label>
    <slot />
    <p v-if="error" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation"></i>
      {{ error }}
    </p>
    <p v-else-if="help" class="field__help">{{ help }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0.3rem);
  min-width: 0;

  &__label {
    margin: 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__required {
    color: $accent;
  }

  &__help {
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.45;
  }

  &__error {
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
  }

  // 16 px evita que iOS haga zoom al enfocar el campo.
  :deep(input),
  :deep(select),
  :deep(textarea) {
    font-size: 16px;
    min-height: 48px;
  }

  :deep(textarea) {
    min-height: 110px;
    resize: vertical;
    line-height: 1.5;
  }
}
</style>
