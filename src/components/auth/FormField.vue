<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  id: string
  label: string
  type?: string
  error?: string
  hint?: string
  autocomplete?: string
  inputmode?: 'text' | 'numeric' | 'tel' | 'email'
  placeholder?: string
  required?: boolean
  maxlength?: number
  textarea?: boolean
  optional?: boolean
}>()

const model = defineModel<string>({ required: true })

const revealed = ref(false)
const isPassword = computed(() => props.type === 'password')
const inputType = computed(() =>
  isPassword.value && revealed.value ? 'text' : props.type || 'text',
)
const describedBy = computed(() =>
  props.error ? `${props.id}-error` : props.hint ? `${props.id}-hint` : undefined,
)
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label class="field__label" :for="id">
      {{ label }} <span v-if="optional" class="field__optional">Opcional</span>
    </label>

    <textarea
      v-if="textarea"
      :id="id"
      v-model="model"
      class="field__input"
      rows="3"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
    ></textarea>

    <div v-else class="field__control">
      <input
        :id="id"
        v-model="model"
        class="field__input"
        :type="inputType"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :placeholder="placeholder"
        :required="required"
        :maxlength="maxlength"
        :aria-invalid="Boolean(error)"
        :aria-describedby="describedBy"
      />
      <button
        v-if="isPassword"
        class="field__reveal"
        type="button"
        :aria-label="revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        :aria-pressed="revealed"
        @click="revealed = !revealed"
      >
        <i :class="revealed ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
      </button>
    </div>

    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch);
  min-width: 0;

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__optional {
    font-weight: 400;
    color: $ink-muted;
    margin-left: 0.3rem;
  }

  &__control {
    position: relative;
  }

  &__input {
    // 16px evita el zoom automático de iOS al enfocar.
    font-size: 1rem;
    min-height: 48px;
    resize: vertical;

    .field--invalid & {
      border-color: $danger;
    }
  }

  &__reveal {
    position: absolute;
    top: 0;
    right: 0;
    width: 48px;
    height: 48px;
    color: $ink-muted;

    &:hover {
      color: $ink;
    }
  }

  &__control:has(.field__reveal) .field__input {
    padding-right: 3rem;
  }

  &__error,
  &__hint {
    font-size: $text-xs;
    margin-top: 0.35rem;
  }

  &__error {
    color: $danger;
    font-weight: 500;
  }

  &__hint {
    color: $ink-muted;
  }
}
</style>
