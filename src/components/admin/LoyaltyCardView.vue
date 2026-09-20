<script setup lang="ts">
import { computed } from 'vue'
import type { LoyaltyCard, LoyaltyStamp } from '@/types'
import { formatDate } from '@/utils/format'

const props = defineProps<{
  card: LoyaltyCard
  /** Permite quitar un sello tocando su casilla. */
  removable?: boolean
  busy?: boolean
}>()

const emit = defineEmits<{ remove: [stamp: LoyaltyStamp] }>()

// Una casilla por sello requerido; las primeras van llenas con los sellos del ciclo.
const slots = computed(() =>
  Array.from({ length: Math.max(props.card.stampsRequired, 1) }, (_, i) => ({
    number: i + 1,
    stamp: props.card.stamps[i] ?? null,
  })),
)
</script>

<template>
  <div class="loyalty">
    <div class="loyalty__head">
      <p class="loyalty__count">
        <strong>{{ card.currentCount }}</strong> de {{ card.stampsRequired }} sellos
      </p>
      <p v-if="card.rewardsAvailable > 0" class="loyalty__reward">
        <i class="fa-solid fa-gift"></i>
        {{ card.rewardsAvailable }}
        {{ card.rewardsAvailable === 1 ? 'premio por canjear' : 'premios por canjear' }}
      </p>
    </div>

    <ul class="loyalty__slots">
      <li v-for="slot in slots" :key="slot.number" class="loyalty__slot-wrap">
        <button
          v-if="slot.stamp && removable"
          type="button"
          class="loyalty__slot loyalty__slot--filled loyalty__slot--button"
          :disabled="busy"
          :aria-label="`Quitar el sello ${slot.number}, del ${formatDate(slot.stamp.at)}`"
          :title="slot.stamp.note || formatDate(slot.stamp.at)"
          @click="emit('remove', slot.stamp)"
        >
          <i class="fa-solid fa-stamp"></i>
        </button>
        <span
          v-else
          class="loyalty__slot"
          :class="{ 'loyalty__slot--filled': slot.stamp }"
          :title="slot.stamp ? slot.stamp.note || formatDate(slot.stamp.at) : ''"
        >
          <i v-if="slot.stamp" class="fa-solid fa-stamp"></i>
          <template v-else>{{ slot.number }}</template>
        </span>
      </li>
    </ul>

    <p class="loyalty__text">
      <i class="fa-solid fa-gift"></i>
      Premio: {{ card.rewardText || 'sin definir (configúralo en Ajustes)' }}
    </p>
    <p v-if="removable && card.stamps.length" class="adm-help">
      Toca un sello para quitarlo si lo pusiste por error.
    </p>
    <p class="adm-help">Premios ya canjeados: {{ card.rewardsRedeemed }}</p>
  </div>
</template>

<style scoped lang="scss">
.loyalty {
  @include flex(column, stretch, flex-start, 0.85rem);
  padding: 1.1rem;
  border-radius: $radius-md;
  background: $wine;
  color: $on-dark;

  &__head {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__count {
    font-size: $text-lg;

    strong {
      font-family: $font-display;
      font-size: $display-sm;
      line-height: 1;
    }
  }

  &__reward {
    padding: 0.3rem 0.75rem;
    border-radius: $radius-pill;
    background: $surface;
    color: $accent;
    font-size: $text-sm;
    font-weight: 700;
  }

  &__slots {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__slot {
    @include flex(row, center, center);
    width: 48px;
    height: 48px;
    border: 2px dashed $line-dark;
    border-radius: 50%;
    font-size: $text-sm;
    font-weight: 700;
    color: $on-dark-soft;

    &--filled {
      border: 2px solid $accent;
      background: $accent;
      color: $surface;
      font-size: 1.1rem;
    }

    &--button:hover {
      background: $accent-deep;
    }

    &--button:disabled {
      opacity: 0.5;
    }
  }

  &__text {
    font-size: $text-sm;
    color: $on-dark;
  }

  .adm-help {
    color: $on-dark-soft;
  }
}
</style>
