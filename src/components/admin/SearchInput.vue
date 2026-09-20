<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

// Hacia afuera el valor cambia con un respiro, para no pedirle al API en cada tecla.
const model = defineModel<string>({ required: true })

const props = withDefaults(defineProps<{ placeholder?: string; delay?: number }>(), {
  placeholder: 'Buscar…',
  delay: 350,
})

const text = ref(model.value)
let timer: ReturnType<typeof setTimeout> | undefined

watch(text, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => (model.value = value.trim()), props.delay)
})

watch(model, (value) => {
  if (value !== text.value.trim()) text.value = value
})

function clear() {
  clearTimeout(timer)
  text.value = ''
  model.value = ''
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="search">
    <i class="fa-solid fa-magnifying-glass search__icon"></i>
    <input
      v-model="text"
      class="search__input"
      type="search"
      enterkeyhint="search"
      :placeholder="placeholder"
      :aria-label="placeholder"
    />
    <button v-if="text" type="button" class="search__clear" aria-label="Limpiar" @click="clear">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  @include flex(row, center);

  &__icon {
    position: absolute;
    left: 0.95rem;
    color: $ink-muted;
    pointer-events: none;
  }

  &__input {
    min-height: 48px;
    padding-left: 2.6rem;
    padding-right: 2.8rem;
    font-size: 16px;
    border-radius: $radius-pill;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__clear {
    position: absolute;
    right: 0.25rem;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: $ink-soft;
  }
}
</style>
