<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthShell from '@/components/auth/AuthShell.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import FormField from '@/components/auth/FormField.vue'
import { rules, useFormErrors } from '@/composables/useFormErrors'
import { authService } from '@/services/auth.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import { studentCopy } from '@/config/student'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { errors, check } = useFormErrors<'password' | 'repeat'>()

// El mismo enlace sirve para quien olvidó la contraseña y para las cuentas que
// creó el equipo (?nuevo=1): cambia el saludo, no el flujo.
const isNew = computed(() => route.query.nuevo === '1')
const copy = computed(() => (isNew.value ? studentCopy.auth.welcome : studentCopy.auth.reset))
const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))

const form = reactive({ password: '', repeat: '' })
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  const valid = check({
    password: rules.password(form.password),
    repeat: form.repeat === form.password ? '' : 'Las contraseñas no coinciden',
  })
  if (!valid) return

  loading.value = true
  try {
    const session = await authService.resetPassword(token.value, form.password)
    userStore.setSession(session.token, session.user)
    toast.success('Tu contraseña quedó guardada')
    await router.replace(session.user.accountType === 'admin' ? '/admin' : '/cuenta')
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
    :text="token ? copy.text : ''"
    :photo="site.photos.expression"
    :phrase="site.phrases[0]"
  >
    <div v-if="!token" class="invalid" role="alert">
      <p>
        Este enlace no es válido o está incompleto. Pide uno nuevo y ábrelo desde el correo que te
        enviamos.
      </p>
      <RouterLink class="btn btn--primary btn--block" :to="{ name: 'ForgotPassword' }">
        Pedir un enlace nuevo
      </RouterLink>
    </div>

    <AuthForm
      v-else
      :error="error"
      :loading="loading"
      submit-label="Guardar contraseña"
      loading-label="Guardando…"
      @submit="submit"
    >
      <FormField
        id="reset-password"
        v-model="form.password"
        label="Contraseña nueva"
        type="password"
        autocomplete="new-password"
        hint="Mínimo 8 caracteres."
        :error="errors.password"
        required
      />
      <FormField
        id="reset-repeat"
        v-model="form.repeat"
        label="Repite la contraseña"
        type="password"
        autocomplete="new-password"
        :error="errors.repeat"
        required
      />
    </AuthForm>

    <template #links>
      <RouterLink v-if="error" :to="{ name: 'ForgotPassword' }">Pedir un enlace nuevo</RouterLink>
      <RouterLink v-if="!userStore.isAuthenticated" :to="{ name: 'Login' }">
        Volver a ingresar
      </RouterLink>
    </template>
  </AuthShell>
</template>

<style scoped lang="scss">
.invalid {
  @include flex(column, stretch, flex-start, 1rem);
  padding: $space-md;
  background: $danger-bg;
  border-radius: $radius-md;
  font-size: $text-sm;
  color: $ink;
}
</style>
