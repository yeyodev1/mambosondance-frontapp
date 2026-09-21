<script setup lang="ts">
import { computed } from 'vue'
import OrderSummary, { type SummaryLine } from '@/components/checkout/OrderSummary.vue'
import TicketCodes from '@/components/checkout/TicketCodes.vue'
import { studentCopy } from '@/config/student'
import type { Order, OrderConfirmation, Ticket } from '@/types'

// Pago confirmado. Quien compra puede no tener sesión (su correo ya tenía cuenta y no
// se le entrega): por eso todo lo importante se dice acá y se repite por correo, y
// ningún botón lleva a una pantalla que exija ingresar sin avisarlo.
const props = defineProps<{
  order: Order
  tickets: Ticket[]
  courses: OrderConfirmation['courses']
  hasPhysical: boolean
  email: string
  accountCreated: boolean
  hasSession: boolean
  shippingNote?: string
}>()

const copy = studentCopy.payment

const firstCourse = computed(() => props.courses[0] ?? null)
const coursePath = computed(() =>
  firstCourse.value ? `/mis-clases/${firstCourse.value.slug}` : '',
)

const lines = computed<SummaryLine[]>(() =>
  props.order.items.map((item, i) => ({
    key: `${i}-${item.title}`,
    title: item.title,
    subtitle: Object.values(item.selectedOptions || {}).join(' · '),
    quantity: item.quantity,
    totalCents: item.unitCents * item.quantity,
    image: item.image,
  })),
)
</script>

<template>
  <div class="paid">
    <i class="paid__icon fa-solid fa-circle-check" aria-hidden="true"></i>
    <h1 class="paid__title">
      {{ copy.paidTitle }} <span class="paid__script">{{ copy.paidScript }}</span>
    </h1>
    <p class="paid__text">
      <template v-if="email">
        {{ copy.paidText }} <strong class="paid__email">{{ email }}</strong
        >.
      </template>
      <template v-else>{{ copy.paidTextNoEmail }}</template>
      Pedido {{ order.number }}.
    </p>

    <p v-if="accountCreated" class="paid__account">
      <i class="fa-regular fa-user" aria-hidden="true"></i>
      <span>{{ copy.accountCreated }}</span>
    </p>

    <div class="paid__actions">
      <template v-if="firstCourse">
        <RouterLink v-if="hasSession" class="btn btn--primary" :to="coursePath">
          <i class="fa-solid fa-play" aria-hidden="true"></i> {{ copy.startCourse }}
        </RouterLink>
        <RouterLink
          v-else
          class="btn btn--primary"
          :to="{ name: 'Login', query: { next: coursePath } }"
        >
          {{ copy.loginForCourse }}
        </RouterLink>
      </template>
      <template v-if="hasSession">
        <RouterLink v-if="tickets.length" class="btn btn--ghost" to="/cuenta?tab=entradas">
          Ver mis entradas
        </RouterLink>
        <RouterLink class="btn btn--ghost" to="/cuenta?tab=pedidos">Ver mis pedidos</RouterLink>
      </template>
      <RouterLink v-else-if="!firstCourse" class="btn btn--ghost" to="/">
        Volver al inicio
      </RouterLink>
    </div>
    <RouterLink
      v-if="firstCourse && !hasSession"
      class="paid__link"
      :to="{ name: 'ForgotPassword', query: { next: coursePath } }"
    >
      {{ copy.forgotPassword }}
    </RouterLink>

    <div class="paid__details">
      <TicketCodes v-if="tickets.length" :tickets="tickets" :account="hasSession" />

      <p v-if="hasPhysical" class="paid__shipping">
        <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
        <span>
          <strong>Envío a {{ order.shipping?.city || 'tu dirección' }}.</strong>
          {{ shippingNote || copy.shippingFallback }}
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

    <p class="paid__help">
      {{ copy.helpQuestion }}
      <RouterLink class="paid__link" :to="{ name: 'FindPurchase' }">{{ copy.helpLink }}</RouterLink>
    </p>
  </div>
</template>

<style scoped lang="scss">
.paid {
  @include flex(column, center, flex-start, 0.9rem);
  text-align: center;

  &__icon {
    font-size: 2.4rem;
    color: $success;
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

  &__email {
    color: $ink;
    overflow-wrap: anywhere;
  }

  &__account {
    @include flex(row, flex-start, flex-start, 0.6rem);
    max-width: 52ch;
    padding: 0.8rem 1rem;
    font-size: $text-sm;
    text-align: left;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;

    i {
      margin-top: 0.25rem;
      color: $accent-deep;
    }
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__link {
    display: inline-block;
    padding-block: 0.55rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent;
    text-decoration: underline;
    text-underline-offset: 3px;
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

  &__help {
    width: 100%;
    padding-top: $space-md;
    font-size: $text-sm;
    color: $ink-soft;
    border-top: 1px solid $line;
  }
}
</style>
