<script setup lang="ts">
import { computed } from 'vue'
import AdminField from './AdminField.vue'
import TiersEditor from './TiersEditor.vue'
import { salesModeOptions } from '@/composables/admin/labels'
import type { TierDraft } from '@/composables/admin/useEventForm'
import type { SalesMode } from '@/types'

const salesMode = defineModel<SalesMode | ''>('salesMode', { required: true })
const contactUrl = defineModel<string>('contactUrl', { required: true })
const tiers = defineModel<TierDraft[]>('tiers', { required: true })

defineProps<{ errors: Partial<Record<'salesMode' | 'contactUrl' | 'tiers', string>> }>()

const contact = computed(() =>
  salesMode.value === 'whatsapp'
    ? {
        label: 'Enlace de WhatsApp',
        placeholder: 'https://wa.me/593999999999',
        help: 'Formato: https://wa.me/ seguido del número con código de país, solo dígitos.',
      }
    : {
        label: 'Enlace de Instagram',
        placeholder: 'https://instagram.com/mambosondance',
        help: 'El perfil o la publicación donde se piden las entradas.',
      },
)
</script>

<template>
  <div class="adm-form">
    <div class="sales" role="radiogroup" aria-label="Cómo se consiguen las entradas">
      <label
        v-for="option in salesModeOptions"
        :key="option.value"
        class="adm-option"
        :class="{ 'adm-option--selected': salesMode === option.value }"
      >
        <input
          v-model="salesMode"
          class="visually-hidden"
          type="radio"
          name="sales-mode"
          :value="option.value"
        />
        <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
        <span class="adm-option__text">
          <span><i :class="option.icon"></i> {{ option.label }}</span>
          <span class="adm-help">{{ option.help }}</span>
        </span>
      </label>
    </div>
    <p v-if="errors.salesMode" class="sales__error" role="alert">{{ errors.salesMode }}</p>

    <TiersEditor v-if="salesMode === 'online'" v-model="tiers" :error="errors.tiers" />

    <AdminField
      v-else-if="salesMode === 'whatsapp' || salesMode === 'instagram'"
      :label="contact.label"
      for="event-contact"
      required
      :help="contact.help"
      :error="errors.contactUrl"
    >
      <input
        id="event-contact"
        v-model="contactUrl"
        type="url"
        inputmode="url"
        :placeholder="contact.placeholder"
      />
    </AdminField>
  </div>
</template>

<style scoped lang="scss">
.sales {
  @include flex-cards(230px, 0.6rem);

  &__error {
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
  }
}
</style>
