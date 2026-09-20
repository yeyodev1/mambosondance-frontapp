<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchInput from '@/components/admin/SearchInput.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import { formatDateTime } from '@/composables/admin/dates'
import { publishedChip, salesModeOptions } from '@/composables/admin/labels'
import { useAction } from '@/composables/admin/useAction'
import { usePagedList } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import type { EventItem } from '@/types'

type When = 'upcoming' | 'past' | ''

const when = ref<When>('upcoming')
const q = ref('')
const tabs: { value: When; label: string }[] = [
  { value: 'upcoming', label: 'Próximos' },
  { value: 'past', label: 'Pasados' },
  { value: '', label: 'Todos' },
]

const { items, page, pages, total, loading, error, load, reload } = usePagedList((target) =>
  adminService.events({ when: when.value, q: q.value, page: target }),
)
const { busy, run } = useAction()
const toDelete = ref<EventItem | null>(null)

watch([when, q], () => load(1), { immediate: true })

function salesLabel(event: EventItem): string {
  const mode = salesModeOptions.find((option) => option.value === event.salesMode)
  if (event.salesMode !== 'online') return mode?.label ?? ''
  const sold = event.tiers.reduce((sum, tier) => sum + tier.sold, 0)
  return `En línea · ${sold} ${sold === 1 ? 'vendida' : 'vendidas'}`
}

async function togglePublished(event: EventItem) {
  const next = !event.isPublished
  await run(
    async () => {
      Object.assign(event, await adminService.updateEvent(event.id, { isPublished: next }))
    },
    next ? 'Publicado: ya se ve en el sitio' : 'Oculto: ya no se ve en el sitio',
  )
}

async function confirmDelete() {
  const event = toDelete.value
  if (!event) return
  const ok = await run(() => adminService.deleteEvent(event.id), 'Evento eliminado')
  toDelete.value = null
  if (ok) reload()
}
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Eventos"
      subtitle="Publica sociales, talleres y congresos, con sus preventas."
    >
      <RouterLink
        :to="{ name: 'AdminEventEdit', params: { id: 'nuevo' } }"
        class="btn btn--primary"
      >
        <i class="fa-solid fa-plus"></i>
        Nuevo evento
      </RouterLink>
    </AdminPageHeader>

    <div class="adm-tabs" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        role="tab"
        class="adm-tab"
        :class="{ 'adm-tab--active': when === tab.value }"
        :aria-selected="when === tab.value"
        @click="when = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <SearchInput v-model="q" placeholder="Buscar por nombre, lugar o ciudad…" />

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!items.length"
      empty-icon="fa-regular fa-calendar"
      :empty-title="q ? 'No encontramos eventos con esa búsqueda' : 'No hay eventos en esta lista'"
      :empty-text="q ? 'Prueba con otra palabra.' : 'Crea uno y publícalo cuando esté listo.'"
      @retry="reload"
    >
      <template #empty-action>
        <RouterLink
          v-if="!q"
          :to="{ name: 'AdminEventEdit', params: { id: 'nuevo' } }"
          class="btn btn--primary"
        >
          <i class="fa-solid fa-plus"></i>
          Crear evento
        </RouterLink>
      </template>

      <ul class="adm-list">
        <li v-for="event in items" :key="event.id" class="adm-row">
          <div class="adm-row__head">
            <img
              v-if="event.cover"
              :src="event.cover.url"
              alt=""
              class="adm-row__thumb"
              loading="lazy"
            />
            <span v-else class="adm-row__thumb"><i class="fa-regular fa-calendar"></i></span>
            <div class="adm-row__main">
              <p class="adm-row__title">{{ event.title }}</p>
              <p class="adm-row__meta">
                {{ formatDateTime(event.startsAt) }}
                <template v-if="event.venue"> · {{ event.venue }}</template>
              </p>
            </div>
          </div>

          <div class="adm-row__cell">
            <span class="adm-row__label">Entradas</span>
            <span>{{ salesLabel(event) }}</span>
          </div>

          <div class="adm-row__cell">
            <span class="adm-row__label">Estado</span>
            <StatusChip v-bind="publishedChip(event.isPublished)" />
          </div>

          <div class="adm-row__actions">
            <RouterLink
              :to="{ name: 'AdminEventEdit', params: { id: event.id } }"
              class="adm-action"
            >
              <i class="fa-solid fa-pen"></i>
              Editar
            </RouterLink>
            <RouterLink
              v-if="event.salesMode === 'online'"
              :to="{ name: 'AdminTickets', query: { event: event.id } }"
              class="adm-action"
            >
              <i class="fa-solid fa-ticket"></i>
              Entradas
            </RouterLink>
            <button
              type="button"
              class="adm-action"
              :disabled="busy"
              @click="togglePublished(event)"
            >
              <i class="fa-solid" :class="event.isPublished ? 'fa-eye-slash' : 'fa-eye'"></i>
              {{ event.isPublished ? 'Ocultar' : 'Publicar' }}
            </button>
            <button
              type="button"
              class="adm-action adm-action--danger adm-action--icon"
              aria-label="Borrar evento"
              @click="toDelete = event"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
      <Pagination :page="page" :pages="pages" :total="total" @change="load" />
    </AdminState>

    <ConfirmDialog
      :open="Boolean(toDelete)"
      :title="`¿Borrar «${toDelete?.title}»?`"
      message="Desaparece del sitio y no se puede recuperar. Si ya vendió entradas, no se podrá borrar: mejor ocúltalo."
      confirm-label="Sí, borrar"
      :busy="busy"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
