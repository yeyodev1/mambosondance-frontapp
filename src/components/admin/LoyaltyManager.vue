<script setup lang="ts">
import ConfirmDialog from './ConfirmDialog.vue'
import LoyaltyCardView from './LoyaltyCardView.vue'
import { useLoyaltyActions } from '@/composables/admin/useLoyaltyActions'
import type { LoyaltyCard } from '@/types'
import { formatDate } from '@/utils/format'

// La tarjeta de un alumno con sus acciones. Sirve en "Sellar tarjeta" y en la ficha del alumno.
const card = defineModel<LoyaltyCard | null>({ required: true })

const props = defineProps<{
  email: string
  /** En la ficha del alumno se sella desde aquí mismo, de a un sello. */
  quickStamp?: boolean
}>()

const { busy, toRemove, redeeming, stamp, redeem, removeStamp } = useLoyaltyActions(
  () => props.email,
  card,
)
</script>

<template>
  <div v-if="card" class="manager">
    <LoyaltyCardView :card="card" removable :busy="busy" @remove="toRemove = $event" />

    <div class="manager__actions">
      <button
        v-if="quickStamp"
        type="button"
        class="btn btn--primary"
        :disabled="busy"
        @click="stamp('', 1)"
      >
        <i class="fa-solid fa-stamp"></i>
        Sellar tarjeta
      </button>
      <button
        type="button"
        class="btn btn--dark"
        :disabled="busy || card.rewardsAvailable < 1"
        @click="redeeming = true"
      >
        <i class="fa-solid fa-gift"></i>
        Canjear premio
      </button>
    </div>
    <p v-if="card.rewardsAvailable < 1" class="adm-help">
      Todavía no hay premio por canjear: le faltan
      {{ Math.max(card.stampsRequired - card.currentCount, 0) }} sellos.
    </p>

    <ConfirmDialog
      :open="redeeming"
      :danger="false"
      title="¿Canjear el premio?"
      :message="`Se entrega: ${card.rewardText}. Hazlo cuando el alumno ya lo esté recibiendo.`"
      confirm-label="Sí, canjear"
      :busy="busy"
      @confirm="redeem()"
      @cancel="redeeming = false"
    />
    <ConfirmDialog
      :open="Boolean(toRemove)"
      title="¿Quitar este sello?"
      :message="
        toRemove
          ? `Sello del ${formatDate(toRemove.at)}${toRemove.note ? ` — ${toRemove.note}` : ''}.`
          : ''
      "
      confirm-label="Sí, quitar"
      :busy="busy"
      @confirm="removeStamp"
      @cancel="toRemove = null"
    />
  </div>
</template>

<style scoped lang="scss">
.manager {
  @include flex(column, stretch, flex-start, 0.85rem);

  &__actions {
    @include flex(column, stretch, flex-start, 0.5rem);

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
