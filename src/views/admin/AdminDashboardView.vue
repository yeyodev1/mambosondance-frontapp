<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import { quickActions } from '@/composables/admin/nav'
import { useResource } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import { useUserStore } from '@/stores/user'
import { formatCents } from '@/utils/format'

const userStore = useUserStore()
const { data, loading, error, load } = useResource(() => adminService.dashboard())

const firstName = computed(() => (userStore.user?.name || '').split(' ')[0])

const metrics = computed(() => {
  const d = data.value
  if (!d) return []
  return [
    {
      label: 'Ventas (30 días)',
      value: formatCents(d.salesCents30d),
      icon: 'fa-solid fa-sack-dollar',
      to: 'AdminOrders',
    },
    {
      label: 'Pedidos (30 días)',
      value: String(d.orders30d),
      icon: 'fa-solid fa-receipt',
      to: 'AdminOrders',
    },
    { label: 'Alumnos', value: String(d.students), icon: 'fa-solid fa-users', to: 'AdminUsers' },
    {
      label: 'Accesos vigentes',
      value: String(d.activeAccesses),
      icon: 'fa-solid fa-key',
      to: 'AdminAccess',
    },
    {
      label: 'Eventos por venir',
      value: String(d.upcomingEvents),
      icon: 'fa-solid fa-calendar-days',
      to: 'AdminEvents',
    },
    {
      label: 'Envíos pendientes',
      value: String(d.pendingFulfillment),
      icon: 'fa-solid fa-box',
      to: 'AdminOrders',
      alert: d.pendingFulfillment > 0,
    },
  ]
})

onMounted(load)
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      :title="firstName ? `Hola, ${firstName}` : 'Inicio'"
      subtitle="Desde aquí manejas las clases, los eventos, la tienda y a tus alumnos."
    />

    <AdminCard title="¿Qué quieres hacer?">
      <ul class="quick">
        <li v-for="action in quickActions" :key="action.name">
          <RouterLink :to="{ name: action.name }" class="quick__link">
            <span class="quick__icon"><i :class="action.icon"></i></span>
            <span class="quick__text">
              <span class="quick__label">{{ action.label }}</span>
              <span class="quick__hint">{{ action.hint }}</span>
            </span>
            <i class="fa-solid fa-chevron-right quick__arrow"></i>
          </RouterLink>
        </li>
      </ul>
    </AdminCard>

    <AdminCard title="Cómo va la academia" hint="Resumen de los últimos 30 días.">
      <AdminState :loading="loading" :error="error" @retry="load">
        <ul class="metrics">
          <li v-for="metric in metrics" :key="metric.label">
            <RouterLink
              :to="{ name: metric.to }"
              class="metrics__item"
              :class="{ 'metrics__item--alert': metric.alert }"
            >
              <i :class="metric.icon" class="metrics__icon"></i>
              <span class="metrics__value">{{ metric.value }}</span>
              <span class="metrics__label">{{ metric.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </AdminState>
    </AdminCard>
  </div>
</template>

<style scoped lang="scss">
.quick {
  list-style: none;
  @include flex-cards(260px, 0.6rem);

  &__link {
    @include flex(row, center, flex-start, 0.85rem);
    min-height: 68px;
    padding: 0.75rem 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    @include transition(border-color);

    &:hover {
      border-color: $accent;
    }
  }

  &__icon {
    flex: 0 0 auto;
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent;
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.05rem);
    flex: 1 1 auto;
    min-width: 0;
  }

  &__label {
    font-weight: 700;
    color: $ink;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.35;
  }

  &__arrow {
    color: $ink-muted;
    font-size: 0.8rem;
  }
}

.metrics {
  list-style: none;
  @include flex-cards(140px, 0.6rem);

  &__item {
    @include flex(column, flex-start, flex-start, 0.2rem);
    height: 100%;
    padding: 0.9rem;
    border-radius: $radius-sm;
    background: $sand;

    &--alert {
      background: $warning-bg;
    }
  }

  &__icon {
    color: $accent;
  }

  &__value {
    font-family: $font-display;
    font-size: $display-sm;
    font-weight: 700;
    line-height: 1.1;
    color: $ink;
    overflow-wrap: anywhere;
  }

  &__label {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.3;
  }
}
</style>
