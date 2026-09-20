<script setup lang="ts">
import AdminField from './AdminField.vue'
import { levelOptions } from '@/composables/admin/labels'
import type { AccessMode } from '@/composables/admin/useProductForm'
import type { CourseLevel } from '@/types'

const level = defineModel<CourseLevel | ''>('level', { required: true })
const style = defineModel<string>('style', { required: true })
const accessMode = defineModel<AccessMode>('accessMode', { required: true })
const accessDays = defineModel<number | null>('accessDays', { required: true })

defineProps<{ errors: Partial<Record<'level' | 'accessMode' | 'accessDays', string>> }>()

const styles = ['Salsa', 'Bachata', 'Mambo', 'Estilo chicas', 'Ritmos cubanos']
</script>

<template>
  <div class="adm-form">
    <div class="adm-form__row">
      <AdminField label="Nivel" for="product-level" required :error="errors.level">
        <select id="product-level" v-model="level">
          <option value="" disabled>Elige un nivel</option>
          <option v-for="option in levelOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </AdminField>
      <AdminField label="Estilo" for="product-style" help="Por ejemplo: Salsa, Bachata.">
        <input id="product-style" v-model="style" type="text" list="product-styles" />
        <datalist id="product-styles">
          <option v-for="item in styles" :key="item" :value="item"></option>
        </datalist>
      </AdminField>
    </div>

    <AdminField
      label="¿Cuánto dura el acceso de quien compra?"
      required
      :error="errors.accessMode || errors.accessDays"
      help="Se cuenta desde el día de la compra."
    >
      <div class="duration" role="radiogroup" aria-label="Duración del acceso">
        <label class="adm-option" :class="{ 'adm-option--selected': accessMode === 'lifetime' }">
          <input
            v-model="accessMode"
            class="visually-hidden"
            type="radio"
            name="access-mode"
            value="lifetime"
          />
          <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
          <span class="adm-option__text">
            <span>De por vida</span>
            <span class="adm-help">Quien compra lo puede ver siempre.</span>
          </span>
        </label>
        <label class="adm-option" :class="{ 'adm-option--selected': accessMode === 'days' }">
          <input
            v-model="accessMode"
            class="visually-hidden"
            type="radio"
            name="access-mode"
            value="days"
          />
          <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
          <span class="adm-option__text duration__grow">
            <span>Por una cantidad de días</span>
            <span class="adm-help">Ej.: 30 días = un mes, 365 = un año.</span>
            <input
              v-if="accessMode === 'days'"
              v-model.number="accessDays"
              class="duration__days"
              type="number"
              inputmode="numeric"
              min="1"
              step="1"
              placeholder="Número de días"
              aria-label="Número de días"
            />
          </span>
        </label>
      </div>
    </AdminField>
  </div>
</template>

<style scoped lang="scss">
.duration {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__grow {
    flex: 1 1 auto;
  }

  &__days {
    margin-top: 0.5rem;
  }
}
</style>
