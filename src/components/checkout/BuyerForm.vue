<script setup lang="ts">
import FormField from '@/components/auth/FormField.vue'
import { studentCopy } from '@/config/student'
import type { BuyerErrors } from '@/composables/useCheckout'
import type { Buyer } from '@/types'

// `buyer` es el objeto reactivo del composable: los campos escriben directo en él.
// Con sesión el correo es el de la cuenta y no se edita; sin sesión es el dato más
// delicado del pedido, porque ahí llegan los accesos.
defineProps<{
  buyer: Buyer
  errors: BuyerErrors
  guest: boolean
  confirmEmail: boolean
}>()

const emailConfirm = defineModel<string>('emailConfirm', { required: true })
const copy = studentCopy.checkout
</script>

<template>
  <fieldset class="buyer">
    <legend class="buyer__legend">Tus datos</legend>
    <p class="buyer__text">{{ copy.buyerText }}</p>

    <div class="buyer__fields">
      <FormField
        id="buyer-email"
        v-model="buyer.email"
        label="Correo"
        type="email"
        inputmode="email"
        autocomplete="email"
        :readonly="!guest"
        :hint="guest ? copy.emailHint : copy.emailLockedHint"
        :error="errors.email"
        required
      />
      <FormField
        v-if="confirmEmail"
        id="buyer-email-confirm"
        v-model="emailConfirm"
        :label="copy.emailConfirmLabel"
        type="email"
        inputmode="email"
        autocomplete="off"
        :error="errors.emailConfirm"
        required
      />
      <FormField
        id="buyer-name"
        v-model="buyer.name"
        label="Nombre y apellido"
        autocomplete="name"
        :error="errors.name"
        required
      />
      <FormField
        id="buyer-phone"
        v-model="buyer.phone"
        label="Teléfono"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        placeholder="09 9999 9999"
        :error="errors.phone"
        required
      />
      <FormField
        id="buyer-document"
        v-model="buyer.documentId"
        label="Cédula o RUC"
        inputmode="numeric"
        :maxlength="13"
        hint="10 dígitos para cédula, 13 para RUC."
        :error="errors.documentId"
        required
      />
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.buyer {
  border: none;
  min-width: 0;

  &__legend {
    @include display($text-xl, 600);
    margin-bottom: 0.4rem;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: $space-md;
  }

  &__fields {
    @include flex-cards(240px, 1.1rem);
  }
}
</style>
