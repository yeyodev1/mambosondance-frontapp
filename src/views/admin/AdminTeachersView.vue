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
import { publishedChip } from '@/composables/admin/labels'
import { useCrudModal } from '@/composables/admin/useCrudModal'
import { adminService } from '@/services/admin.service'
import type { Teacher } from '@/types'

type TeacherForm = Omit<Teacher, 'id'>

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
} = useCrudModal<Teacher, TeacherForm>({
  list: async () => (await adminService.teachers()).items,
  create: (body) => adminService.createTeacher(body),
  update: (id, body) => adminService.updateTeacher(id, body),
  remove: (id) => adminService.deleteTeacher(id),
  empty: (list) => ({
    name: '',
    role: '',
    bio: '',
    photo: null,
    instagram: '',
    order: list.length + 1,
    isFounder: false,
    isPublished: true,
  }),
  toForm: ({ id: _id, ...rest }) => ({ ...rest }),
  validate: (f) => (f.name.trim() ? '' : 'Escribe el nombre del profesor.'),
  toBody: (f) => ({
    ...f,
    name: f.name.trim(),
    role: f.role.trim(),
    bio: f.bio.trim(),
    // Se acepta "@usuario", "usuario" o el enlace completo; se guarda sin la arroba.
    instagram: f.instagram.trim().replace(/^@/, ''),
    order: Number(f.order) || 0,
  }),
})

onMounted(load)
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader title="Profesores" subtitle="El equipo que aparece en la página «Profesores».">
      <button type="button" class="btn btn--primary" @click="openNew">
        <i class="fa-solid fa-plus"></i>
        Nuevo profesor
      </button>
    </AdminPageHeader>

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!items?.length"
      empty-icon="fa-solid fa-person-chalkboard"
      empty-title="Todavía no hay profesores"
      empty-text="Agrega a los fundadores y al equipo para que salgan en el sitio."
      @retry="load"
    >
      <template #empty-action>
        <button type="button" class="btn btn--primary" @click="openNew">Agregar el primero</button>
      </template>

      <ul class="adm-list">
        <li v-for="teacher in items" :key="teacher.id" class="adm-row">
          <div class="adm-row__head">
            <img
              v-if="teacher.photo"
              :src="teacher.photo.url"
              alt=""
              class="adm-row__thumb"
              loading="lazy"
            />
            <span v-else class="adm-row__thumb"><i class="fa-solid fa-user"></i></span>
            <div class="adm-row__main">
              <p class="adm-row__title">{{ teacher.name }}</p>
              <p class="adm-row__meta">
                {{ teacher.role || 'Sin rol' }} · Orden {{ teacher.order }}
              </p>
            </div>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Estado</span>
            <span>
              <StatusChip v-bind="publishedChip(teacher.isPublished)" />
              <StatusChip v-if="teacher.isFounder" label="Fundador" tone="info" icon="fa-star" />
            </span>
          </div>
          <div class="adm-row__actions">
            <button type="button" class="adm-action" @click="openEdit(teacher)">
              <i class="fa-solid fa-pen"></i>
              Editar
            </button>
            <button
              type="button"
              class="adm-action"
              :disabled="busy"
              @click="
                patch(
                  teacher,
                  { isPublished: !teacher.isPublished },
                  teacher.isPublished ? 'Oculto' : 'Publicado',
                )
              "
            >
              <i class="fa-solid" :class="teacher.isPublished ? 'fa-eye-slash' : 'fa-eye'"></i>
              {{ teacher.isPublished ? 'Ocultar' : 'Publicar' }}
            </button>
            <button
              type="button"
              class="adm-action adm-action--danger adm-action--icon"
              aria-label="Borrar profesor"
              @click="toDelete = teacher"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </AdminState>

    <AdminModal
      :open="open"
      :title="editing ? 'Editar profesor' : 'Nuevo profesor'"
      @close="open = false"
    >
      <form id="teacher-form" class="adm-form" novalidate @submit.prevent="save">
        <ImageUploader
          v-model="form.photo"
          folder="profesores"
          label="Foto"
          help="Vertical o cuadrada, con la cara centrada."
        />
        <AdminField label="Nombre" for="teacher-name" required>
          <input id="teacher-name" v-model="form.name" type="text" />
        </AdminField>
        <AdminField label="Rol" for="teacher-role" help="Ej.: Director, Profesora de bachata.">
          <input id="teacher-role" v-model="form.role" type="text" />
        </AdminField>
        <AdminField label="Biografía" for="teacher-bio" help="Unas líneas sobre su trayectoria.">
          <textarea id="teacher-bio" v-model="form.bio" rows="4"></textarea>
        </AdminField>
        <div class="adm-form__row">
          <AdminField
            label="Instagram"
            for="teacher-instagram"
            help="Solo el usuario, sin la arroba."
          >
            <input
              id="teacher-instagram"
              v-model="form.instagram"
              type="text"
              autocapitalize="none"
              placeholder="mambosondance"
            />
          </AdminField>
          <AdminField label="Orden" for="teacher-order" help="1 sale primero.">
            <input
              id="teacher-order"
              v-model.number="form.order"
              type="number"
              inputmode="numeric"
              min="0"
              step="1"
            />
          </AdminField>
        </div>
        <AdminSwitch
          v-model="form.isFounder"
          label="Es fundador"
          help="Sale destacado en la página de la academia."
        />
        <AdminSwitch
          v-model="form.isPublished"
          label="Publicado"
          help="Apagado, no aparece en el sitio."
        />
      </form>
      <template #footer>
        <button type="button" class="btn btn--ghost" @click="open = false">Cancelar</button>
        <button type="submit" form="teacher-form" class="btn btn--primary" :disabled="busy">
          {{ busy ? 'Guardando…' : 'Guardar' }}
        </button>
      </template>
    </AdminModal>

    <ConfirmDialog
      :open="Boolean(toDelete)"
      :title="`¿Borrar a ${toDelete?.name}?`"
      message="Deja de aparecer en el sitio. No se puede deshacer."
      confirm-label="Sí, borrar"
      :busy="busy"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>
