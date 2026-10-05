<script setup lang="ts">
import { onMounted } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { useSettingsStore } from '@/stores/settings'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const inPerson = site.academy.inPerson
const settings = useSettingsStore()

onMounted(() => settings.load())
</script>

<template>
  <section class="in-person">
    <div class="in-person__inner">
      <SectionHeading
        v-reveal
        tone="red"
        :eyebrow="inPerson.eyebrow"
        :title="inPerson.title"
        :script="inPerson.script"
        :text="inPerson.text"
      />

      <div v-reveal="120" class="in-person__card">
        <p class="in-person__venue">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ inPerson.venue }}
        </p>

        <ol v-if="inPerson.pensum.length" class="in-person__pensum">
          <li v-for="item in inPerson.pensum" :key="item">{{ item }}</li>
        </ol>
        <p v-else class="in-person__pending">{{ inPerson.pensumPending }}</p>

        <a
          v-if="settings.whatsapp"
          class="btn btn--light"
          :href="whatsappLink(inPerson.cta.message, settings.whatsapp)"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ inPerson.cta.label }}
        </a>
        <RouterLink v-else to="/contacto" class="btn btn--light">
          {{ inPerson.cta.label }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.in-person {
  background: $accent;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: $space-section;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 5rem;
    }
  }

  &__card {
    @include flex(column, flex-start, flex-start, 1.5rem);
    padding: 2rem 1.75rem;
    border: 1px solid rgba($on-dark, 0.35);

    @include from('lg') {
      flex: 0 0 26rem;
    }
  }

  &__venue {
    @include display($text-xl, 700);
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__pensum {
    @include flex(column, stretch, flex-start, 0.5rem);
    padding-left: 1.2rem;
  }

  &__pending {
    font-weight: 300;
    color: rgba($on-dark, 0.88);
  }
}
</style>
