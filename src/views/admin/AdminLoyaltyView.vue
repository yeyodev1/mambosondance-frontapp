<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import LoyaltyManager from '@/components/admin/LoyaltyManager.vue'
import { useLoyaltyActions } from '@/composables/admin/useLoyaltyActions'
import type { LoyaltyCard } from '@/types'

const route = useRoute()
const form = reactive({
  email: typeof route.query.email === 'string' ? route.query.email : '',
  note: '',
  count: 1,
})

const card = ref<LoyaltyCard | null>(null)
/** El correo de la tarjeta que se está mostrando (puede diferir de lo que se está escribiendo). */
const shownEmail = ref('')

const { busy, stamp } = useLoyaltyActions(() => form.email, card)

const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
const counts = [1, 2, 3]

async function submit() {
  if (!emailOk.value) return
  const email = form.email.trim().toLowerCase()
  if (await stamp(form.note, form.count)) {
    shownEmail.value = email
    form.note = ''
    form.count = 1
  }
}

function another() {
  card.value = null
  shownEmail.value = ''
  form.email = ''
}
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Sellar tarjeta"
      subtitle="Pon un sello cada vez que el alumno viene a clase. Al completar la tarjeta gana su premio."
    />

    <AdminCard title="Poner sello" icon="fa-solid fa-stamp">
      <form class="adm-form" novalidate @submit.prevent="submit">
        <AdminField
          label="Correo del alumno"
          for="stamp-email"
          required
          help="Si no tiene cuenta, se la creamos y le llega un correo."
        >
          <input
            id="stamp-email"
            v-model="form.email"
            type="email"
            inputmode="email"
            autocomplete="off"
            autocapitalize="none"
            placeholder="alumna@correo.com"
          />
        </AdminField>

        <AdminField label="¿Cuántos sellos?">
          <div class="counts" role="radiogroup" aria-label="Cantidad de sellos">
            <label
              v-for="n in counts"
              :key="n"
              class="adm-option counts__option"
              :class="{ 'adm-option--selected': form.count === n }"
            >
              <input
                v-model="form.count"
                class="visually-hidden"
                type="radio"
                name="stamp-count"
                :value="n"
              />
              <span class="adm-option__mark"><i class="fa-solid fa-check"></i></span>
              <span>{{ n }}</span>
            </label>
          </div>
        </AdminField>

        <AdminField
          label="Nota (opcional)"
          for="stamp-note"
          help="Ej.: «clase del martes», «taller de bachata»."
        >
          <input id="stamp-note" v-model="form.note" type="text" maxlength="160" />
        </AdminField>

        <button type="submit" class="btn btn--primary btn--block" :disabled="!emailOk || busy">
          <i class="fa-solid" :class="busy ? 'fa-circle-notch fa-spin' : 'fa-stamp'"></i>
          {{ busy ? 'Sellando…' : form.count === 1 ? 'Poner sello' : `Poner ${form.count} sellos` }}
        </button>
      </form>
    </AdminCard>

    <AdminCard v-if="card" :title="`Tarjeta de ${shownEmail}`">
      <LoyaltyManager v-model="card" :email="shownEmail" />
      <button type="button" class="adm-action another" @click="another">
        <i class="fa-solid fa-user-plus"></i>
        Sellar a otro alumno
      </button>
    </AdminCard>

    <p v-else class="adm-help">
      Después de sellar aparece aquí la tarjeta del alumno, con sus casillas y su premio. Para ver
      la tarjeta sin sellar, búscalo en «Alumnos».
    </p>
  </div>
</template>

<style scoped lang="scss">
.counts {
  @include flex(row, stretch, flex-start, 0.5rem);

  &__option {
    flex: 1 1 0;
    align-items: center;
    font-size: $text-lg;
    font-weight: 700;
  }
}

.another {
  align-self: flex-start;
}
</style>
