<script setup lang="ts">
import { formatDate } from '@/utils/format'
import { studentCopy } from '@/config/student'
import type { Ticket } from '@/types'

// `account` = hay sesión: solo entonces tiene sentido mandar a "Mis entradas".
// Quien compró sin cuenta tiene los códigos acá y en su correo.
defineProps<{ tickets: Ticket[]; account?: boolean }>()
</script>

<template>
  <section class="codes">
    <h2 class="codes__title">Tus entradas</h2>
    <ul class="codes__list">
      <li v-for="ticket in tickets" :key="ticket.id" class="codes__item">
        <div class="codes__info">
          <p class="codes__event">{{ ticket.event.title }}</p>
          <p class="codes__meta">{{ ticket.tierName }} · {{ formatDate(ticket.event.startsAt) }}</p>
        </div>
        <p class="codes__code">{{ ticket.code }}</p>
      </li>
    </ul>
    <p class="codes__note">
      <i class="fa-regular fa-envelope" aria-hidden="true"></i>
      {{ studentCopy.payment.ticketsNote }}
    </p>
    <RouterLink v-if="account" class="codes__link" to="/cuenta?tab=entradas">
      Ver mis entradas con su código QR <i class="fa-solid fa-arrow-right"></i>
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.codes {
  @include flex(column, stretch, flex-start, 0.8rem);
  text-align: left;

  &__title {
    @include display($text-lg, 600);
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.6rem);
    list-style: none;
  }

  &__item {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
    padding: 0.9rem 1rem;
    background: $surface;
    border: 1px dashed $accent-deep;
    border-radius: $radius-sm;
  }

  &__info {
    min-width: 0;
  }

  &__event {
    font-weight: 700;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-soft;
  }

  &__code {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: $text-lg;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: $accent-deep;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;

    i {
      margin-right: 0.35rem;
      color: $accent-deep;
    }
  }

  &__link {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;
  }
}
</style>
