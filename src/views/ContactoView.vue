<script setup lang="ts">
import { onMounted } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useSettingsStore } from '@/stores/settings'
import { useContactForm } from '@/composables/useContactForm'
import PageHero from '@/components/ui/PageHero.vue'

const settings = useSettingsStore()
const { form, errors, sending, sent, failure, submit, reset } = useContactForm()

onMounted(() => settings.load())
</script>

<template>
  <div class="contact">
    <PageHero
      eyebrow="Contacto"
      title="Escríbenos"
      :text="site.academy.manifesto[1]"
      :image="site.photos.community"
    />

    <section class="contact__inner">
      <aside class="contact__channels">
        <h2 class="contact__heading">También por aquí</h2>
        <a class="contact__channel" :href="`mailto:${site.email}`">
          <i class="fa-regular fa-envelope" aria-hidden="true"></i>
          <span><small>Correo</small>{{ site.email }}</span>
        </a>
        <a
          v-if="settings.whatsapp"
          class="contact__channel"
          :href="whatsappLink(undefined, settings.whatsapp)"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          <span><small>WhatsApp</small>Chatea con el equipo</span>
        </a>
        <a
          v-if="settings.instagram"
          class="contact__channel"
          :href="settings.instagram"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-instagram" aria-hidden="true"></i>
          <span><small>Instagram</small>Síguenos y escríbenos</span>
        </a>
      </aside>

      <div v-if="sent" class="contact__done" role="status">
        <img :src="site.logos.iso" alt="" width="64" height="47" />
        <h2 class="contact__done-title">Mensaje enviado</h2>
        <p>Gracias por escribirnos. Te responderemos muy pronto a tu correo.</p>
        <button type="button" class="btn btn--ghost" @click="reset">Enviar otro mensaje</button>
      </div>

      <form v-else class="contact__form" novalidate @submit.prevent="submit">
        <div class="contact__field">
          <label for="contact-name">Nombre</label>
          <input id="contact-name" v-model="form.name" type="text" autocomplete="name" required />
          <p v-if="errors.name" class="contact__error">{{ errors.name }}</p>
        </div>

        <div class="contact__pair">
          <div class="contact__field">
            <label for="contact-email">Correo</label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              inputmode="email"
              required
            />
            <p v-if="errors.email" class="contact__error">{{ errors.email }}</p>
          </div>
          <div class="contact__field">
            <label for="contact-phone">Teléfono (opcional)</label>
            <input
              id="contact-phone"
              v-model="form.phone"
              type="tel"
              autocomplete="tel"
              inputmode="tel"
            />
          </div>
        </div>

        <div class="contact__field">
          <label for="contact-message">Mensaje</label>
          <textarea id="contact-message" v-model="form.message" rows="6" required></textarea>
          <p v-if="errors.message" class="contact__error">{{ errors.message }}</p>
        </div>

        <p v-if="failure" class="contact__error contact__error--block" role="alert">
          {{ failure }}
        </p>

        <button type="submit" class="btn btn--primary contact__submit" :disabled="sending">
          <i v-if="sending" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
          {{ sending ? 'Enviando' : 'Enviar mensaje' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.contact {
  @include flex(column, stretch);
  width: 100%;

  &__inner {
    @include container;
    @include flex(column-reverse, stretch, flex-start, 3.5rem);
    padding-block: $space-xl $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 5rem;
    }
  }

  &__channels {
    @include flex(column, stretch);

    @include from('md') {
      flex: 0 0 34%;
    }
  }

  &__heading {
    @include eyebrow;
    margin-bottom: 1rem;
  }

  &__channel {
    @include flex(row, center, flex-start, 1.1rem);
    min-height: 72px;
    padding-block: 1rem;
    border-top: 1px solid $line;
    font-weight: 500;
    color: $ink;
    overflow-wrap: anywhere;
    @include transition(color);

    &:last-child {
      border-bottom: 1px solid $line;
    }

    &:hover {
      color: $accent;
    }

    i {
      flex: 0 0 1.5rem;
      font-size: 1.3rem;
      text-align: center;
      color: $accent;
    }

    span {
      @include flex(column, flex-start);
      min-width: 0;
    }

    small {
      font-size: $text-xs;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: $ink-muted;
    }
  }

  &__form,
  &__done {
    @include flex(column, stretch, flex-start, 1.4rem);
    flex: 1;
    min-width: 0;
  }

  &__done {
    align-items: flex-start;
    color: $ink-soft;

    img {
      width: 64px;
      height: auto;
    }
  }

  &__done-title {
    @include display($display-sm);
    color: $ink;
  }

  &__pair {
    @include flex-cards(220px, 1.4rem);
  }

  &__field {
    min-width: 0;

    input,
    textarea {
      min-height: 48px;
      // 16 px evita el zoom automático de iOS al enfocar.
      font-size: 1rem;
      border-radius: 0;
    }

    textarea {
      resize: vertical;
    }
  }

  &__error {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $danger;

    &--block {
      margin: 0;
      padding: 0.9rem 1rem;
      background: $danger-bg;
    }
  }

  &__submit {
    align-self: stretch;

    @include from('sm') {
      align-self: flex-start;
    }
  }
}
</style>
