<script setup lang="ts">
import { onMounted } from 'vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import {
  dateInputToIsoEndOfDay,
  dateInputToIsoStartOfDay,
  isoToDateInput,
} from '@/composables/admin/dates'
import type { ChipInfo } from '@/composables/admin/labels'
import { useCrudModal } from '@/composables/admin/useCrudModal'
import { adminService } from '@/services/admin.service'
import type { Promo } from '@/types'
import { formatDate } from '@/utils/format'

// En el formulario las fechas son de `input type="date"`; al API viajan como ISO o null.
type PromoForm = Omit<Promo, 'id'>

const {
  items,
  loading,
  error,
  load,
  busy,
  open,
  editing,
  toDelete,
  form,
  openNew,
  openEdit,
  save,
  patch,
  confirmDelete,
} = useCrudModal<Promo, PromoForm>({
  list: async () => (await adminService.promos()).items,
  create: (body) => adminService.createPromo(body),
  update: (id, body) => adminService.updatePromo(id, body),
  remove: (id) => adminService.deletePromo(id),
  empty: (list) => ({
    title: '',
    text: '',
    image: null,
    ctaLabel: '',
    ctaUrl: '',
    startsAt: '',
    endsAt: '',
    isActive: true,
    order: list.length + 1,
  }),
  toForm: ({ id: _id, ...rest }) => ({
    ...rest,
    startsAt: isoToDateInput(rest.startsAt),
    endsAt: isoToDateInput(rest.endsAt),
  }),
  validate: (f) => {
    if (!f.title.trim()) return 'Ponle un título a la promoción.'
    if (f.ctaLabel.trim() && !f.ctaUrl.trim()) return 'El botón necesita un enlace.'
    if (f.startsAt && f.endsAt && f.endsAt < f.startsAt)
      return 'La promoción termina antes de empezar.'
    return ''
  },
  toBody: (f) => ({
    ...f,
    title: f.title.trim(),
    text: f.text.trim(),
    ctaLabel: f.ctaLabel.trim(),
    ctaUrl: f.ctaUrl.trim(),
    startsAt: dateInputToIsoStartOfDay(f.startsAt ?? ''),
    endsAt: dateInputToIsoEndOfDay(f.endsAt ?? ''),
    order: Number(f.order) || 0,
  }),
})

function stateChip(promo: Promo): ChipInfo {
  const now = Date.now()
  if (!promo.isActive) return { label: 'Apagada', tone: 'neutral', icon: 'fa-eye-slash' }
  if (promo.startsAt && new Date(promo.startsAt).getTime() > now) {
    return { label: 'Programada', tone: 'info', icon: 'fa-clock' }
  }
  if (promo.endsAt && new Date(promo.endsAt).getTime() < now) {
    return { label: 'Terminó', tone: 'warning', icon: 'fa-hourglass-end' }
  }
  return { label: 'Se está mostrando', tone: 'success', icon: 'fa-eye' }
}

function dates(promo: Promo): string {
  if (!promo.startsAt && !promo.endsAt) return 'Sin fechas: se muestra mientras esté activa'
  const from = promo.startsAt ? `desde el ${formatDate(promo.startsAt)}` : ''
  const to = promo.endsAt ? `hasta el ${formatDate(promo.endsAt)}` : ''
  return [from, to].filter(Boolean).join(' ')
}

onMounted(load)
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Promociones"
      subtitle="Los anuncios que aparecen en la página de inicio."
    >
      <button type="button" class="btn btn--primary" @click="openNew">
        <i class="fa-solid fa-plus"></i>
        Nueva promoción
      </button>
    </AdminPageHeader>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!items?.length"
      empty-icon="fa-solid fa-bullhorn"
      empty-title="No hay promociones"
      empty-text="Crea una para anunciar un descuento, una matrícula abierta o un evento."
      @retry="load"
    >
      <template #empty-action>
        <button type="button" class="btn btn--primary" @click="openNew">Crear promoción</button>
      </template>

      <ul class="adm-list">
        <li v-for="promo in items" :key="promo.id" class="adm-row">
          <div class="adm-row__head">
            <img
              v-if="promo.image"
              :src="promo.image.url"
              alt=""
              class="adm-row__thumb"
              loading="lazy"
            />
            <span v-else class="adm-row__thumb"><i class="fa-solid fa-bullhorn"></i></span>
            <div class="adm-row__main">
              <p class="adm-row__title">{{ promo.title }}</p>
              <p class="adm-row__meta">{{ dates(promo) }}</p>
            </div>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Estado</span>
            <StatusChip v-bind="stateChip(promo)" />
          </div>
          <div class="adm-row__actions">
            <button type="button" class="adm-action" @click="openEdit(promo)">
              <i class="fa-solid fa-pen"></i>
              Editar
            </button>
            <button
              type="button"
              class="adm-action"
              :disabled="busy"
              @click="
                patch(
                  promo,
                  { isActive: !promo.isActive },
                  promo.isActive ? 'Promoción apagada' : 'Promoción activada',
                )
              "
            >
              <i class="fa-solid" :class="promo.isActive ? 'fa-toggle-off' : 'fa-toggle-on'"></i>
              {{ promo.isActive ? 'Apagar' : 'Activar' }}
            </button>
            <button
              type="button"
              class="adm-action adm-action--danger adm-action--icon"
              aria-label="Borrar promoción"
              @click="toDelete = promo"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </AdminState>

    <AdminModal
      :open="open"
      :title="editing ? 'Editar promoción' : 'Nueva promoción'"
      @close="open = false"
    >
      <form id="promo-form" class="adm-form" novalidate @submit.prevent="save">
        <AdminField label="Título" for="promo-title" required>
          <input id="promo-title" v-model="form.title" type="text" placeholder="2x1 en matrícula" />
        </AdminField>
        <AdminField label="Texto" for="promo-text" help="Una o dos frases con el detalle.">
          <textarea id="promo-text" v-model="form.text" rows="3"></textarea>
        </AdminField>
        <ImageUploader v-model="form.image" folder="promos" label="Imagen (opcional)" />
        <div class="adm-form__row">
          <AdminField
            label="Texto del botón"
            for="promo-cta"
            help="Ej.: «Quiero mi cupo». Vacío = sin botón."
          >
            <input id="promo-cta" v-model="form.ctaLabel" type="text" />
          </AdminField>
          <AdminField
            label="Enlace del botón"
            for="promo-url"
            help="Una página del sitio (/clases) o un enlace de WhatsApp."
          >
            <input
              id="promo-url"
              v-model="form.ctaUrl"
              type="text"
              inputmode="url"
              autocapitalize="none"
              placeholder="/clases"
            />
          </AdminField>
        </div>
        <div class="adm-form__row">
          <AdminField label="Se muestra desde (opcional)" for="promo-from">
            <input id="promo-from" v-model="form.startsAt" type="date" />
          </AdminField>
          <AdminField label="Hasta (opcional)" for="promo-until" help="Ese día todavía se muestra.">
            <input
              id="promo-until"
              v-model="form.endsAt"
              type="date"
              :min="form.startsAt || undefined"
            />
          </AdminField>
        </div>
        <AdminField label="Orden" for="promo-order" help="1 sale primero.">
          <input
            id="promo-order"
            v-model.number="form.order"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
          />
        </AdminField>
        <AdminSwitch
          v-model="form.isActive"
          label="Activa"
          help="Apagada no se muestra, aunque esté en fecha."
        />
      </form>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="open = false">Cancelar</button>
        <button type="submit" form="promo-form" class="btn btn--primary" :disabled="busy">
          {{ busy ? 'Guardando…' : 'Guardar' }}
        </button>
      </template>
    </AdminModal>

    <ConfirmDialog
      :open="Boolean(toDelete)"
      :title="`¿Borrar «${toDelete?.title}»?`"
      message="Si solo quieres que no se vea por ahora, mejor apágala."
      confirm-label="Sí, borrar"
      :busy="busy"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
