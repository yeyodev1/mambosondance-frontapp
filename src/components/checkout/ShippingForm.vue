<script setup lang="ts">
import FormField from '@/components/auth/FormField.vue'
import type { FieldErrors } from '@/composables/useCheckout'
import type { Shipping } from '@/types'

defineProps<{ shipping: Shipping; errors: FieldErrors<Shipping>; note?: string }>()
</script>

<template>
  <fieldset class="shipping">
    <legend class="shipping__legend">Envío</legend>
    <p v-if="note" class="shipping__note">
      <i class="fa-solid fa-truck-fast" aria-hidden="true"></i> <span>{{ note }}</span>
    </p>

    <div class="shipping__fields">
      <FormField
        id="shipping-name"
        v-model="shipping.fullName"
        label="Quién recibe"
        autocomplete="name"
        :error="errors.fullName"
        required
      />
      <FormField
        id="shipping-phone"
        v-model="shipping.phone"
        label="Teléfono de contacto"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        :error="errors.phone"
        required
      />
      <FormField
        id="shipping-city"
        v-model="shipping.city"
        label="Ciudad"
        autocomplete="address-level2"
        :error="errors.city"
        required
      />
      <FormField
        id="shipping-address"
        v-model="shipping.address"
        class="shipping__wide"
        label="Dirección"
        autocomplete="street-address"
        placeholder="Calle principal, número, calle secundaria"
        :error="errors.address"
        required
      />
      <FormField
        id="shipping-notes"
        v-model="shipping.notes"
        class="shipping__wide"
        label="Referencias para la entrega"
        :maxlength="300"
        textarea
        optional
      />
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.shipping {
  border: none;
  min-width: 0;

  &__legend {
    @include display($text-xl, 600);
    margin-bottom: 0.6rem;
  }

  &__note {
    @include flex(row, flex-start, flex-start, 0.6rem);
    margin-bottom: $space-md;
    padding: 0.8rem 1rem;
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;
    white-space: pre-line;

    i {
      margin-top: 0.3rem;
      color: $accent-deep;
    }
  }

  &__fields {
    @include flex-cards(240px, 1.1rem);
  }

  &__wide {
    flex-basis: 100%;
  }
}
</style>
