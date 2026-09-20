<script setup lang="ts">
import { onMounted } from 'vue'
import StateBlock from './StateBlock.vue'
import LoyaltyCardVisual from './LoyaltyCardVisual.vue'
import { useRequest } from '@/composables/useRequest'
import { meService } from '@/services/me.service'
import { useUserStore } from '@/stores/user'
import { studentCopy } from '@/config/student'
import { formatDate } from '@/utils/format'

const userStore = useUserStore()
const { data: card, loading, error, run } = useRequest(() => meService.loyalty())

const historyLabels = {
  stamp: { label: 'Sello', icon: 'fa-solid fa-stamp' },
  reward_earned: { label: 'Premio desbloqueado', icon: 'fa-solid fa-gift' },
  reward_redeemed: { label: 'Premio canjeado', icon: 'fa-solid fa-circle-check' },
} as const

onMounted(run)
</script>

<template>
  <StateBlock v-if="loading" kind="loading" text="Cargando tu tarjeta…" />
  <StateBlock v-else-if="error" kind="error" :text="error" @retry="run" />
  <StateBlock
    v-else-if="!card"
    kind="empty"
    icon="fa-solid fa-stamp"
    :text="studentCopy.account.loyaltyDisabled"
  />

  <div v-else class="loyalty">
    <div class="loyalty__main">
      <section v-if="card.rewardsAvailable > 0" class="loyalty__reward" role="status">
        <i class="fa-solid fa-gift" aria-hidden="true"></i>
        <div>
          <h2 class="loyalty__reward-title">
            {{
              card.rewardsAvailable === 1
                ? 'Tienes un premio disponible'
                : `Tienes ${card.rewardsAvailable} premios disponibles`
            }}
          </h2>
          <p class="loyalty__reward-text">{{ card.rewardText }}</p>
          <p class="loyalty__reward-how">{{ studentCopy.account.loyaltyRedeem }}</p>
        </div>
      </section>

      <LoyaltyCardVisual
        :required="card.stampsRequired"
        :count="card.currentCount"
        :reward="card.rewardText"
        :holder="userStore.user?.name"
      />

      <p class="loyalty__left">
        <template v-if="card.currentCount >= card.stampsRequired">Completaste tu tarjeta.</template>
        <template v-else>
          Te {{ card.stampsRequired - card.currentCount === 1 ? 'falta' : 'faltan' }}
          <strong>{{ card.stampsRequired - card.currentCount }}</strong>
          {{ card.stampsRequired - card.currentCount === 1 ? 'sello' : 'sellos' }} para tu premio.
        </template>
        <template v-if="card.rewardsRedeemed"> Ya canjeaste {{ card.rewardsRedeemed }}.</template>
      </p>
    </div>

    <section class="loyalty__history">
      <h2 class="loyalty__heading">Historial</h2>
      <p v-if="!card.history.length" class="loyalty__empty">
        Tu primer sello aparecerá aquí después de tu próxima clase.
      </p>
      <ul v-else class="loyalty__list">
        <li v-for="(entry, i) in card.history" :key="i" class="loyalty__entry">
          <i :class="historyLabels[entry.type].icon" aria-hidden="true"></i>
          <div>
            <p class="loyalty__entry-title">{{ historyLabels[entry.type].label }}</p>
            <p v-if="entry.note" class="loyalty__entry-note">{{ entry.note }}</p>
          </div>
          <time :datetime="entry.at">{{ formatDate(entry.at) }}</time>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.loyalty {
  @include flex(column, stretch, flex-start, $space-lg);

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
  }

  &__main {
    @include flex(column, stretch, flex-start, 1.1rem);
    min-width: 0;

    @include from('lg') {
      flex: 0 0 480px;
    }
  }

  &__reward {
    @include flex(row, flex-start, flex-start, 0.9rem);
    max-width: 480px;
    padding: 1.1rem 1.2rem;
    color: $on-dark;
    background: $wine;
    border-radius: $radius-md;

    > i {
      margin-top: 0.2rem;
      font-size: 1.4rem;
    }
  }

  &__reward-title {
    @include display($text-lg, 600);
    margin-bottom: 0.3rem;
  }

  &__reward-text {
    font-size: $text-sm;
    color: $on-dark-soft;
  }

  &__reward-how {
    margin-top: 0.5rem;
    font-size: $text-sm;
    font-weight: 700;
  }

  &__left {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__history {
    flex: 1;
    min-width: 0;
  }

  &__heading {
    @include display($text-lg, 600);
    margin-bottom: 0.8rem;
  }

  &__empty {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__list {
    list-style: none;
    border-top: 1px solid $line;
  }

  &__entry {
    @include flex(row, flex-start, flex-start, 0.8rem);
    padding-block: 0.85rem;
    border-bottom: 1px solid $line;
    font-size: $text-sm;

    > i {
      flex: 0 0 1.2rem;
      margin-top: 0.25rem;
      color: $accent;
    }

    > div {
      flex: 1;
      min-width: 0;
    }

    time {
      color: $ink-muted;
      white-space: nowrap;
    }
  }

  &__entry-title {
    font-weight: 600;
  }

  &__entry-note {
    color: $ink-soft;
    overflow-wrap: anywhere;
  }
}
</style>
