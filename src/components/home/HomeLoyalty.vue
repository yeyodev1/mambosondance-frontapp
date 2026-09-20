<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { useSettingsStore } from '@/stores/settings'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import LoyaltyCardVisual from './LoyaltyCardVisual.vue'

const copy = site.home.loyalty
const settings = useSettingsStore()

// Muestra: un tercio de la tarjeta ya sellada, para que se entienda de un vistazo.
const sample = computed(() => Math.max(1, Math.round(settings.loyaltyStampsRequired / 3)))

onMounted(() => settings.load())
</script>

<template>
  <section v-if="settings.loyaltyEnabled" class="loyalty">
    <div class="loyalty__inner">
      <div class="loyalty__copy">
        <SectionHeading
          v-reveal
          tone="red"
          :eyebrow="copy.eyebrow"
          :title="copy.title"
          :script="copy.script"
          :text="copy.text"
        />
        <RouterLink v-reveal="120" :to="copy.cta.to" class="btn btn--light">
          {{ copy.cta.label }}
        </RouterLink>
      </div>

      <div v-reveal="160" class="loyalty__card">
        <LoyaltyCardVisual
          :required="settings.loyaltyStampsRequired"
          :filled="sample"
          :reward-text="settings.loyaltyRewardText"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.loyalty {
  position: relative;
  overflow: hidden;
  background: $accent;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3.5rem);
    padding-block: $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 2rem);
    flex: 1;
  }

  &__card {
    @include flex(row, center, center);
    // El giro de la tarjeta no debe asomar fuera de la pantalla en 360 px.
    padding-inline: 0.5rem;

    @include from('md') {
      flex: 0 0 46%;
    }
  }
}
</style>
