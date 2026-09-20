<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { whatsappLink } from '@/config/site'
import { useSettingsStore } from '@/stores/settings'

// Solo en las páginas de marca y listados: en un detalle, el carrito o el pago
// taparía justo el botón de comprar.
const PAGES = ['Home', 'Academy', 'Teachers', 'Courses', 'Events', 'Shop', 'Contact']

const route = useRoute()
const settings = useSettingsStore()
const href = computed(() =>
  settings.whatsapp && PAGES.includes(String(route.name))
    ? whatsappLink(undefined, settings.whatsapp)
    : '',
)
</script>

<template>
  <Transition name="fade">
    <a
      v-if="href"
      class="fab"
      :href="href"
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
    >
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  </Transition>
</template>

<style scoped lang="scss">
.fab {
  @include flex(row, center, center);
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  z-index: 80;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $accent;
  color: $surface;
  font-size: 1.6rem;
  box-shadow: 0 12px 30px rgba($night, 0.35);
  @include transition(transform);

  &:hover {
    transform: translateY(-3px) scale(1.04);
  }

  @include from('md') {
    right: 1.75rem;
    bottom: 1.75rem;
  }
}
</style>
