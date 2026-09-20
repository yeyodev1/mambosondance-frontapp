<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { studentCopy } from '@/config/student'
import type { CheckoutNoticeKind } from '@/composables/useCheckout'

// Dos situaciones en las que no tiene sentido mostrar la Cajita: los pagos aún no
// están habilitados (503) o el pedido choca con algo (409: ya hay acceso, sin stock).
const props = defineProps<{ kind: CheckoutNoticeKind; message: string; whatsapp?: string }>()

const copy = studentCopy.checkout
const phone = computed(() => props.whatsapp || site.whatsapp)
</script>

<template>
  <section class="notice" role="alert">
    <template v-if="kind === 'unavailable'">
      <img class="notice__mark" :src="site.logos.iso" alt="" />
      <h2 class="notice__title">{{ copy.unavailableTitle }}</h2>
      <p class="notice__text">{{ copy.unavailableText }}</p>
      <div class="notice__actions">
        <a
          v-if="phone"
          class="btn btn--primary"
          :href="whatsappLink(copy.whatsappMessage, phone)"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp"></i> Escríbenos por WhatsApp
        </a>
        <RouterLink class="btn btn--ghost" to="/carrito">Volver al carrito</RouterLink>
      </div>
    </template>

    <template v-else>
      <i class="notice__icon fa-solid fa-circle-info" aria-hidden="true"></i>
      <h2 class="notice__title">No pudimos crear tu pedido</h2>
      <p class="notice__text">{{ message }}</p>
      <div class="notice__actions">
        <RouterLink class="btn btn--primary" to="/carrito">Volver al carrito</RouterLink>
        <RouterLink class="btn btn--ghost" to="/cuenta?tab=clases">Ver mis clases</RouterLink>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.notice {
  @include flex(column, center, center, 0.9rem);
  text-align: center;
  padding: $space-xl 1.25rem;
  background: $sand;
  border-radius: $radius-lg;

  &__mark {
    width: 72px;
  }

  &__icon {
    font-size: 1.8rem;
    color: $accent;
  }

  &__title {
    @include display($display-sm, 600);
    max-width: 18ch;
  }

  &__text {
    max-width: 48ch;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }
}
</style>
