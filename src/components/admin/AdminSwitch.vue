<script setup lang="ts">
const model = defineModel<boolean>({ required: true })

defineProps<{
  label: string
  help?: string
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="switch"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    @click="model = !model"
  >
    <span class="switch__text">
      <span class="switch__label">{{ label }}</span>
      <span v-if="help" class="switch__help">{{ help }}</span>
    </span>
    <span class="switch__track" :class="{ 'switch__track--on': model }">
      <span class="switch__thumb"></span>
    </span>
  </button>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, space-between, 1rem);
  width: 100%;
  min-height: 52px;
  padding: 0.7rem 0.95rem;
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: $surface;
  text-align: left;

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.1rem);
    min-width: 0;
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__help {
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.4;
  }

  &__track {
    flex: 0 0 auto;
    width: 46px;
    height: 28px;
    padding: 3px;
    border-radius: $radius-pill;
    background: $line;
    @include flex(row, center, flex-start);
    @include transition(background-color);

    &--on {
      background: $success;

      .switch__thumb {
        transform: translateX(18px);
      }
    }
  }

  &__thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include transition(transform);
  }
}
</style>
