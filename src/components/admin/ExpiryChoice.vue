<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  dateInputToIsoEndOfDay,
  isoToDateInput,
  tomorrowDateInput,
} from '@/composables/admin/dates'

/**
 * Vencimiento de un acceso. Tres valores posibles hacia afuera:
 *  - `undefined` → todavía no se eligió (el formulario NO se puede enviar)
 *  - `null`      → "No se revoca", elegido a propósito
 *  - ISO         → "Se revoca el…" con una fecha futura válida
 * Nunca hay opción preseleccionada: un default silencioso termina regalando
 * acceso de por vida, o cortándolo, sin que nadie lo haya decidido.
 */
const model = defineModel<string | null | undefined>({ required: true })

defineProps<{ name: string }>()

type Mode = 'date' | 'never' | null

const mode = ref<Mode>(model.value === null ? 'never' : model.value ? 'date' : null)
const date = ref(isoToDateInput(model.value))
const minDate = tomorrowDateInput()

function emitValue() {
  if (mode.value === 'never') model.value = null
  else if (mode.value === 'date') {
    const valid = date.value && date.value >= minDate
    model.value = valid ? (dateInputToIsoEndOfDay(date.value) ?? undefined) : undefined
  } else model.value = undefined
}

// immediate: un acceso ya vencido llega con fecha pasada y no debe darse por válido.
watch([mode, date], emitValue, { immediate: true })

// Cuando el formulario se limpia desde afuera, el control vuelve a "sin elegir".
watch(model, (value) => {
  if (value === undefined && mode.value === 'never') mode.value = null
  if (value === undefined && mode.value === 'date' && date.value >= minDate) {
    mode.value = null
    date.value = ''
  }
})
</script>

<template>
  <div class="expiry" role="radiogroup" aria-label="Vencimiento del acceso">
    <label class="adm-option" :class="{ 'adm-option--selected': mode === 'date' }">
      <input v-model="mode" class="visually-hidden" type="radio" :name="name" value="date" />
      <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
      <span class="adm-option__text expiry__grow">
        <span>Se revoca el…</span>
        <span class="adm-help">El alumno deja de ver las clases al terminar ese día.</span>
        <input
          v-if="mode === 'date'"
          v-model="date"
          class="expiry__date"
          type="date"
          :min="minDate"
          aria-label="Fecha en que se revoca"
        />
        <span v-if="mode === 'date' && date && date < minDate" class="expiry__error">
          La fecha debe ser futura.
        </span>
      </span>
    </label>

    <label class="adm-option" :class="{ 'adm-option--selected': mode === 'never' }">
      <input v-model="mode" class="visually-hidden" type="radio" :name="name" value="never" />
      <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
      <span class="adm-option__text">
        <span>No se revoca</span>
        <span class="adm-help">Acceso de por vida, hasta que alguien lo quite a mano.</span>
      </span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.expiry {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__grow {
    flex: 1 1 auto;
  }

  &__date {
    margin-top: 0.5rem;
    min-height: 48px;
    font-size: 16px;
  }

  &__error {
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
  }
}
</style>
