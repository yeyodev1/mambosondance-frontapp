<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { useSettingsStore } from '@/stores/settings'

defineProps<{
  open: boolean
  accountLabel: string
  accountTo: string
  isAdmin: boolean
}>()

const settings = useSettingsStore()
</script>

<template>
  <Transition name="menu">
    <div v-if="open" id="menu-movil" class="menu" role="dialog" aria-modal="true" aria-label="Menú">
      <nav class="menu__nav" aria-label="Principal">
        <RouterLink
          v-for="(link, index) in site.nav"
          :key="link.to"
          :to="link.to"
          class="menu__link"
          :style="{ '--i': index }"
        >
          <span class="menu__index">0{{ index + 1 }}</span>
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="menu__foot">
        <div class="menu__account">
          <RouterLink :to="accountTo" class="btn btn--light btn--block">{{
            accountLabel
          }}</RouterLink>
          <RouterLink v-if="isAdmin" to="/admin" class="btn btn--outline-light btn--block">
            Panel
          </RouterLink>
          <RouterLink to="/contacto" class="menu__minor">Contacto</RouterLink>
        </div>

        <div v-if="settings.whatsapp || settings.instagram" class="menu__social">
          <a
            v-if="settings.whatsapp"
            :href="whatsappLink(undefined, settings.whatsapp)"
            target="_blank"
            rel="noopener"
            aria-label="WhatsApp"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          </a>
          <a
            v-if="settings.instagram"
            :href="settings.instagram"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <i class="fa-brands fa-instagram" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.menu {
  @include flex(column, stretch, space-between, 2rem);
  position: fixed;
  inset: 0;
  z-index: 99;
  padding: calc(64px + 1.5rem) 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px));
  background: radial-gradient(circle at 100% 0%, rgba($accent-deep, 0.55), transparent 55%), $night;
  color: $on-dark;
  overflow-y: auto;

  @include from('lg') {
    display: none;
  }

  &__nav {
    @include flex(column, stretch);
  }

  &__link {
    @include display(clamp(2rem, 9.5vw, 3.2rem));
    @include flex(row, baseline, flex-start, 0.9rem);
    padding-block: 0.7rem;
    border-bottom: 1px solid $line-dark;
    color: $on-dark;
    animation: menu-link 0.7s $ease both;
    animation-delay: calc(var(--i) * 60ms + 120ms);

    &.router-link-active {
      color: $accent;
    }
  }

  &__index {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: $on-dark-soft;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 1.5rem);
  }

  &__account {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__minor {
    @include flex(row, center, center);
    min-height: 44px;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $on-dark-soft;
  }

  &__social {
    @include flex(row, center, center, 0.5rem);

    a {
      @include flex(row, center, center);
      width: 48px;
      height: 48px;
      font-size: 1.35rem;
      color: $on-dark;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.35s ease,
    clip-path 0.55s $ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
}

.menu-enter-to,
.menu-leave-from {
  clip-path: inset(0 0 0 0);
}

@keyframes menu-link {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}
</style>
