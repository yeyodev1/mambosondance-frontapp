<script setup lang="ts">
import CartLineRow from '@/components/checkout/CartLineRow.vue'
import StateBlock from '@/components/account/StateBlock.vue'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { studentCopy } from '@/config/student'
import { formatCents } from '@/utils/format'
import type { CartLine } from '@/types'

const copy = studentCopy.cart
const cart = useCartStore()
const toast = useToastStore()

function remove(line: CartLine) {
  cart.remove(line.key)
  toast.info(`Quitamos "${line.title}" de tu carrito`)
}
</script>

<template>
  <section class="cart">
    <header class="cart__head">
      <p class="cart__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="cart__title">
        {{ copy.title }} <span class="cart__script">{{ copy.script }}</span>
      </h1>
    </header>

    <StateBlock
      v-if="cart.isEmpty"
      kind="empty"
      icon="fa-solid fa-bag-shopping"
      :title="copy.emptyTitle"
      :text="copy.emptyText"
    >
      <RouterLink class="btn btn--primary" to="/clases">Ver clases online</RouterLink>
      <RouterLink class="btn btn--ghost" to="/tienda">Ir a la tienda</RouterLink>
    </StateBlock>

    <div v-else class="cart__layout">
      <ul class="cart__lines">
        <CartLineRow
          v-for="line in cart.lines"
          :key="line.key"
          :line="line"
          @quantity="cart.setQuantity(line.key, $event)"
          @remove="remove(line)"
        />
      </ul>

      <aside class="cart__summary" aria-label="Resumen">
        <div class="cart__row">
          <span>Subtotal ({{ cart.count }} {{ cart.count === 1 ? 'artículo' : 'artículos' }})</span>
          <strong>{{ formatCents(cart.subtotalCents) }}</strong>
        </div>
        <p class="cart__note">{{ copy.note }}</p>
        <RouterLink class="btn btn--primary btn--block" to="/checkout">
          Continuar con la compra
        </RouterLink>
        <RouterLink class="cart__more" to="/clases">Seguir viendo clases</RouterLink>
      </aside>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cart {
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

  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: $space-lg;
    }
  }

  &__lines {
    flex: 1;
    min-width: 0;
    list-style: none;
    border-top: 1px solid $line;
  }

  &__summary {
    @include flex(column, stretch, flex-start, 0.9rem);
    padding: $space-md;
    background: $sand;
    border-radius: $radius-md;

    @include from('lg') {
      flex: 0 0 340px;
      position: sticky;
      top: 6rem;
    }
  }

  &__row {
    @include flex(row, baseline, space-between, 1rem);

    strong {
      font-size: $text-lg;
    }
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__more {
    align-self: center;
    padding-block: 0.6rem;
    font-size: $text-sm;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}
</style>
