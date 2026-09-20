<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AccessList from '@/components/admin/AccessList.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import LoyaltyManager from '@/components/admin/LoyaltyManager.vue'
import OrderDetailModal from '@/components/admin/OrderDetailModal.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import { formatDateTime } from '@/composables/admin/dates'
import { fulfillmentChip, orderStatusChip } from '@/composables/admin/labels'
import { useAction } from '@/composables/admin/useAction'
import { useResource } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import type { FulfillmentStatus, LoyaltyCard, Order } from '@/types'
import { formatCents, formatDate } from '@/utils/format'

const route = useRoute()
const id = computed(() => String(route.params.id))

const { data, loading, error, load, refresh } = useResource(() => adminService.user(id.value))
const { busy, run } = useAction()
const selectedOrder = ref<Order | null>(null)

// La tarjeta se edita en sitio: cada acción devuelve la tarjeta nueva y reemplaza a esta.
const loyalty = computed<LoyaltyCard | null>({
  get: () => data.value?.loyalty ?? null,
  set: (card) => {
    if (data.value && card) data.value.loyalty = card
  },
})

watch(id, () => load(), { immediate: true })

async function saveFulfillment(value: FulfillmentStatus) {
  const order = selectedOrder.value
  if (!order) return
  await run(async () => {
    Object.assign(order, await adminService.setFulfillment(order.id, value))
    selectedOrder.value = { ...order }
  }, 'Estado del envío actualizado')
}
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      :title="data?.user.name || 'Alumno'"
      :back="{ name: 'AdminUsers' }"
      back-label="Alumnos"
    />

    <AdminState :loading="loading" :error="error" @retry="load">
      <div v-if="data" class="adm-stack">
        <AdminCard title="Datos">
          <dl class="facts">
            <div class="facts__item">
              <dt>Correo</dt>
              <dd>
                <a :href="`mailto:${data.user.email}`">{{ data.user.email }}</a>
              </dd>
            </div>
            <div class="facts__item">
              <dt>Teléfono</dt>
              <dd>{{ data.user.phone || 'No lo ha puesto' }}</dd>
            </div>
            <div class="facts__item">
              <dt>Cuenta creada</dt>
              <dd>{{ formatDate(data.user.createdAt) }}</dd>
            </div>
          </dl>
        </AdminCard>

        <AdminCard title="Accesos a clases">
          <template #actions>
            <RouterLink
              :to="{ name: 'AdminAccess', query: { email: data.user.email } }"
              class="adm-action adm-action--primary"
            >
              <i class="fa-solid fa-key"></i>
              Dar acceso
            </RouterLink>
          </template>
          <AdminState
            :empty="!data.accesses.length"
            empty-icon="fa-solid fa-key"
            empty-title="Todavía no tiene accesos"
            empty-text="Dale acceso a una clase con el botón de arriba."
          >
            <AccessList :accesses="data.accesses" hide-user @changed="refresh" />
          </AdminState>
        </AdminCard>

        <AdminCard title="Tarjeta de fidelidad">
          <LoyaltyManager v-model="loyalty" :email="data.user.email" quick-stamp />
        </AdminCard>

        <AdminCard title="Pedidos">
          <AdminState
            :empty="!data.orders.length"
            empty-icon="fa-solid fa-receipt"
            empty-title="No ha comprado en la web"
          >
            <ul class="adm-list">
              <li v-for="order in data.orders" :key="order.id" class="adm-row">
                <div class="adm-row__main">
                  <p class="adm-row__title">{{ order.number }}</p>
                  <p class="adm-row__meta">
                    {{ order.items.map((item) => item.title).join(', ') }}
                  </p>
                  <p class="adm-help">{{ formatDateTime(order.paidAt || order.createdAt) }}</p>
                </div>
                <div class="adm-row__cell">
                  <span class="adm-row__label">Total</span>
                  <strong>{{ formatCents(order.totalCents) }}</strong>
                </div>
                <div class="adm-row__cell">
                  <span class="adm-row__label">Estado</span>
                  <span>
                    <StatusChip v-bind="orderStatusChip[order.status]" />
                    <StatusChip
                      v-if="order.fulfillment !== 'none'"
                      v-bind="fulfillmentChip[order.fulfillment]"
                    />
                  </span>
                </div>
                <div class="adm-row__actions">
                  <button type="button" class="adm-action" @click="selectedOrder = order">
                    <i class="fa-solid fa-eye"></i>
                    Ver detalle
                  </button>
                </div>
              </li>
            </ul>
          </AdminState>
        </AdminCard>
      </div>
    </AdminState>

    <OrderDetailModal
      :order="selectedOrder"
      :busy="busy"
      @close="selectedOrder = null"
      @fulfillment="saveFulfillment"
    />
  </div>
</template>

<style scoped lang="scss">
.facts {
  @include flex-cards(200px, 1rem);

  &__item {
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  dt {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  dd {
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  a {
    color: $accent;
  }
}
</style>
