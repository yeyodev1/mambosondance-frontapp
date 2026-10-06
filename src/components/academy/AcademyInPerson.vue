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
      <div class="in-person__top">
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

      <div class="in-person__pensum">
        <h3 v-reveal class="in-person__pensum-title">{{ inPerson.pensumTitle }}</h3>
        <!-- El orden es el recorrido del alumno: de básicos al intermedio On2. -->
        <ol class="in-person__levels">
          <li
            v-for="(level, index) in inPerson.pensum"
            :key="level.level"
            v-reveal="index * 60"
            class="in-person__level"
          >
            <p class="in-person__level-name">{{ level.level }}</p>
            <ul class="in-person__level-items">
              <li v-for="item in level.items" :key="item">{{ item }}</li>
            </ul>
          </li>
        </ol>
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
    @include flex(column, stretch, flex-start, 4rem);
    padding-block: $space-section;
  }

  &__top {
    @include flex(column, stretch, flex-start, 3rem);

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
      flex: 0 0 22rem;
    }
  }

  &__venue {
    @include display($text-xl, 700);
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__pensum {
    @include flex(column, stretch, flex-start, 1.75rem);
  }

  &__pensum-title {
    @include display($display-sm);
  }

  &__levels {
    @include flex-cards(240px, 1px);
    list-style: none;
    // Las líneas entre niveles salen del espacio de 1px sobre este fondo.
    background: rgba($on-dark, 0.28);
    border: 1px solid rgba($on-dark, 0.28);
  }

  &__level {
    @include flex(column, flex-start, flex-start, 0.9rem);
    padding: 1.5rem 1.4rem;
    background: $accent;
  }

  &__level-name {
    @include display($text-lg, 700);
    letter-spacing: 0.04em;
  }

  &__level-items {
    @include flex(column, stretch, flex-start, 0.4rem);
    padding-left: 1.1rem;
    font-size: $text-sm;
    font-weight: 300;
    line-height: 1.5;
    color: rgba($on-dark, 0.92);
  }
}
</style>
