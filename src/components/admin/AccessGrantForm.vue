<script setup lang="ts">
import { onMounted } from 'vue'
import AdminField from './AdminField.vue'
import ExpiryChoice from './ExpiryChoice.vue'
import { useAccessGrant } from '@/composables/admin/useAccessGrant'

const props = defineProps<{ initialEmail?: string }>()
const emit = defineEmits<{ granted: [] }>()

const {
  form,
  courses,
  coursesLoading,
  coursesError,
  busy,
  ready,
  missing,
  expiryKey,
  loadCourses,
  toggle,
  submit,
} = useAccessGrant(() => emit('granted'), props.initialEmail)

onMounted(loadCourses)
</script>

<template>
  <form class="adm-form" novalidate @submit.prevent="submit">
    <AdminField
      label="1. Correo del alumno"
      for="grant-email"
      required
      help="Si todavía no tiene cuenta, se la creamos y le llega un correo para poner su contraseña."
    >
      <input
        id="grant-email"
        v-model="form.email"
        type="email"
        inputmode="email"
        autocomplete="off"
        autocapitalize="none"
        placeholder="alumna@correo.com"
      />
    </AdminField>

    <AdminField label="2. ¿A qué clases le das acceso?" required help="Puedes marcar varias.">
      <p v-if="coursesLoading" class="adm-help">
        <i class="fa-solid fa-circle-notch fa-spin"></i> Cargando las clases…
      </p>
      <div v-else-if="coursesError" class="grant__notice">
        <p>No se pudieron cargar las clases.</p>
        <button type="button" class="adm-action" @click="loadCourses">Reintentar</button>
      </div>
      <div v-else-if="!courses.length" class="grant__notice">
        <p>Todavía no hay paquetes de clases.</p>
        <RouterLink
          :to="{ name: 'AdminProductEdit', params: { id: 'nuevo' }, query: { type: 'course' } }"
          class="adm-action"
        >
          Crear el primero
        </RouterLink>
      </div>
      <div v-else class="grant__courses">
        <label
          v-for="course in courses"
          :key="course.id"
          class="adm-option"
          :class="{ 'adm-option--selected': form.productIds.includes(course.id) }"
        >
          <input
            class="visually-hidden"
            type="checkbox"
            :checked="form.productIds.includes(course.id)"
            @change="toggle(course.id)"
          />
          <span class="adm-option__mark adm-option__mark--square">
            <i class="fa-solid fa-check"></i>
          </span>
          <span class="adm-option__text">
            <span>{{ course.title }}</span>
            <span v-if="!course.isPublished" class="adm-help">Oculto en el sitio</span>
          </span>
        </label>
      </div>
    </AdminField>

    <AdminField
      label="3. ¿Hasta cuándo?"
      required
      help="Tienes que elegir una de las dos: así nadie recibe acceso de por vida por descuido."
    >
      <ExpiryChoice :key="expiryKey" v-model="form.expiresAt" name="grant-expiry" />
    </AdminField>

    <AdminField
      label="4. Nota (opcional)"
      for="grant-note"
      help="Solo la ve el equipo. Ej.: «alumna presencial de marzo», «cortesía»."
    >
      <input id="grant-note" v-model="form.note" type="text" maxlength="200" />
    </AdminField>

    <p v-if="missing" class="adm-help grant__missing">
      <i class="fa-solid fa-circle-info"></i>
      {{ missing }}
    </p>
    <button type="submit" class="btn btn--primary btn--block" :disabled="!ready || busy">
      <i class="fa-solid" :class="busy ? 'fa-circle-notch fa-spin' : 'fa-key'"></i>
      {{ busy ? 'Dando acceso…' : 'Dar acceso' }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.grant {
  &__courses {
    @include flex-cards(240px, 0.5rem);
  }

  &__notice {
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding: 0.85rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;
  }

  &__missing {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
