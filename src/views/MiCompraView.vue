<script setup lang="ts">
import AuthShell from '@/components/auth/AuthShell.vue'
import AuthForm from '@/components/auth/AuthForm.vue'
import FormField from '@/components/auth/FormField.vue'
import { useFindPurchase } from '@/composables/useFindPurchase'
import { site } from '@/config/site'
import { studentCopy } from '@/config/student'

const copy = studentCopy.auth.findPurchase
const { email, number, errors, loading, error, sent, cooldown, waiting, submit, editEmail } =
  useFindPurchase()
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
    <div v-if="sent" class="found" role="status">
      <i class="found__icon fa-regular fa-envelope" aria-hidden="true"></i>
      <p class="found__text">{{ copy.sent }}</p>
      <p class="found__email">{{ email }}</p>
      <button
        class="btn btn--primary btn--block"
        type="button"
        :disabled="loading || waiting"
        @click="submit"
      >
        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
        {{ waiting ? `Reenviar en ${cooldown} s` : 'Reenviar el correo' }}
      </button>
      <p v-if="error" class="found__error" role="alert">{{ error }}</p>
      <button class="found__other" type="button" @click="editEmail">Usar otro correo</button>
    </div>

    <AuthForm
      v-else
      :error="error"
      :loading="loading"
      :disabled="waiting"
      :submit-label="waiting ? `Reenviar en ${cooldown} s` : 'Reenviar mis accesos'"
      loading-label="Enviando…"
      @submit="submit"
    >
      <FormField
        id="find-email"
        v-model="email"
        label="Correo con el que compraste"
        type="email"
        inputmode="email"
        autocomplete="email"
        :error="errors.email"
        required
      />
      <FormField
        id="find-number"
        v-model="number"
        label="Número de pedido"
        placeholder="MS-000123"
        autocomplete="off"
        :maxlength="12"
        :hint="copy.numberHint"
        :error="errors.number"
        optional
      />
    </AuthForm>

    <template #links>
      <p>
        ¿Ya definiste tu contraseña?
        <RouterLink :to="{ name: 'Login' }">Inicia sesión</RouterLink>
      </p>
      <RouterLink :to="{ name: 'ForgotPassword' }">Olvidé mi contraseña</RouterLink>
    </template>
  </AuthShell>
</template>

<style scoped lang="scss">
.found {
  @include flex(column, stretch, flex-start, 0.7rem);
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

  &__error {
    font-size: $text-sm;
    color: $danger;
  }

  &__other {
    align-self: center;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover {
      color: $accent;
    }
  }
}
</style>
