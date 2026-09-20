<script setup lang="ts">
export interface ChipOption {
  value: string
  label: string
}

defineProps<{
  options: ChipOption[]
  label: string
  tone?: 'light' | 'dark'
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="chips" :class="{ 'chips--dark': tone === 'dark' }" role="group" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="chips__item"
      :class="{ 'chips__item--active': model === option.value }"
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
// En el celular la fila se desliza dentro de su caja: nunca empuja el ancho de la página.
.chips {
  @include flex(row, center, flex-start, 0.5rem);
  max-width: 100%;
  overflow-x: auto;
  padding-block: 0.25rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    overflow: visible;
  }

  &__item {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0.55rem 1.15rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $ink-soft;
    white-space: nowrap;
    @include transition;

    &:hover {
      border-color: $ink;
      color: $ink;
    }

    &--active,
    &--active:hover {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &--dark &__item:not(.chips__item--active) {
    border-color: $line-dark;
    color: $on-dark-soft;

    &:hover {
      border-color: $on-dark;
      color: $on-dark;
    }
  }
}
</style>
