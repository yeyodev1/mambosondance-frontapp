<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm from '@/components/auth/AuthForm.vue'
import FormField from '@/components/auth/FormField.vue'
import { rules, useFormErrors } from '@/composables/useFormErrors'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const profile = reactive({ name: userStore.user?.name || '', phone: userStore.user?.phone || '' })
const profileForm = useFormErrors<'name' | 'phone'>()
const savingProfile = ref(false)
const profileError = ref('')

const password = reactive({ current: '', next: '', repeat: '' })
const passwordForm = useFormErrors<'current' | 'next' | 'repeat'>()
const savingPassword = ref(false)
const passwordError = ref('')

async function saveProfile() {
  profileError.value = ''
  const valid = profileForm.check({
    name: rules.name(profile.name),
    phone: rules.phone(profile.phone),
  })
  if (!valid) return

  savingProfile.value = true
  try {
    await userStore.updateProfile({ name: profile.name.trim(), phone: profile.phone.trim() })
    toast.success('Guardamos tus datos')
  } catch (e) {
    profileError.value = (e as ApiError).message
  } finally {
    savingProfile.value = false
  }
}

async function savePassword() {
  passwordError.value = ''
  const valid = passwordForm.check({
    current: rules.required(password.current),
    next: rules.password(password.next),
    repeat: password.repeat === password.next ? '' : 'Las contraseñas no coinciden',
  })
  if (!valid) return

  savingPassword.value = true
  try {
    await userStore.changePassword(password.current, password.next)
    Object.assign(password, { current: '', next: '', repeat: '' })
    toast.success('Tu contraseña quedó actualizada')
  } catch (e) {
    passwordError.value = (e as ApiError).message
  } finally {
    savingPassword.value = false
  }
}

function logout() {
  userStore.clear()
  toast.info('Sesión cerrada')
  router.replace('/')
}
</script>

<template>
  <div class="profile">
    <section class="profile__block">
      <h2 class="profile__heading">Tus datos</h2>
      <p class="profile__email"><span>Correo</span> {{ userStore.user?.email }}</p>
      <AuthForm
        :error="profileError"
        :loading="savingProfile"
        submit-label="Guardar cambios"
        loading-label="Guardando…"
        @submit="saveProfile"
      >
        <FormField
          id="profile-name"
          v-model="profile.name"
          label="Nombre y apellido"
          autocomplete="name"
          :error="profileForm.errors.value.name"
        />
        <FormField
          id="profile-phone"
          v-model="profile.phone"
          label="Teléfono"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          :error="profileForm.errors.value.phone"
        />
      </AuthForm>
    </section>

    <section class="profile__block">
      <h2 class="profile__heading">Cambiar contraseña</h2>
      <AuthForm
        :error="passwordError"
        :loading="savingPassword"
        submit-label="Actualizar contraseña"
        loading-label="Actualizando…"
        @submit="savePassword"
      >
        <FormField
          id="password-current"
          v-model="password.current"
          label="Contraseña actual"
          type="password"
          autocomplete="current-password"
          :error="passwordForm.errors.value.current"
        />
        <FormField
          id="password-next"
          v-model="password.next"
          label="Contraseña nueva"
          type="password"
          autocomplete="new-password"
          hint="Mínimo 8 caracteres."
          :error="passwordForm.errors.value.next"
        />
        <FormField
          id="password-repeat"
          v-model="password.repeat"
          label="Repite la contraseña nueva"
          type="password"
          autocomplete="new-password"
          :error="passwordForm.errors.value.repeat"
        />
      </AuthForm>
    </section>

    <section class="profile__block profile__block--logout">
      <button class="btn btn--ghost" type="button" @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
      </button>
    </section>
  </div>
</template>

<style scoped lang="scss">
.profile {
  @include flex-cards(300px, $space-lg);
  align-items: flex-start;

  &__block {
    @include flex(column, stretch, flex-start, 1rem);
    max-width: 440px;

    &--logout {
      flex-basis: 100%;
      align-items: flex-start;
      padding-top: $space-md;
      border-top: 1px solid $line;
      max-width: none;
    }
  }

  &__heading {
    @include display($text-xl, 600);
  }

  &__email {
    font-weight: 600;
    overflow-wrap: anywhere;

    span {
      display: block;
      font-size: $text-xs;
      font-weight: 400;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $ink-muted;
    }
  }
}
</style>
