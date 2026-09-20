<script setup lang="ts">
import { ref } from 'vue'

// Campo + botón en una línea: crear un módulo, una lección, o renombrar.
const props = defineProps<{
  label: string
  button: string
  placeholder?: string
  initial?: string
  busy?: boolean
  cancellable?: boolean
}>()

const emit = defineEmits<{ submit: [value: string]; cancel: [] }>()

const text = ref(props.initial ?? '')

function submit() {
  const value = text.value.trim()
  if (!value || props.busy) return
  emit('submit', value)
  // Al crear se limpia para seguir agregando; al renombrar el padre cierra el campo.
  if (!props.cancellable) text.value = ''
}
</script>

<template>
  <form class="inline-add" @submit.prevent="submit">
    <input
      v-model="text"
      class="inline-add__input"
      type="text"
      :placeholder="placeholder"
      :aria-label="label"
    />
    <div class="inline-add__buttons">
      <button type="submit" class="adm-action adm-action--primary" :disabled="busy || !text.trim()">
        <i class="fa-solid" :class="cancellable ? 'fa-check' : 'fa-plus'"></i>
        {{ button }}
      </button>
      <button v-if="cancellable" type="button" class="adm-action" @click="emit('cancel')">
        Cancelar
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.inline-add {
  @include flex(column, stretch, flex-start, 0.5rem);

  @include from('sm') {
    flex-direction: row;
    align-items: center;
  }

  &__input {
    flex: 1 1 auto;
    min-height: 46px;
    font-size: 16px;
  }

  &__buttons {
    @include flex(row, center, flex-start, 0.4rem);
    flex: 0 0 auto;
  }
}
</style>
