<script setup lang="ts">
import FormField from '@/components/auth/FormField.vue'
import type { FieldErrors } from '@/composables/useCheckout'
import type { Buyer } from '@/types'

// `buyer` es el objeto reactivo del composable: los campos escriben directo en él.
defineProps<{ buyer: Buyer; errors: FieldErrors<Buyer>; email?: string }>()
</script>

<template>
  <fieldset class="buyer">
    <legend class="buyer__legend">Tus datos</legend>
    <p class="buyer__text">
      Payphone usa estos datos para validar el pago.
      <template v-if="email">
        El comprobante llega a <strong>{{ email }}</strong
        >.
      </template>
    </p>

    <div class="buyer__fields">
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
    overflow-wrap: anywhere;
  }

  &__fields {
    @include flex-cards(240px, 1.1rem);
  }
}
</style>
