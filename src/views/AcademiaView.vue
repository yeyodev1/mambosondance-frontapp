<script setup lang="ts">
import { site } from '@/config/site'
import PageHero from '@/components/ui/PageHero.vue'
import BrandMarquee from '@/components/ui/BrandMarquee.vue'
import AcademyManifesto from '@/components/academy/AcademyManifesto.vue'
import AcademyConcept from '@/components/academy/AcademyConcept.vue'
import AcademyRoots from '@/components/academy/AcademyRoots.vue'
import AcademyValues from '@/components/academy/AcademyValues.vue'
import AcademyFounder from '@/components/academy/AcademyFounder.vue'
import AcademyCta from '@/components/academy/AcademyCta.vue'

const academy = site.academy
// Mientras el cliente no entregue la reseña del fundador, el bloque no existe.
const showFounder = !(academy.founderPending as boolean)
</script>

<template>
  <div class="academy">
    <PageHero
      :eyebrow="academy.eyebrow"
      :title="academy.title"
      :script="academy.script"
      :image="site.photos.social"
    />
    <AcademyManifesto />
    <AcademyConcept />
    <AcademyRoots />
    <AcademyValues />
    <AcademyFounder v-if="showFounder" />
    <BrandMarquee :items="site.phrases" variant="phrases" tone="paper" />
    <AcademyCta />
  </div>
</template>

<style scoped lang="scss">
.academy {
  @include flex(column, stretch);
  width: 100%;
  overflow-x: clip;
}
</style>
