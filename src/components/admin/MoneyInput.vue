<script setup lang="ts">
import { ref, watch } from 'vue'
import { centsToDollars, dollarsToCents } from '@/composables/admin/money'

// El dueño escribe dólares; hacia afuera el valor SIEMPRE son centavos enteros
// (o null si el campo está vacío o no es un monto válido).
const model = defineModel<number | null>({ required: true })

defineProps<{
  id?: string
  placeholder?: string
  disabled?: boolean
}>()

const text = ref(centsToDollars(model.value))
const invalid = ref(false)

// Si el valor cambia desde afuera (carga del producto), se refleja; si el cambio
// viene de lo que se está escribiendo, no se pisa el texto a medio teclear.
watch(model, (cents) => {
  if (cents !== dollarsToCents(text.value)) text.value = centsToDollars(cents)
})

function onInput() {
  const cents = dollarsToCents(text.value)
  invalid.value = text.value.trim() !== '' && cents === null
  model.value = cents
}

function onBlur() {
  if (model.value !== null) text.value = centsToDollars(model.value)
}
</script>

<template>
  <div class="money" :class="{ 'money--invalid': invalid }">
    <span class="money__sign" aria-hidden="true">$</span>
    <input
      :id="id"
      v-model="text"
      class="money__input"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      :placeholder="placeholder || '0.00'"
      :disabled="disabled"
      :aria-invalid="invalid"
      @input="onInput"
      @blur="onBlur"
    />
    <span v-if="invalid" class="money__hint">Escribe un monto como 19.90</span>
  </div>
</template>

<style scoped lang="scss">
.money {
  position: relative;
  @include flex(column, stretch, flex-start, 0.3rem);

  &__sign {
    position: absolute;
    left: 0.9rem;
    top: 24px;
    transform: translateY(-50%);
    font-weight: 700;
    color: $ink-muted;
    pointer-events: none;
  }

  &__input {
    padding-left: 1.9rem;
    font-variant-numeric: tabular-nums;
  }

  &__hint {
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
  }

  &--invalid .money__input {
    border-color: $danger;
  }
}
</style>
