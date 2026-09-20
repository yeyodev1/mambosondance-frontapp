<script setup lang="ts">
const props = withDefaults(defineProps<{ min?: number; max?: number; disabled?: boolean }>(), {
  min: 1,
  max: 20,
  disabled: false,
})

const model = defineModel<number>({ required: true })

function step(delta: number) {
  model.value = Math.max(props.min, Math.min(props.max, model.value + delta))
}
</script>

<template>
  <div class="stepper" :class="{ 'stepper--disabled': disabled }">
    <button
      type="button"
      class="stepper__btn"
      aria-label="Quitar uno"
      :disabled="disabled || model <= min"
      @click="step(-1)"
    >
      <i class="fa-solid fa-minus" aria-hidden="true"></i>
    </button>
    <output class="stepper__value" aria-live="polite">{{ model }}</output>
    <button
      type="button"
      class="stepper__btn"
      aria-label="Agregar uno"
      :disabled="disabled || model >= max"
      @click="step(1)"
    >
      <i class="fa-solid fa-plus" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid $line;
  border-radius: $radius-pill;
  background: $surface;

  &__btn {
    @include flex(row, center, center);
    width: 48px;
    height: 48px;
    font-size: 0.8rem;
    color: $ink;
    border-radius: 50%;
    @include transition(color);

    &:hover {
      color: $accent;
    }

    &:disabled {
      color: $ink-muted;
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__value {
    min-width: 2ch;
    text-align: center;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
