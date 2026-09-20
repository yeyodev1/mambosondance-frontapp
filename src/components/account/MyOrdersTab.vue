<script setup lang="ts">
import { onMounted } from 'vue'
import StateBlock from './StateBlock.vue'
import { useRequest } from '@/composables/useRequest'
import { orderService } from '@/services/order.service'
import { studentCopy } from '@/config/student'
import { formatCents, formatDate } from '@/utils/format'
import type { FulfillmentStatus, OrderStatus } from '@/types'

const { data: orders, loading, error, run } = useRequest(() => orderService.mine())

const paymentLabels: Record<OrderStatus, string> = {
  pending: 'Pago pendiente',
  paid: 'Pagado',
  canceled: 'Cancelado',
  failed: 'No aprobado',
}

const fulfillmentLabels: Record<FulfillmentStatus, string> = {
  none: '',
  pending: 'Preparando envío',
  shipped: 'Enviado',
  delivered: 'Entregado',
}

onMounted(run)
</script>

<template>
  <StateBlock v-if="loading" kind="loading" text="Cargando tus pedidos…" />
  <StateBlock v-else-if="error" kind="error" :text="error" @retry="run" />
  <StateBlock
    v-else-if="!orders?.length"
    kind="empty"
    icon="fa-solid fa-bag-shopping"
    title="Sin pedidos todavía"
    :text="studentCopy.account.ordersEmpty"
  >
    <RouterLink class="btn btn--primary" to="/clases">Ver clases online</RouterLink>
  </StateBlock>

  <ul v-else class="orders">
    <li v-for="order in orders" :key="order.id" class="orders__item">
      <header class="orders__head">
        <div>
          <h2 class="orders__number">{{ order.number }}</h2>
          <p class="orders__date">{{ formatDate(order.paidAt || order.createdAt) }}</p>
        </div>
        <p class="orders__total">{{ formatCents(order.totalCents) }}</p>
      </header>

      <div class="orders__badges">
        <span class="orders__badge" :class="`orders__badge--${order.status}`">
          {{ paymentLabels[order.status] }}
        </span>
        <span
          v-if="order.status === 'paid' && fulfillmentLabels[order.fulfillment]"
          class="orders__badge orders__badge--ship"
        >
          <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
          {{ fulfillmentLabels[order.fulfillment] }}
        </span>
      </div>

      <ul class="orders__lines">
        <li v-for="(item, i) in order.items" :key="i" class="orders__line">
          <span class="orders__line-title">
            {{ item.quantity }} × {{ item.title }}
            <small v-if="Object.keys(item.selectedOptions || {}).length">
              {{ Object.values(item.selectedOptions).join(' · ') }}
            </small>
          </span>
          <span>{{ formatCents(item.unitCents * item.quantity) }}</span>
        </li>
      </ul>

      <p v-if="order.shipping" class="orders__shipping">
        Envío a {{ order.shipping.fullName }} — {{ order.shipping.address }},
        {{ order.shipping.city }}
      </p>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.orders {
  @include flex(column, stretch, flex-start, 1rem);
  max-width: 760px;
  list-style: none;

  &__item {
    @include flex(column, stretch, flex-start, 0.8rem);
    padding: 1.2rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
  }

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__number {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: $text-base;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: none;
  }

  &__date {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__total {
    font-size: $text-lg;
    font-weight: 700;
    white-space: nowrap;
  }

  &__badges {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__badge {
    @include flex(row, center, center, 0.4rem);
    padding: 0.25rem 0.75rem;
    font-size: $text-xs;
    font-weight: 700;
    border-radius: $radius-pill;
    color: $ink-soft;
    background: $sand;

    &--paid {
      color: $ink;
      background: $success-bg;
    }

    &--pending {
      color: $ink;
      background: $warning-bg;
    }

    &--canceled,
    &--failed {
      color: $danger;
      background: $danger-bg;
    }

    &--ship {
      color: $wine;
    }
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.45rem);
    list-style: none;
    padding-top: 0.8rem;
    border-top: 1px solid $line;
    font-size: $text-sm;
  }

  &__line {
    @include flex(row, flex-start, space-between, 1rem);

    span:last-child {
      white-space: nowrap;
      color: $ink-soft;
    }
  }

  &__line-title {
    min-width: 0;
    overflow-wrap: anywhere;

    small {
      display: block;
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  &__shipping {
    font-size: $text-xs;
    color: $ink-soft;
    overflow-wrap: anywhere;
  }
}
</style>
