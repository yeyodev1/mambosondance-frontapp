<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AccessGrantForm from '@/components/admin/AccessGrantForm.vue'
import AccessList from '@/components/admin/AccessList.vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import Pagination from '@/components/admin/Pagination.vue'
import { accessStatusChip } from '@/composables/admin/labels'
import { usePagedList } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import type { AccessStatus, Product } from '@/types'

const route = useRoute()
// Desde la ficha de un alumno se llega con ?email= para no volver a escribirlo.
const initialEmail = typeof route.query.email === 'string' ? route.query.email : ''

const product = ref('')
const status = ref<AccessStatus | ''>('')
const courses = ref<Product[]>([])

const { items, page, pages, total, loading, error, load, reload } = usePagedList((target) =>
  adminService.accesses({ product: product.value, status: status.value, page: target }),
)

watch([product, status], () => load(1), { immediate: true })

onMounted(async () => {
  try {
    courses.value = (await adminService.products({ type: 'course', limit: 100 })).items
  } catch {
    // Sin la lista de clases el filtro queda en "todas"; el listado sigue funcionando.
  }
})
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Dar acceso"
      subtitle="Ábrele una clase a un alumno sin que tenga que pagar en la web: alumnos presenciales, cortesías, canjes."
    />

    <AdminCard title="Nuevo acceso" icon="fa-solid fa-key">
      <AccessGrantForm :initial-email="initialEmail" @granted="load(1)" />
    </AdminCard>

    <AdminCard
      title="Accesos dados"
      hint="Todos los accesos: por compra, dados por el equipo y premios."
    >
      <div class="adm-toolbar">
        <select v-model="product" aria-label="Filtrar por clase">
          <option value="">Todas las clases</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.title }}
          </option>
        </select>
        <select v-model="status" aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          <option v-for="(chip, key) in accessStatusChip" :key="key" :value="key">
            {{ chip.label }}
          </option>
        </select>
      </div>

      <AdminState
        :loading="loading"
        :error="error"
        :empty="!items.length"
        empty-icon="fa-solid fa-key"
        empty-title="No hay accesos con esos filtros"
        empty-text="Cuando des un acceso o alguien compre una clase, aparece aquí."
        @retry="reload"
      >
        <AccessList :accesses="items" @changed="reload" />
        <Pagination :page="page" :pages="pages" :total="total" @change="load" />
      </AdminState>
    </AdminCard>
  </div>
</template>
