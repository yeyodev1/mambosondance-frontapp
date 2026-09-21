<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { studentCopy } from '@/config/student'
import { useSettingsStore } from '@/stores/settings'
import WhatsappFab from '@/components/ui/WhatsappFab.vue'

const settings = useSettingsStore()
const year = new Date().getFullYear()

// Las redes se pintan solo si existen: nada de íconos que no llevan a ningún lado.
const socials = computed(() =>
  [
    { label: 'Instagram', icon: 'fa-brands fa-instagram', url: settings.instagram },
    { label: 'Facebook', icon: 'fa-brands fa-facebook-f', url: site.social.facebook as string },
    { label: 'TikTok', icon: 'fa-brands fa-tiktok', url: site.social.tiktok as string },
  ].filter((social) => social.url),
)

onMounted(() => settings.load())
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" :aria-label="`${site.name}, inicio`">
          <img
            class="footer__logo"
            :src="site.logos.verticalWhite"
            :alt="site.name"
            width="190"
            height="140"
            loading="lazy"
          />
        </RouterLink>
        <p class="footer__tagline">{{ site.footer.text }}</p>
      </div>

      <nav class="footer__col" aria-label="Pie de página">
        <h2 class="footer__heading">Navegación</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="footer__link">
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/contacto" class="footer__link">Contacto</RouterLink>
        <!-- Quien compró sin cuenta vuelve al sitio buscando esto: va a la vista, no escondido. -->
        <RouterLink :to="{ name: 'FindPurchase' }" class="footer__link">
          {{ studentCopy.auth.findPurchase.navLabel }}
        </RouterLink>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">Contacto</h2>
        <a class="footer__link" :href="`mailto:${site.email}`">{{ site.email }}</a>
        <a
          v-if="settings.whatsapp"
          class="footer__link"
          :href="whatsappLink(undefined, settings.whatsapp)"
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
        <span v-if="site.city" class="footer__link footer__link--static">{{ site.city }}</span>

        <div v-if="socials.length" class="footer__social">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            :aria-label="social.label"
            target="_blank"
            rel="noopener"
          >
            <i :class="social.icon" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>

    <p class="footer__script" aria-hidden="true">{{ site.home.hero.script }}</p>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.legalName }}</span>
      <a :href="site.footer.creditUrl" target="_blank" rel="noopener">{{ site.footer.credit }}</a>
    </div>

    <WhatsappFab />
  </footer>
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  overflow: hidden;
  margin-top: auto;
  background: $night;
  color: $on-dark-soft;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.75rem);
    position: relative;
    z-index: 1;
    padding-block: $space-xl 2.5rem;

    @include from('md') {
      flex-direction: row;
      justify-content: space-between;
      gap: 3rem;
    }
  }

  &__brand {
    @include flex(column, flex-start, flex-start, 1.25rem);

    @include from('md') {
      flex: 0 1 22rem;
    }
  }

  &__logo {
    width: 150px;
    height: auto;

    @include from('md') {
      width: 190px;
    }
  }

  &__tagline {
    font-size: $text-sm;
    font-weight: 300;
    max-width: 30ch;
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  &__heading {
    @include eyebrow;
    color: $on-dark;
    margin-bottom: 0.6rem;
  }

  &__link {
    @include flex(row, center);
    min-height: 44px;
    font-size: $text-sm;
    color: $on-dark-soft;
    overflow-wrap: anywhere;
    @include transition(color);

    @include from('md') {
      min-height: 36px;
    }

    &:hover {
      color: $on-dark;
    }

    &--static:hover {
      color: $on-dark-soft;
    }
  }

  &__social {
    @include flex(row, center, flex-start, 0.25rem);
    margin-top: 0.5rem;
    margin-left: -0.75rem;

    a {
      @include flex(row, center, center);
      width: 44px;
      height: 44px;
      font-size: 1.15rem;
      color: $on-dark;
      @include transition(color);

      &:hover {
        color: $accent;
      }
    }
  }

  // La firma manuscrita de la marca, como marca de agua al pie.
  &__script {
    @include script(clamp(4rem, 18vw, 13rem));
    position: absolute;
    right: -0.05em;
    bottom: 0.15em;
    color: rgba($accent, 0.16);
    transform: rotate(-4deg);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 0.5rem 1.5rem);
    position: relative;
    z-index: 1;
    flex-wrap: wrap;
    padding-block: 1.25rem;
    // Deja libre la esquina del botón flotante de WhatsApp en el celular.
    padding-right: 5rem;
    border-top: 1px solid $line-dark;
    font-size: $text-xs;

    @include from('md') {
      padding-right: 5.5rem;
    }

    a {
      @include flex(row, center);
      min-height: 44px;
      color: $on-dark;
    }
  }
}
</style>
