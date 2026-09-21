<script setup lang="ts">
import { ref } from 'vue'
import AuthShell from '@/components/auth/AuthShell.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import FormField from '@/components/auth/FormField.vue'
import { useAuthRedirect } from '@/composables/useAuthRedirect'
import { rules, useFormErrors } from '@/composables/useFormErrors'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import { studentCopy } from '@/config/student'
import type { ApiError } from '@/types'

const copy = studentCopy.auth.login
const userStore = useUserStore()
const toast = useToastStore()
const { nextQuery, goAfterAuth } = useAuthRedirect()
const { errors, check } = useFormErrors<'email' | 'password'>()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (!check({ email: rules.email(email.value), password: rules.required(password.value) })) return

  loading.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    toast.success(`Hola, ${user.name || user.email}`)
    await goAfterAuth(user)
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
    :text="copy.text"
    :photo="site.photos.couple"
    :phrase="site.phrases[0]"
  >
    <AuthForm
      :error="error"
      :loading="loading"
      submit-label="Ingresar"
      loading-label="Ingresando…"
      @submit="submit"
    >
      <FormField
        id="login-email"
        v-model="email"
        label="Correo"
        type="email"
        inputmode="email"
        autocomplete="email"
        :error="errors.email"
        required
      />
      <FormField
        id="login-password"
        v-model="password"
        label="Contraseña"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
        required
      />
    </AuthForm>

    <template #links>
      <RouterLink :to="{ name: 'ForgotPassword', query: nextQuery }">
        Olvidé mi contraseña
      </RouterLink>
      <p>
        ¿Primera vez en MamboSon?
        <RouterLink :to="{ name: 'Register', query: nextQuery }">Crea tu cuenta</RouterLink>
      </p>
      <p>
        {{ studentCopy.auth.findPurchase.entryQuestion }}
        <RouterLink :to="{ name: 'FindPurchase' }">
          {{ studentCopy.auth.findPurchase.entryLink }}
        </RouterLink>
      </p>
    </template>
  </AuthShell>
</template>
