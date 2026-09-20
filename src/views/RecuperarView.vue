<script setup lang="ts">
import { ref } from 'vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import FormField from '@/components/auth/FormField.vue'
import { useAuthRedirect } from '@/composables/useAuthRedirect'
import { rules, useFormErrors } from '@/composables/useFormErrors'
import { authService } from '@/services/auth.service'
import { site } from '@/config/site'
import { studentCopy } from '@/config/student'
import type { ApiError } from '@/types'

const copy = studentCopy.auth.forgot
const { nextQuery } = useAuthRedirect()
const { errors, check } = useFormErrors<'email'>()

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function submit() {
  error.value = ''
  if (!check({ email: rules.email(email.value) })) return

  loading.value = true
  try {
    await authService.forgotPassword(email.value.trim().toLowerCase())
    sent.value = true
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell
    :eyebrow="copy.eyebrow"
    :title="copy.title"
    :script="copy.script"
    :text="sent ? '' : copy.text"
    :photo="site.photos.steps"
    :phrase="site.phrases[1]"
  >
    <div v-if="sent" class="sent" role="status">
      <i class="sent__icon fa-regular fa-envelope"></i>
      <p class="sent__text">{{ copy.sent }}</p>
      <p class="sent__email">{{ email }}</p>
      <button class="btn btn--ghost btn--block" type="button" @click="sent = false">
        Usar otro correo
      </button>
    </div>

    <AuthForm
      v-else
      :error="error"
      :loading="loading"
      submit-label="Enviar enlace"
      loading-label="Enviando…"
      @submit="submit"
    >
      <FormField
        id="forgot-email"
        v-model="email"
        label="Correo de tu cuenta"
        type="email"
        inputmode="email"
        autocomplete="email"
        :error="errors.email"
        required
      />
    </AuthForm>

    <template #links>
      <RouterLink :to="{ name: 'Login', query: nextQuery }">Volver a ingresar</RouterLink>
    </template>
  </AuthShell>
</template>

<style scoped lang="scss">
.sent {
  @include flex(column, flex-start, flex-start, 0.7rem);
  padding: $space-md;
  background: $sand;
  border-radius: $radius-md;

  &__icon {
    font-size: 1.5rem;
    color: $accent;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__email {
    font-weight: 700;
    overflow-wrap: anywhere;
  }
}
</style>
