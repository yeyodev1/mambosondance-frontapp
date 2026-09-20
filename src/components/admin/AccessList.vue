<script setup lang="ts">
import AdminModal from './AdminModal.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import ExpiryChoice from './ExpiryChoice.vue'
import StatusChip from './StatusChip.vue'
import { accessSourceLabel, accessStatusChip } from '@/composables/admin/labels'
import { useAccessManage } from '@/composables/admin/useAccessManage'
import type { Access } from '@/types'
import { formatDate } from '@/utils/format'

// Se usa en "Accesos" (todos los alumnos) y en la ficha de un alumno (sin su columna).
defineProps<{
  accesses: Access[]
  hideUser?: boolean
}>()

const emit = defineEmits<{ changed: [] }>()

const { busy, toRevoke, toEdit, editValue, askEdit, confirmRevoke, confirmEdit } = useAccessManage(
  () => emit('changed'),
)
</script>

<template>
  <ul class="adm-list">
    <li v-for="access in accesses" :key="access.id" class="adm-row">
      <div class="adm-row__main">
        <template v-if="!hideUser">
          <RouterLink
            :to="{ name: 'AdminUserDetail', params: { id: access.user.id } }"
            class="adm-row__title"
          >
            {{ access.user.name || access.user.email }}
          </RouterLink>
          <p class="adm-row__meta">{{ access.user.email }}</p>
        </template>
        <p :class="hideUser ? 'adm-row__title' : 'adm-row__meta'">
          <i v-if="!hideUser" class="fa-solid fa-circle-play"></i>
          {{ access.product.title }}
        </p>
        <p v-if="access.note" class="adm-help">Nota: {{ access.note }}</p>
      </div>

      <div class="adm-row__cell">
        <span class="adm-row__label">Origen</span>
        <span>{{ accessSourceLabel[access.source] }}</span>
      </div>
      <div class="adm-row__cell">
        <span class="adm-row__label">Estado</span>
        <StatusChip v-bind="accessStatusChip[access.status]" />
      </div>
      <div class="adm-row__cell">
        <span class="adm-row__label">Vence</span>
        <span>{{ access.expiresAt ? formatDate(access.expiresAt) : 'No se revoca' }}</span>
      </div>

      <div class="adm-row__actions">
        <button type="button" class="adm-action" @click="askEdit(access)">
          <i class="fa-solid fa-calendar-day"></i>
          Editar vencimiento
        </button>
        <button
          type="button"
          class="adm-action adm-action--danger"
          :disabled="access.status === 'revocado'"
          @click="toRevoke = access"
        >
          <i class="fa-solid fa-ban"></i>
          Revocar
        </button>
      </div>
    </li>
  </ul>

  <ConfirmDialog
    :open="Boolean(toRevoke)"
    title="¿Revocar este acceso?"
    :message="`${toRevoke?.user.name || toRevoke?.user.email} dejará de ver «${toRevoke?.product.title}» desde ahora. Puedes volver a dárselo cuando quieras.`"
    confirm-label="Sí, revocar"
    :busy="busy"
    @confirm="confirmRevoke"
    @cancel="toRevoke = null"
  />

  <AdminModal :open="Boolean(toEdit)" title="Editar vencimiento" @close="toEdit = null">
    <div v-if="toEdit" class="adm-form">
      <p class="adm-row__meta">
        {{ toEdit.user.name || toEdit.user.email }} · {{ toEdit.product.title }}
      </p>
      <p v-if="toEdit.status === 'revocado'" class="adm-help">
        Este acceso está revocado. Para reactivarlo, vuelve a darlo desde «Dar acceso».
      </p>
      <ExpiryChoice v-model="editValue" name="edit-expiry" />
    </div>
    <template #footer>
      <button type="button" class="btn btn--ghost" @click="toEdit = null">Cancelar</button>
      <button
        type="button"
        class="btn btn--primary"
        :disabled="busy || editValue === undefined"
        @click="confirmEdit"
      >
        {{ busy ? 'Guardando…' : 'Guardar vencimiento' }}
      </button>
    </template>
  </AdminModal>
</template>
