<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchInput from '@/components/admin/SearchInput.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import TicketResult from '@/components/admin/TicketResult.vue'
import { formatDateTime } from '@/composables/admin/dates'
import { ticketStatusChip } from '@/composables/admin/labels'
import { useAction } from '@/composables/admin/useAction'
import { usePagedList } from '@/composables/admin/useResource'
import { useTicketCheck } from '@/composables/admin/useTicketCheck'
import { adminService } from '@/services/admin.service'
import type { EventItem, Ticket } from '@/types'

const route = useRoute()
const eventId = ref(typeof route.query.event === 'string' ? route.query.event : '')
const q = ref('')
const events = ref<EventItem[]>([])
const codeInput = ref<HTMLInputElement | null>(null)

const { items, page, pages, total, loading, error, load, reload } = usePagedList((target) =>
  adminService.tickets({ event: eventId.value, q: q.value, page: target }),
)
const { code, busy: checking, result, verify, checkIn, reset } = useTicketCheck(reload)
const { busy, run } = useAction()
const toVoid = ref<Ticket | null>(null)

watch([eventId, q], () => load(1), { immediate: true })

onMounted(async () => {
  try {
    events.value = (await adminService.events({ limit: 100 })).items
  } catch {
    // Sin la lista de eventos el filtro queda en "todos": verificar sigue funcionando.
  }
})

function nextTicket() {
  reset()
  codeInput.value?.focus()
}

async function confirmVoid() {
  const ticket = toVoid.value
  if (!ticket) return
  const ok = await run(() => adminService.voidTicket(ticket.id), 'Entrada anulada')
  toVoid.value = null
  if (ok) reload()
}
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Verificar entrada"
      subtitle="Escribe o pega el código que trae la persona en su correo."
    />

    <AdminCard>
      <form class="door" @submit.prevent="verify">
        <label class="door__label" for="ticket-code">Código de la entrada</label>
        <input
          id="ticket-code"
          ref="codeInput"
          v-model="code"
          class="door__input"
          type="text"
          autocomplete="off"
          autocapitalize="characters"
          autocorrect="off"
          spellcheck="false"
          enterkeyhint="go"
          placeholder="ABCD123456"
        />
        <button
          type="submit"
          class="btn btn--primary btn--block door__button"
          :disabled="checking || !code.trim()"
        >
          <i
            class="fa-solid"
            :class="checking ? 'fa-circle-notch fa-spin' : 'fa-magnifying-glass'"
          ></i>
          {{ checking ? 'Verificando…' : 'Verificar entrada' }}
        </button>
      </form>
    </AdminCard>

    <AdminCard title="Entradas vendidas" hint="Busca por nombre, correo o código.">
      <div class="adm-toolbar">
        <select v-model="eventId" aria-label="Filtrar por evento">
          <option value="">Todos los eventos</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.title }}
          </option>
        </select>
        <SearchInput v-model="q" placeholder="Buscar entrada…" />
      </div>

      <AdminState
        :loading="loading"
        :error="error"
        :empty="!items.length"
        empty-icon="fa-solid fa-ticket"
        empty-title="No hay entradas en esta lista"
        empty-text="Aquí aparecen las entradas cuando alguien compra en línea."
        @retry="reload"
      >
        <ul class="adm-list">
          <li v-for="ticket in items" :key="ticket.id" class="adm-row">
            <div class="adm-row__main">
              <p class="adm-row__title">{{ ticket.holderName || ticket.holderEmail }}</p>
              <p class="adm-row__meta">{{ ticket.event.title }} · {{ ticket.tierName }}</p>
            </div>
            <div class="adm-row__cell">
              <span class="adm-row__label">Código</span>
              <code class="door__code">{{ ticket.code }}</code>
            </div>
            <div class="adm-row__cell">
              <span class="adm-row__label">Estado</span>
              <span>
                <StatusChip v-bind="ticketStatusChip[ticket.status]" />
                <span v-if="ticket.usedAt" class="adm-help">
                  {{ formatDateTime(ticket.usedAt) }}</span
                >
              </span>
            </div>
            <div class="adm-row__actions">
              <button
                type="button"
                class="adm-action adm-action--danger"
                :disabled="ticket.status === 'void'"
                @click="toVoid = ticket"
              >
                <i class="fa-solid fa-ban"></i>
                Anular
              </button>
            </div>
          </li>
        </ul>
        <Pagination :page="page" :pages="pages" :total="total" @change="load" />
      </AdminState>
    </AdminCard>

    <TicketResult :result="result" :busy="checking" @check-in="checkIn" @close="nextTicket" />

    <ConfirmDialog
      :open="Boolean(toVoid)"
      title="¿Anular esta entrada?"
      :message="`La entrada ${toVoid?.code} de ${toVoid?.holderName || toVoid?.holderEmail} dejará de servir para ingresar. No se puede deshacer.`"
      confirm-label="Sí, anular"
      :busy="busy"
      @confirm="confirmVoid"
      @cancel="toVoid = null"
    />
  </div>
</template>

<style scoped lang="scss">
.door {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__label {
    margin: 0;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  // Grande a propósito: se escribe de pie, en la puerta y con poca luz.
  &__input {
    min-height: 68px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-align: center;
    text-transform: uppercase;

    &::placeholder {
      color: $line;
    }
  }

  &__button {
    min-height: 60px;
  }

  &__code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-weight: 700;
    letter-spacing: 0.08em;
  }
}
</style>
