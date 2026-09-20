<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import OrderDetailModal from '@/components/admin/OrderDetailModal.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchInput from '@/components/admin/SearchInput.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import { formatDateTime } from '@/composables/admin/dates'
import { fulfillmentChip, orderStatusChip } from '@/composables/admin/labels'
import { useAction } from '@/composables/admin/useAction'
import { usePagedList } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import type { FulfillmentStatus, Order, OrderStatus } from '@/types'
import { formatCents } from '@/utils/format'

// Por defecto lo pagado: los intentos de pago abandonados solo hacen ruido.
const status = ref<OrderStatus | ''>('paid')
const fulfillment = ref<FulfillmentStatus | ''>('')
const q = ref('')
const selected = ref<Order | null>(null)

const { items, page, pages, total, loading, error, load, reload } = usePagedList((target) =>
  adminService.orders({
    status: status.value,
    fulfillment: fulfillment.value,
    q: q.value,
    page: target,
  }),
)
const { busy, run } = useAction()

watch([status, fulfillment, q], () => load(1), { immediate: true })

function summary(order: Order): string {
  const first = order.items[0]?.title ?? 'Sin ítems'
  const rest = order.items.length - 1
  return rest > 0 ? `${first} y ${rest} más` : first
}

async function saveFulfillment(value: FulfillmentStatus) {
  const order = selected.value
  if (!order) return
  await run(async () => {
    const saved = await adminService.setFulfillment(order.id, value)
    Object.assign(order, saved)
    selected.value = { ...order }
  }, 'Estado del envío actualizado')
}
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader title="Pedidos" subtitle="Las ventas de la web: clases, entradas y merch." />

    <div class="adm-toolbar">
      <select v-model="status" aria-label="Filtrar por pago">
        <option value="">Todos los pagos</option>
        <option v-for="(chip, key) in orderStatusChip" :key="key" :value="key">
          {{ chip.label }}
        </option>
      </select>
      <select v-model="fulfillment" aria-label="Filtrar por envío">
        <option value="">Todos los envíos</option>
        <option value="pending">Por enviar</option>
        <option value="shipped">Enviados</option>
        <option value="delivered">Entregados</option>
      </select>
      <SearchInput v-model="q" placeholder="Número, correo o nombre…" />
    </div>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!items.length"
      empty-icon="fa-solid fa-receipt"
      empty-title="No hay pedidos con esos filtros"
      empty-text="Cambia los filtros de arriba para ver otros pedidos."
      @retry="reload"
    >
      <ul class="adm-list">
        <li v-for="order in items" :key="order.id" class="adm-row">
          <div class="adm-row__main">
            <p class="adm-row__title">
              {{ order.number }} · {{ order.buyer?.name || order.email }}
            </p>
            <p class="adm-row__meta">{{ summary(order) }}</p>
            <p class="adm-help">{{ formatDateTime(order.paidAt || order.createdAt) }}</p>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Total</span>
            <strong>{{ formatCents(order.totalCents) }}</strong>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Estado</span>
            <span class="chips">
              <StatusChip v-bind="orderStatusChip[order.status]" />
              <StatusChip
                v-if="order.fulfillment !== 'none'"
                v-bind="fulfillmentChip[order.fulfillment]"
              />
            </span>
          </div>
          <div class="adm-row__actions">
            <button type="button" class="adm-action" @click="selected = order">
              <i class="fa-solid fa-eye"></i>
              Ver detalle
            </button>
          </div>
        </li>
      </ul>
      <Pagination :page="page" :pages="pages" :total="total" @change="load" />
    </AdminState>

    <OrderDetailModal
      :order="selected"
      :busy="busy"
      @close="selected = null"
      @fulfillment="saveFulfillment"
    />
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-end, 0.3rem);
  flex-wrap: wrap;

  @include from('md') {
    justify-content: flex-start;
  }
}
</style>
