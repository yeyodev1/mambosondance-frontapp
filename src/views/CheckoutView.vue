<script setup lang="ts">
import { computed } from 'vue'
import BuyerForm from '@/components/checkout/BuyerForm.vue'
import ShippingForm from '@/components/checkout/ShippingForm.vue'
import OrderSummary, { type SummaryLine } from '@/components/checkout/OrderSummary.vue'
import PayphoneBox from '@/components/checkout/PayphoneBox.vue'
import CheckoutNotice from '@/components/checkout/CheckoutNotice.vue'
import StateBlock from '@/components/account/StateBlock.vue'
import { useCheckout } from '@/composables/useCheckout'
import { useUserStore } from '@/stores/user'
import { studentCopy } from '@/config/student'

const copy = studentCopy.checkout
const userStore = useUserStore()
const {
  cart,
  step,
  submitting,
  formError,
  notice,
  buyer,
  shipping,
  buyerErrors,
  shippingErrors,
  order,
  payphone,
  shippingNote,
  whatsapp,
  remaining,
  expired,
  createOrder,
  backToDetails,
} = useCheckout()

// En el paso 1 el resumen sale del carrito (precios de referencia); en el paso 2,
// de la orden que devolvió el servidor, que es lo que de verdad se cobra.
const lines = computed<SummaryLine[]>(() => {
  if (step.value === 'payment' && order.value) {
    return order.value.items.map((item, i) => ({
      key: `${i}-${item.title}`,
      title: item.title,
      subtitle: Object.values(item.selectedOptions || {}).join(' · '),
      quantity: item.quantity,
      totalCents: item.unitCents * item.quantity,
      image: item.image,
    }))
  }
  return cart.lines.map((line) => ({
    key: line.key,
    title: line.title,
    subtitle: line.subtitle,
    quantity: line.input.quantity,
    totalCents: line.unitCents * line.input.quantity,
    image: line.image,
  }))
})

const isPayment = computed(() => step.value === 'payment' && Boolean(order.value))
</script>

<template>
  <section class="checkout">
    <header class="checkout__head">
      <p class="checkout__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="checkout__title">
        {{ copy.title }} <span class="checkout__script">{{ copy.script }}</span>
      </h1>
      <ol v-if="!notice && !cart.isEmpty" class="checkout__steps">
        <li class="checkout__step" :class="{ 'checkout__step--active': !isPayment }">
          1. Tus datos
        </li>
        <li class="checkout__step" :class="{ 'checkout__step--active': isPayment }">2. Pago</li>
      </ol>
    </header>

    <CheckoutNotice
      v-if="notice"
      :kind="notice.kind"
      :message="notice.message"
      :whatsapp="whatsapp"
    />

    <StateBlock
      v-else-if="cart.isEmpty"
      kind="empty"
      icon="fa-solid fa-bag-shopping"
      :title="studentCopy.cart.emptyTitle"
      :text="studentCopy.cart.emptyText"
    >
      <RouterLink class="btn btn--primary" to="/clases">Ver clases online</RouterLink>
      <RouterLink class="btn btn--ghost" to="/tienda">Ir a la tienda</RouterLink>
    </StateBlock>

    <div v-else class="checkout__layout">
      <div class="checkout__main">
        <template v-if="isPayment && payphone">
          <PayphoneBox
            :key="payphone.clientTransactionId"
            :config="payphone"
            :remaining="remaining"
            :expired="expired"
            :regenerating="submitting"
            @regenerate="createOrder"
          />
          <p v-if="formError" class="checkout__error" role="alert">{{ formError }}</p>
          <button class="checkout__back" type="button" @click="backToDetails">
            <i class="fa-solid fa-arrow-left"></i> Editar mis datos
          </button>
        </template>

        <form v-else class="checkout__form" novalidate @submit.prevent="createOrder">
          <BuyerForm :buyer="buyer" :errors="buyerErrors" :email="userStore.user?.email" />
          <ShippingForm
            v-if="cart.hasPhysical"
            :shipping="shipping"
            :errors="shippingErrors"
            :note="shippingNote"
          />

          <p v-if="formError" class="checkout__error" role="alert">
            <i class="fa-solid fa-circle-exclamation"></i> {{ formError }}
          </p>

          <button class="btn btn--primary btn--block" type="submit" :disabled="submitting">
            <i v-if="submitting" class="fa-solid fa-circle-notch fa-spin"></i>
            {{ submitting ? 'Preparando tu pago…' : 'Continuar al pago' }}
          </button>
          <RouterLink class="checkout__back" to="/carrito">
            <i class="fa-solid fa-arrow-left"></i> Volver al carrito
          </RouterLink>
        </form>
      </div>

      <aside class="checkout__aside">
        <OrderSummary
          :lines="lines"
          :heading="isPayment && order ? `Pedido ${order.number}` : 'Tu pedido'"
          :total-cents="isPayment && order ? order.totalCents : cart.subtotalCents"
          :discount-cents="isPayment && order ? order.discountCents : 0"
          :total-label="isPayment ? 'Total a pagar' : 'Subtotal'"
          :note="isPayment ? '' : studentCopy.cart.note"
        />
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.checkout {
  @include container(1080px);
  padding-block: $space-xl;

  &__head {
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.4rem;
  }

  &__title {
    @include display($display-sm);
  }

  &__script {
    @include script($display-sm);
    color: $accent;
  }

  &__steps {
    @include flex(row, center, flex-start, 1.2rem);
    list-style: none;
    margin-top: $space-md;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;
  }

  &__step {
    padding-bottom: 0.35rem;
    border-bottom: 2px solid transparent;

    &--active {
      color: $ink;
      border-color: $accent;
    }
  }

  &__layout {
    @include flex(column-reverse, stretch, flex-start, $space-md);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: $space-lg;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, $space-md);
    flex: 1;
    min-width: 0;
  }

  &__form {
    @include flex(column, stretch, flex-start, $space-lg);
  }

  &__aside {
    min-width: 0;

    @include from('lg') {
      flex: 0 0 360px;
      position: sticky;
      top: 6rem;
    }
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.75rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__back {
    @include flex(row, center, center, 0.5rem);
    align-self: center;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    &:hover {
      color: $accent;
    }
  }
}
</style>
