<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import OrderSummary, { type SummaryLine } from '@/components/checkout/OrderSummary.vue'
import TicketCodes from '@/components/checkout/TicketCodes.vue'
import { usePaymentResult } from '@/composables/usePaymentResult'
import { orderService } from '@/services/order.service'
import { site } from '@/config/site'
import { studentCopy } from '@/config/student'

const copy = studentCopy.payment
const { state, message, order, tickets, hasCourses, hasPhysical, confirm } = usePaymentResult()
const shippingNote = ref('')

const lines = computed<SummaryLine[]>(() =>
  (order.value?.items ?? []).map((item, i) => ({
    key: `${i}-${item.title}`,
    title: item.title,
    subtitle: Object.values(item.selectedOptions || {}).join(' · '),
    quantity: item.quantity,
    totalCents: item.unitCents * item.quantity,
    image: item.image,
  })),
)

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

    <div v-else-if="state === 'paid' && order" class="result__box">
      <i class="result__icon result__icon--ok fa-solid fa-circle-check" aria-hidden="true"></i>
      <h1 class="result__title">
        {{ copy.paidTitle }} <span class="result__script">{{ copy.paidScript }}</span>
      </h1>
      <p class="result__text">{{ copy.paidText }} Pedido {{ order.number }}.</p>

      <div class="result__actions">
        <RouterLink v-if="hasCourses" class="btn btn--primary" to="/cuenta?tab=clases">
          Ir a mis clases
        </RouterLink>
        <RouterLink v-if="tickets.length" class="btn btn--primary" to="/cuenta?tab=entradas">
          Ver mis entradas
        </RouterLink>
        <RouterLink class="btn btn--ghost" to="/cuenta?tab=pedidos">Ver mis pedidos</RouterLink>
      </div>

      <div class="result__details">
        <TicketCodes v-if="tickets.length" :tickets="tickets" />

        <p v-if="hasPhysical" class="result__shipping">
          <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
          <span>
            <strong>Envío a {{ order.shipping?.city || 'tu dirección' }}.</strong>
            {{ shippingNote || 'Te avisaremos por correo cuando tu pedido salga.' }}
          </span>
        </p>

        <OrderSummary
          :lines="lines"
          :heading="`Pedido ${order.number}`"
          :total-cents="order.totalCents"
          :discount-cents="order.discountCents"
          total-label="Total pagado"
        />
      </div>
    </div>

    <div v-else-if="state === 'error'" class="result__box" role="alert">
      <i class="result__icon fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
      <h1 class="result__title">{{ copy.errorTitle }}</h1>
      <p class="result__text">{{ copy.errorText }}</p>
      <p v-if="message" class="result__message">{{ message }}</p>
      <div class="result__actions">
        <button class="btn btn--primary" type="button" @click="confirm">
          Reintentar confirmación
        </button>
        <RouterLink class="btn btn--ghost" to="/cuenta?tab=pedidos">Ver mis pedidos</RouterLink>
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

    &--ok {
      color: $success;
    }
  }

  &__title {
    @include display($display-sm);
  }

  &__script {
    @include script($display-sm);
    color: $accent;
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

  &__details {
    @include flex(column, stretch, flex-start, $space-md);
    width: 100%;
    margin-top: $space-md;
    text-align: left;
  }

  &__shipping {
    @include flex(row, flex-start, flex-start, 0.7rem);
    padding: 1rem;
    font-size: $text-sm;
    background: $sand;
    border-radius: $radius-sm;
    white-space: pre-line;

    i {
      margin-top: 0.3rem;
      color: $accent-deep;
    }
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
