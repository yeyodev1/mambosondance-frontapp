<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useScrolled } from '@/composables/useScrolled'
import TheMobileMenu from './TheMobileMenu.vue'

const route = useRoute()
const userStore = useUserStore()
const cart = useCartStore()
const mobileOpen = ref(false)
const scrolled = useScrolled(24)

useBodyScroll(mobileOpen)

// Solo el home tiene un hero a sangre bajo el header; en el resto va sólido
// y un separador reserva su altura.
const isHome = computed(() => route.name === 'Home')
const overlay = computed(() => isHome.value && !scrolled.value && !mobileOpen.value)

const accountLink = computed(() =>
  userStore.isAuthenticated
    ? { label: 'Mi cuenta', to: '/cuenta', icon: 'fa-regular fa-user' }
    : { label: 'Ingresar', to: '/login', icon: 'fa-regular fa-user' },
)

watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
)

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') mobileOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  // Las rutas públicas no pasan por el guard que restaura la sesión.
  if (userStore.hasToken) userStore.restore()
})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="header" :class="{ 'header--overlay': overlay, 'header--menu': mobileOpen }">
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="`${site.name}, inicio`">
        <img :src="site.logos.horizontalWhite" :alt="site.name" width="182" height="30" />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <RouterLink v-if="userStore.isAdmin" to="/admin" class="header__link header__link--desk">
          Panel
        </RouterLink>
        <RouterLink :to="accountLink.to" class="header__link header__link--desk">
          {{ accountLink.label }}
        </RouterLink>

        <RouterLink
          to="/carrito"
          class="header__icon"
          :aria-label="`Carrito, ${cart.count} artículos`"
        >
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <span v-if="cart.count > 0" class="header__badge">{{
            cart.count > 99 ? '99+' : cart.count
          }}</span>
        </RouterLink>

        <button
          type="button"
          class="header__icon header__burger"
          :aria-label="mobileOpen ? 'Cerrar menú' : 'Abrir menú'"
          :aria-expanded="mobileOpen"
          aria-controls="menu-movil"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="header__bars" :class="{ 'header__bars--open': mobileOpen }"></span>
        </button>
      </div>
    </div>
  </header>

  <TheMobileMenu
    :open="mobileOpen"
    :account-label="accountLink.label"
    :account-to="accountLink.to"
    :is-admin="userStore.isAdmin"
  />

  <div v-if="!isHome" class="header-spacer" aria-hidden="true"></div>
</template>

<style scoped lang="scss">
$bar-height: 64px;
$bar-height-lg: 78px;

.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  background: $night;
  border-bottom: 1px solid $line-dark;
  color: $on-dark;
  transition:
    background-color 0.4s ease,
    border-color 0.4s ease;

  &--overlay {
    background: transparent;
    border-color: transparent;

    // Un velo mínimo para que el logo se lea sobre cualquier foto.
    &::before {
      content: '';
      position: absolute;
      inset: 0 0 -2rem;
      background: linear-gradient(rgba($night, 0.6), transparent);
      pointer-events: none;
    }
  }

  &--menu {
    border-color: transparent;
  }

  &__inner {
    @include container(1320px);
    @include flex(row, center, space-between, 1rem);
    position: relative;
    height: $bar-height;

    @include from('lg') {
      height: $bar-height-lg;
    }
  }

  &__logo {
    @include flex(row, center);
    flex: 0 0 auto;
    min-height: 44px;

    img {
      width: 150px;
      height: auto;

      @include from('lg') {
        width: 182px;
      }
    }
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 2rem);
      flex: 1;
    }
  }

  &__link {
    position: relative;
    padding-block: 0.75rem;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $on-dark-soft;
    white-space: nowrap;
    @include transition(color);

    &::after {
      content: '';
      position: absolute;
      inset: auto 0 0.4rem;
      height: 1px;
      background: $accent;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.45s $ease;
    }

    &:hover,
    &.router-link-active {
      color: $on-dark;

      &::after {
        transform: scaleX(1);
      }
    }

    &--desk {
      display: none;

      @include from('lg') {
        display: block;
      }
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.25rem);

    @include from('lg') {
      gap: 1.5rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    position: relative;
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
    color: $on-dark;
  }

  &__badge {
    @include flex(row, center, center);
    position: absolute;
    top: 3px;
    right: 0;
    min-width: 18px;
    height: 18px;
    padding-inline: 4px;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
  }

  &__burger {
    @include from('lg') {
      display: none;
    }
  }

  // Dos barras que se cruzan: más fino que el ícono de hamburguesa.
  &__bars {
    position: relative;
    width: 24px;
    height: 12px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: currentColor;
      transition: transform 0.4s $ease;
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }

    &--open::before {
      transform: translateY(5px) rotate(45deg);
    }

    &--open::after {
      transform: translateY(-5px) rotate(-45deg);
    }
  }
}

.header-spacer {
  flex: 0 0 auto;
  height: $bar-height;

  @include from('lg') {
    height: $bar-height-lg;
  }
}
</style>
