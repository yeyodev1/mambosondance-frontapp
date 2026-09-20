<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MyCoursesTab from '@/components/account/MyCoursesTab.vue'
import MyTicketsTab from '@/components/account/MyTicketsTab.vue'
import LoyaltyTab from '@/components/account/LoyaltyTab.vue'
import MyOrdersTab from '@/components/account/MyOrdersTab.vue'
import ProfileTab from '@/components/account/ProfileTab.vue'
import { useUserStore } from '@/stores/user'
import { studentCopy } from '@/config/student'

const tabs = [
  { id: 'clases', label: 'Mis clases', icon: 'fa-solid fa-play', component: MyCoursesTab },
  { id: 'entradas', label: 'Entradas', icon: 'fa-solid fa-ticket', component: MyTicketsTab },
  { id: 'fidelidad', label: 'Tarjeta', icon: 'fa-solid fa-stamp', component: LoyaltyTab },
  { id: 'pedidos', label: 'Pedidos', icon: 'fa-solid fa-bag-shopping', component: MyOrdersTab },
  { id: 'perfil', label: 'Perfil', icon: 'fa-solid fa-user', component: ProfileTab },
] as const

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// La pestaña vive en la URL: se puede enlazar desde correos y el "atrás" funciona.
const active = computed(() => tabs.find((tab) => tab.id === route.query.tab) ?? tabs[0])
const firstName = computed(() => (userStore.user?.name || '').trim().split(/\s+/)[0])

function select(id: string) {
  router.replace({ query: { ...route.query, tab: id } })
}
</script>

<template>
  <section class="account">
    <header class="account__head">
      <p class="account__eyebrow">{{ studentCopy.account.eyebrow }}</p>
      <h1 class="account__title">
        Hola<template v-if="firstName"
          >, <span class="account__script">{{ firstName }}</span>
        </template>
      </h1>
      <RouterLink v-if="userStore.isAdmin" class="account__admin" to="/admin">
        <i class="fa-solid fa-gear"></i> Ir al panel de administración
      </RouterLink>
    </header>

    <!-- El scroll horizontal queda dentro de la barra: la página nunca desborda. -->
    <nav class="account__tabs" aria-label="Secciones de mi cuenta">
      <div class="account__tablist" role="tablist">
        <button
          v-for="tab in tabs"
          :id="`tab-${tab.id}`"
          :key="tab.id"
          class="account__tab"
          :class="{ 'account__tab--active': tab.id === active.id }"
          type="button"
          role="tab"
          :aria-selected="tab.id === active.id"
          @click="select(tab.id)"
        >
          <i :class="tab.icon" aria-hidden="true"></i> {{ tab.label }}
        </button>
      </div>
    </nav>

    <div class="account__panel" role="tabpanel" :aria-labelledby="`tab-${active.id}`">
      <component :is="active.component" :key="active.id" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.account {
  @include container(1080px);
  padding-block: $space-xl;
  min-width: 0;

  &__head {
    @include flex(column, flex-start, flex-start, 0.4rem);
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
    overflow-wrap: anywhere;
  }

  &__script {
    @include script($display-sm);
    color: $accent;
  }

  &__admin {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;
  }

  &__tabs {
    // El sangrado negativo lleva la barra de borde a borde en móvil sin ensanchar
    // la página: el overflow se queda en este elemento.
    margin-inline: -1.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    border-bottom: 1px solid $line;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      margin-inline: 0;
    }
  }

  &__tablist {
    @include flex(row, stretch, flex-start, 0.25rem);
    width: max-content;
    padding-inline: 1.25rem;

    @include from('md') {
      padding-inline: 0;
    }
  }

  &__tab {
    @include flex(row, center, center, 0.5rem);
    min-height: 48px;
    padding: 0.6rem 0.9rem;
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
    color: $ink-soft;
    border-bottom: 2px solid transparent;
    @include transition(color);

    &:hover {
      color: $ink;
    }

    &--active {
      color: $accent;
      border-color: $accent;
    }
  }

  &__panel {
    padding-top: $space-md;
    min-width: 0;
  }
}
</style>
