<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'

const classes = site.home.hero.primaryCta
</script>

<template>
  <section class="cta">
    <div class="cta__inner">
      <p v-reveal class="cta__phrase">{{ site.phrases[0] }}</p>
      <div v-reveal="120" class="cta__actions">
        <RouterLink :to="classes.to" class="btn btn--light">{{ classes.label }}</RouterLink>
        <RouterLink to="/profesores" class="btn btn--outline-light">
          Conoce a los profesores
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta {
  background: $accent;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column, flex-start, flex-start, 2.5rem);
    padding-block: $space-section;

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      gap: 4rem;
    }
  }

  &__phrase {
    @include display($display-md);
    max-width: 14em;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);
    width: 100%;

    @include from('sm') {
      flex-direction: row;
      flex-wrap: wrap;
      width: auto;
    }

    @include from('lg') {
      flex: 0 0 auto;
    }

    .btn--outline-light {
      border-color: rgba($on-dark, 0.8);
    }
  }
}
</style>
