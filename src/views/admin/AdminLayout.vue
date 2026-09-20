<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminNav from '@/components/admin/AdminNav.vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useUserStore } from '@/stores/user'
// Estilos compartidos del panel: se cargan una sola vez, con el chunk del admin.
import '@/components/admin/admin.scss'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const drawerOpen = ref(false)
useBodyScroll(drawerOpen)

// Al cambiar de sección el drawer se cierra solo.
watch(
  () => route.fullPath,
  () => (drawerOpen.value = false),
)

function logout() {
  userStore.clear()
  router.replace({ name: 'Login' })
}
</script>

<template>
  <div class="admin">
    <header class="admin__topbar">
      <button
        type="button"
        class="admin__menu"
        aria-label="Abrir el menú"
        :aria-expanded="drawerOpen"
        @click="drawerOpen = true"
      >
        <i class="fa-solid fa-bars"></i>
      </button>
      <RouterLink :to="{ name: 'AdminDashboard' }" class="admin__brand">
        <img src="/brand/logo-horizontal-blanco.svg" alt="MamboSon" class="admin__logo" />
      </RouterLink>
      <span class="admin__tag">Panel</span>
    </header>

    <Transition name="fade">
      <div v-if="drawerOpen" class="admin__backdrop" @click="drawerOpen = false"></div>
    </Transition>

    <aside class="admin__sidebar" :class="{ 'admin__sidebar--open': drawerOpen }">
      <div class="admin__sidebar-head">
        <RouterLink :to="{ name: 'AdminDashboard' }" class="admin__brand">
          <img src="/brand/logo-horizontal-blanco.svg" alt="MamboSon" class="admin__logo" />
        </RouterLink>
        <button
          type="button"
          class="admin__menu admin__menu--close"
          aria-label="Cerrar el menú"
          @click="drawerOpen = false"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <AdminNav
        :user-name="userStore.user?.name || userStore.user?.email || ''"
        @navigate="drawerOpen = false"
        @logout="logout"
      />
    </aside>

    <div class="admin__content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
$sidebar: 260px;
$topbar: 60px;

.admin {
  flex: 1;
  @include flex(column, stretch);
  min-height: 100vh;
  background: $paper;

  &__topbar {
    position: sticky;
    top: 0;
    z-index: 90;
    @include flex(row, center, flex-start, 0.5rem);
    height: $topbar;
    padding: 0 0.75rem;
    background: $night;
    color: $on-dark;

    @include from('lg') {
      display: none;
    }
  }

  &__menu {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    font-size: 1.2rem;
    color: $on-dark;

    &:hover {
      background: $line-dark;
    }

    &--close {
      @include from('lg') {
        display: none;
      }
    }
  }

  &__brand {
    @include flex(row, center);
  }

  &__logo {
    height: 26px;
    width: auto;
  }

  &__tag {
    margin-left: auto;
    padding: 0.15rem 0.6rem;
    border: 1px solid $line-dark;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: $on-dark-soft;
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: $overlay;

    @include from('lg') {
      display: none;
    }
  }

  &__sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 110;
    @include flex(column, stretch);
    width: min(#{$sidebar + 30px}, 86vw);
    background: $night;
    color: $on-dark;
    transform: translateX(-100%);
    visibility: hidden;
    transition:
      transform 0.3s $ease,
      visibility 0.3s;

    &--open {
      transform: translateX(0);
      visibility: visible;
    }

    @include from('lg') {
      width: $sidebar;
      transform: none;
      visibility: visible;
    }

    @include reduced-motion {
      transition: none;
    }
  }

  &__sidebar-head {
    @include flex(row, center, space-between, 0.5rem);
    flex: 0 0 auto;
    height: $topbar;
    padding: 0 0.75rem 0 1.25rem;
    border-bottom: 1px solid $line-dark;

    @include from('lg') {
      height: 76px;
    }
  }

  &__content {
    flex: 1 1 auto;
    @include flex(column, stretch, flex-start, 1.25rem);
    width: 100%;
    min-width: 0;
    padding: 1.25rem 1rem 4rem;

    @include from('md') {
      padding: 2rem 2rem 4rem;
    }

    @include from('lg') {
      width: auto;
      max-width: 1180px;
      margin-left: $sidebar;
      padding: 2.5rem 3rem 5rem;
    }
  }
}
</style>
