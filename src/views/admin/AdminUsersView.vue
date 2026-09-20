<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchInput from '@/components/admin/SearchInput.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import { usePagedList } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import { formatDate } from '@/utils/format'

const q = ref('')

const { items, page, pages, total, loading, error, load, reload } = usePagedList((target) =>
  adminService.users({ q: q.value, page: target }),
)

watch(q, () => load(1), { immediate: true })
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader title="Alumnos" subtitle="Todas las personas con cuenta en la web.">
      <RouterLink :to="{ name: 'AdminAccess' }" class="btn btn--primary">
        <i class="fa-solid fa-key"></i>
        Dar acceso
      </RouterLink>
    </AdminPageHeader>

    <SearchInput v-model="q" placeholder="Buscar por nombre o correo…" />

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!items.length"
      empty-icon="fa-solid fa-users"
      :empty-title="q ? 'Nadie coincide con esa búsqueda' : 'Todavía no hay alumnos'"
      :empty-text="
        q
          ? 'Prueba con otra parte del nombre o del correo.'
          : 'Aparecen aquí cuando se registran, compran o les das un acceso.'
      "
      @retry="reload"
    >
      <template #empty-action>
        <RouterLink v-if="!q" :to="{ name: 'AdminAccess' }" class="btn btn--primary">
          Dar el primer acceso
        </RouterLink>
      </template>

      <ul class="adm-list">
        <li v-for="user in items" :key="user.id" class="adm-row">
          <div class="adm-row__main">
            <p class="adm-row__title">
              {{ user.name || 'Sin nombre' }}
              <StatusChip v-if="user.accountType === 'admin'" label="Equipo" tone="info" />
            </p>
            <p class="adm-row__meta">{{ user.email }}</p>
            <p v-if="user.phone" class="adm-help">Tel. {{ user.phone }}</p>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Accesos</span>
            <span><i class="fa-solid fa-key"></i> {{ user.accessCount }}</span>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Sellos</span>
            <span><i class="fa-solid fa-stamp"></i> {{ user.stamps }}</span>
          </div>
          <div class="adm-row__cell">
            <span class="adm-row__label">Desde</span>
            <span>{{ formatDate(user.createdAt) }}</span>
          </div>
          <div class="adm-row__actions">
            <RouterLink
              :to="{ name: 'AdminUserDetail', params: { id: user.id } }"
              class="adm-action"
            >
              <i class="fa-solid fa-user"></i>
              Ver ficha
            </RouterLink>
          </div>
        </li>
      </ul>
      <Pagination :page="page" :pages="pages" :total="total" @change="load" />
    </AdminState>
  </div>
</template>
