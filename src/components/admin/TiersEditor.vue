<script setup lang="ts">
import AdminField from './AdminField.vue'
import MoneyInput from './MoneyInput.vue'
import { newTier, type TierDraft } from '@/composables/admin/useEventForm'

const tiers = defineModel<TierDraft[]>({ required: true })

defineProps<{ error?: string }>()

function add() {
  tiers.value = [...tiers.value, newTier()]
}

function remove(key: string) {
  tiers.value = tiers.value.filter((tier) => tier.key !== key)
}

function onCapacity(tier: TierDraft, event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const value = Number(raw)
  tier.capacity = raw === '' || !Number.isInteger(value) || value < 0 ? null : value
}
</script>

<template>
  <div class="tiers">
    <p class="adm-help">
      Cada preventa es un precio con sus fechas: «Preventa 1», «Preventa 2», «Puerta». La web vende
      la que esté en fecha y con cupo.
    </p>

    <div v-for="(tier, index) in tiers" :key="tier.key" class="tiers__item">
      <div class="tiers__head">
        <p class="adm-subtitle">{{ tier.name || `Preventa ${index + 1}` }}</p>
        <span v-if="tier.sold" class="tiers__sold">{{ tier.sold }} vendidas</span>
      </div>

      <div class="adm-form__row">
        <AdminField label="Nombre" :for="`tier-name-${tier.key}`" required>
          <input
            :id="`tier-name-${tier.key}`"
            v-model="tier.name"
            type="text"
            placeholder="Preventa 1"
          />
        </AdminField>
        <AdminField label="Precio" :for="`tier-price-${tier.key}`" required>
          <MoneyInput :id="`tier-price-${tier.key}`" v-model="tier.priceCents" />
        </AdminField>
      </div>

      <div class="adm-form__row">
        <AdminField
          label="Disponible desde (opcional)"
          :for="`tier-from-${tier.key}`"
          help="Vacío = desde ya."
        >
          <input :id="`tier-from-${tier.key}`" v-model="tier.availableFrom" type="datetime-local" />
        </AdminField>
        <AdminField
          label="Disponible hasta (opcional)"
          :for="`tier-until-${tier.key}`"
          help="Vacío = hasta que se acabe el cupo."
        >
          <input
            :id="`tier-until-${tier.key}`"
            v-model="tier.availableUntil"
            type="datetime-local"
          />
        </AdminField>
        <AdminField
          label="Cupo (opcional)"
          :for="`tier-cap-${tier.key}`"
          help="Cuántas entradas a este precio. Vacío = sin límite."
        >
          <input
            :id="`tier-cap-${tier.key}`"
            :value="tier.capacity ?? ''"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            @input="onCapacity(tier, $event)"
          />
        </AdminField>
      </div>

      <button
        type="button"
        class="adm-action adm-action--danger tiers__remove"
        :disabled="tier.sold > 0"
        @click="remove(tier.key)"
      >
        <i class="fa-solid fa-trash"></i>
        Quitar preventa
      </button>
      <p v-if="tier.sold > 0" class="adm-help">
        Ya tiene entradas vendidas: no se puede quitar. Puedes cerrarla con la fecha «hasta».
      </p>
    </div>

    <p v-if="error" class="tiers__error" role="alert">
      <i class="fa-solid fa-circle-exclamation"></i>
      {{ error }}
    </p>

    <button type="button" class="adm-action tiers__add" @click="add">
      <i class="fa-solid fa-plus"></i>
      Agregar preventa
    </button>
  </div>
</template>

<style scoped lang="scss">
.tiers {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__item {
    @include flex(column, stretch, flex-start, 0.75rem);
    padding: 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
    flex-wrap: wrap;
  }

  &__sold {
    padding: 0.15rem 0.6rem;
    border-radius: $radius-pill;
    background: $success-bg;
    font-size: $text-xs;
    font-weight: 700;
    color: darken($success, 22);
  }

  &__remove,
  &__add {
    align-self: flex-start;
  }

  &__error {
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
  }
}
</style>
