<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import { useAction } from '@/composables/admin/useAction'
import { useResource } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Settings } from '@/types'

const toast = useToastStore()
const form = reactive<Settings>({
  loyaltyEnabled: false,
  loyaltyStampsRequired: 10,
  loyaltyRewardText: '',
  loyaltyStampOnPurchase: false,
  whatsapp: '',
  instagram: '',
  shippingNote: '',
})

const { loading, error, load } = useResource(async () => {
  const settings = await adminService.settings()
  Object.assign(form, settings)
  return settings
})
const { busy, run } = useAction()

const whatsappError = computed(() =>
  form.whatsapp && !/^\d{10,15}$/.test(form.whatsapp)
    ? 'Solo dígitos, con el código de país y sin el 0 inicial. Ej.: 593984934039'
    : '',
)
const stampsError = computed(() =>
  Number.isInteger(form.loyaltyStampsRequired) && form.loyaltyStampsRequired >= 1
    ? ''
    : 'Escribe un número entero, mínimo 1.',
)

// Quita espacios, guiones y el "+" mientras se escribe o se pega el número.
function cleanWhatsapp() {
  form.whatsapp = form.whatsapp.replace(/\D/g, '')
}

async function save() {
  if (whatsappError.value || (form.loyaltyEnabled && stampsError.value)) {
    toast.error('Revisa los campos marcados en rojo')
    return
  }
  await run(async () => {
    const saved = await adminService.saveSettings({
      ...form,
      loyaltyRewardText: form.loyaltyRewardText.trim(),
      instagram: form.instagram.trim().replace(/^@/, ''),
      shippingNote: form.shippingNote.trim(),
    })
    Object.assign(form, saved)
  }, 'Ajustes guardados')
}

onMounted(load)
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Ajustes"
      subtitle="La tarjeta de fidelidad y los datos de contacto del sitio."
    />

    <AdminState :loading="loading" :error="error" @retry="load">
      <form class="adm-stack" novalidate @submit.prevent="save">
        <AdminCard title="Tarjeta de fidelidad" icon="fa-solid fa-stamp">
          <div class="adm-form">
            <AdminSwitch
              v-model="form.loyaltyEnabled"
              label="Tarjeta de fidelidad activada"
              help="Los alumnos ven su tarjeta en «Mi cuenta» y el equipo puede sellarla."
            />
            <div class="adm-form__row">
              <AdminField
                label="Sellos para ganar el premio"
                for="settings-stamps"
                :error="form.loyaltyEnabled ? stampsError : ''"
                help="Cuántas casillas tiene la tarjeta."
              >
                <input
                  id="settings-stamps"
                  v-model.number="form.loyaltyStampsRequired"
                  type="number"
                  inputmode="numeric"
                  min="1"
                  step="1"
                  :disabled="!form.loyaltyEnabled"
                />
              </AdminField>
              <AdminField
                label="¿Cuál es el premio?"
                for="settings-reward"
                help="Así lo ve el alumno. Ej.: «Una clase gratis»."
              >
                <input
                  id="settings-reward"
                  v-model="form.loyaltyRewardText"
                  type="text"
                  maxlength="160"
                  :disabled="!form.loyaltyEnabled"
                />
              </AdminField>
            </div>
            <AdminSwitch
              v-model="form.loyaltyStampOnPurchase"
              label="Sello automático por compra"
              help="Pone un sello por cada clase o taller que el alumno compra en la web."
              :disabled="!form.loyaltyEnabled"
            />
          </div>
        </AdminCard>

        <AdminCard title="Contacto" icon="fa-solid fa-address-book">
          <div class="adm-form__row">
            <AdminField
              label="WhatsApp"
              for="settings-whatsapp"
              :error="whatsappError"
              help="Solo dígitos con código de país, ej. 593984934039. Es el número de los botones de WhatsApp."
            >
              <input
                id="settings-whatsapp"
                v-model="form.whatsapp"
                type="tel"
                inputmode="numeric"
                placeholder="593…"
                @input="cleanWhatsapp"
              />
            </AdminField>
            <AdminField
              label="Instagram"
              for="settings-instagram"
              help="Solo el usuario, sin la arroba."
            >
              <input
                id="settings-instagram"
                v-model="form.instagram"
                type="text"
                autocapitalize="none"
                placeholder="mambosondance"
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="Tienda" icon="fa-solid fa-truck">
          <AdminField
            label="Nota de envío"
            for="settings-shipping"
            help="Se muestra en el carrito y en el correo de compra. Ej.: «Envíos a todo el país en 3 a 5 días. Retiro gratis en la academia»."
          >
            <textarea id="settings-shipping" v-model="form.shippingNote" rows="3"></textarea>
          </AdminField>
        </AdminCard>

        <div class="adm-form__actions">
          <button type="submit" class="btn btn--primary" :disabled="busy">
            <i class="fa-solid" :class="busy ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            {{ busy ? 'Guardando…' : 'Guardar ajustes' }}
          </button>
        </div>
      </form>
    </AdminState>
  </div>
</template>
