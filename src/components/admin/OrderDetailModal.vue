<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AdminModal from './AdminModal.vue'
import StatusChip from './StatusChip.vue'
import { formatDateTime } from '@/composables/admin/dates'
import { fulfillmentChip, orderStatusChip } from '@/composables/admin/labels'
import type { FulfillmentStatus, Order } from '@/types'
import { formatCents } from '@/utils/format'

const props = defineProps<{
  order: Order | null
  busy: boolean
}>()

const emit = defineEmits<{ close: []; fulfillment: [value: FulfillmentStatus] }>()

const fulfillment = ref<FulfillmentStatus>('none')
const steps: FulfillmentStatus[] = ['pending', 'shipped', 'delivered']

watch(
  () => props.order,
  (order) => {
    if (order) fulfillment.value = order.fulfillment
  },
  { immediate: true },
)

// Solo los pedidos con algo físico se envían.
const ships = computed(() => Boolean(props.order && props.order.fulfillment !== 'none'))

function options(selected: Record<string, string>): string {
  return Object.entries(selected ?? {})
    .map(([name, value]) => `${name}: ${value}`)
    .join(' · ')
}
</script>

<template>
  <AdminModal
    :open="Boolean(order)"
    :title="order ? `Pedido ${order.number}` : ''"
    @close="emit('close')"
  >
    <div v-if="order" class="order">
      <div class="order__chips">
        <StatusChip v-bind="orderStatusChip[order.status]" />
        <StatusChip v-if="ships" v-bind="fulfillmentChip[order.fulfillment]" />
        <span class="adm-help">{{ formatDateTime(order.paidAt || order.createdAt) }}</span>
      </div>

      <section class="order__block">
        <h3 class="adm-subtitle">Qué compró</h3>
        <ul class="order__items">
          <li v-for="(item, index) in order.items" :key="index" class="order__item">
            <span class="order__item-text">
              <strong>{{ item.quantity }} × {{ item.title }}</strong>
              <span v-if="options(item.selectedOptions)" class="adm-help">
                {{ options(item.selectedOptions) }}
              </span>
              <span v-if="item.kind === 'ticket'" class="adm-help">Entrada de evento</span>
            </span>
            <span>{{ formatCents(item.unitCents * item.quantity) }}</span>
          </li>
        </ul>
        <p v-if="order.discountCents" class="order__line">
          <span>Descuento</span>
          <span>− {{ formatCents(order.discountCents) }}</span>
        </p>
        <p class="order__line order__line--total">
          <span>Total</span>
          <span>{{ formatCents(order.totalCents) }}</span>
        </p>
      </section>

      <section class="order__block">
        <h3 class="adm-subtitle">Quién compró</h3>
        <p>{{ order.buyer?.name || 'Sin nombre' }}</p>
        <p class="adm-help">{{ order.email }}</p>
        <p v-if="order.buyer?.phone" class="adm-help">Tel. {{ order.buyer.phone }}</p>
        <p v-if="order.buyer?.documentId" class="adm-help">
          Cédula/RUC {{ order.buyer.documentId }}
        </p>
        <RouterLink
          :to="{ name: 'AdminUserDetail', params: { id: order.user } }"
          class="adm-action order__link"
        >
          <i class="fa-solid fa-user"></i>
          Ver al alumno
        </RouterLink>
      </section>

      <section v-if="order.shipping" class="order__block">
        <h3 class="adm-subtitle">A dónde se envía</h3>
        <p>{{ order.shipping.fullName }} · {{ order.shipping.phone }}</p>
        <p>{{ order.shipping.address }}, {{ order.shipping.city }}</p>
        <p v-if="order.shipping.notes" class="adm-help">Nota: {{ order.shipping.notes }}</p>
      </section>

      <section v-if="ships" class="order__block">
        <h3 class="adm-subtitle">Estado del envío</h3>
        <div class="order__steps" role="radiogroup" aria-label="Estado del envío">
          <label
            v-for="step in steps"
            :key="step"
            class="adm-option"
            :class="{ 'adm-option--selected': fulfillment === step }"
          >
            <input
              v-model="fulfillment"
              class="visually-hidden"
              type="radio"
              name="fulfillment"
              :value="step"
            />
            <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
            <span>{{ fulfillmentChip[step].label }}</span>
          </label>
        </div>
      </section>
    </div>

    <template #footer>
      <button type="button" class="btn btn--ghost" @click="emit('close')">Cerrar</button>
      <button
        v-if="ships"
        type="button"
        class="btn btn--primary"
        :disabled="busy || fulfillment === order?.fulfillment"
        @click="emit('fulfillment', fulfillment)"
      >
        {{ busy ? 'Guardando…' : 'Guardar estado del envío' }}
      </button>
    </template>
  </AdminModal>
</template>

<style scoped lang="scss">
.order {
  @include flex(column, stretch, flex-start, 1.25rem);
  font-size: $text-sm;

  &__chips {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__block {
    @include flex(column, stretch, flex-start, 0.3rem);
    padding-top: 1rem;
    border-top: 1px solid $line;
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.6rem);
    margin: 0.3rem 0;
  }

  &__item,
  &__line {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__item-text {
    @include flex(column, flex-start, flex-start, 0.1rem);
    min-width: 0;
  }

  &__line--total {
    padding-top: 0.5rem;
    border-top: 1px dashed $line;
    font-size: $text-base;
    font-weight: 700;
  }

  &__link {
    align-self: flex-start;
    margin-top: 0.4rem;
  }

  &__steps {
    @include flex-cards(150px, 0.5rem);
    margin-top: 0.3rem;
  }
}
</style>
