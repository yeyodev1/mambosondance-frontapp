<script setup lang="ts">
import { reactive, ref } from 'vue'
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

const copy = studentCopy.auth.register
const userStore = useUserStore()
const toast = useToastStore()
const { nextQuery, goAfterAuth } = useAuthRedirect()
const { errors, check } = useFormErrors<'name' | 'email' | 'phone' | 'password'>()

const form = reactive({ name: '', email: '', phone: '', password: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  const valid = check({
    name: rules.name(form.name),
    email: rules.email(form.email),
    phone: rules.phone(form.phone),
    password: rules.password(form.password),
  })
  if (!valid) return

  loading.value = true
  try {
    const user = await userStore.register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
    })
    toast.success(`Tu cuenta está lista, ${user.name || user.email}`)
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
    :photo="site.photos.community"
    :phrase="site.phrases[2]"
  >
    <AuthForm
      :error="error"
      :loading="loading"
      submit-label="Crear mi cuenta"
      loading-label="Creando tu cuenta…"
      @submit="submit"
    >
      <FormField
        id="register-name"
        v-model="form.name"
        label="Nombre y apellido"
        autocomplete="name"
        :error="errors.name"
        required
      />
      <FormField
        id="register-email"
        v-model="form.email"
        label="Correo"
        type="email"
        inputmode="email"
        autocomplete="email"
        :error="errors.email"
        required
      />
      <FormField
        id="register-phone"
        v-model="form.phone"
        label="Teléfono"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        placeholder="09 9999 9999"
        :error="errors.phone"
        required
      />
      <FormField
        id="register-password"
        v-model="form.password"
        label="Contraseña"
        type="password"
        autocomplete="new-password"
        hint="Mínimo 8 caracteres."
        :error="errors.password"
        required
      />
    </AuthForm>

    <template #links>
      <p>
        ¿Ya tienes cuenta?
        <RouterLink :to="{ name: 'Login', query: nextQuery }">Ingresa</RouterLink>
      </p>
    </template>
  </AuthShell>
</template>
