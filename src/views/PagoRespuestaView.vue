<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PaymentSuccess from '@/components/checkout/PaymentSuccess.vue'
import { usePaymentResult } from '@/composables/usePaymentResult'
import { orderService } from '@/services/order.service'
import { site } from '@/config/site'
import { studentCopy } from '@/config/student'

const copy = studentCopy.payment
const {
  state,
  message,
  order,
  tickets,
  courses,
  hasPhysical,
  email,
  accountCreated,
  hasSession,
  confirm,
} = usePaymentResult()
const shippingNote = ref('')

// La confirmación sale apenas carga la vista, sin clics: Payphone reversa el cobro
// a los 5 minutos si nadie lo confirma.
onMounted(async () => {
  await confirm()
  if (state.value === 'paid' && hasPhysical.value) {
    try {
      shippingNote.value = (await orderService.publicSettings()).shippingNote
    } catch {
      // La nota es informativa; el pedido ya está confirmado.
    }
  }
})
</script>

<template>
  <section class="result">
    <div v-if="state === 'confirming'" class="result__box" role="status">
      <img class="result__mark result__mark--pulse" :src="site.logos.iso" alt="" />
      <h1 class="result__title">{{ copy.confirmingTitle }}</h1>
      <p class="result__text">{{ copy.confirmingText }}</p>
    </div>

    <PaymentSuccess
      v-else-if="state === 'paid' && order"
      :order="order"
      :tickets="tickets"
      :courses="courses"
      :has-physical="hasPhysical"
      :email="email"
      :account-created="accountCreated"
      :has-session="hasSession"
      :shipping-note="shippingNote"
    />

    <div v-else-if="state === 'error'" class="result__box" role="alert">
      <i class="result__icon fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <h1 class="result__title">{{ copy.errorTitle }}</h1>
      <p class="result__text">{{ copy.errorText }}</p>
      <p v-if="message" class="result__message">{{ message }}</p>
      <div class="result__actions">
        <button class="btn btn--primary" type="button" @click="confirm">
          Reintentar confirmación
        </button>
        <!-- Sin sesión no hay "mis pedidos": la salida es buscar la compra por correo. -->
        <RouterLink v-if="hasSession" class="btn btn--ghost" to="/cuenta?tab=pedidos">
          Ver mis pedidos
        </RouterLink>
        <RouterLink v-else class="btn btn--ghost" :to="{ name: 'FindPurchase' }">
          {{ copy.helpLink }}
        </RouterLink>
      </div>
    </div>

    <div v-else class="result__box" role="alert">
      <i class="result__icon fa-regular fa-circle-xmark" aria-hidden="true"></i>
      <h1 class="result__title">
        {{ state === 'canceled' ? copy.canceledTitle : copy.failedTitle }}
      </h1>
      <p class="result__text">
        {{ message || (state === 'canceled' ? copy.canceledText : copy.failedText) }}
      </p>
      <div class="result__actions">
        <RouterLink class="btn btn--primary" to="/carrito">Reintentar</RouterLink>
        <RouterLink class="btn btn--ghost" to="/">Volver al inicio</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.result {
  @include container(720px);
  @include flex(column, stretch, center);
  flex: 1;
  padding-block: $space-xl;

  &__box {
    @include flex(column, center, flex-start, 0.9rem);
    text-align: center;
  }

  &__mark {
    width: 84px;

    &--pulse {
      animation: result-pulse 1.4s ease-in-out infinite;
    }
  }

  &__icon {
    font-size: 2.4rem;
    color: $accent;
  }

  &__title {
    @include display($display-sm);
  }

  &__text {
    max-width: 50ch;
    color: $ink-soft;
  }

  &__message {
    font-size: $text-sm;
    color: $danger;
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }
}

@keyframes result-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.94);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
