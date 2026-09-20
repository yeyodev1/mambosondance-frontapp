<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'

const roots = site.academy.roots
</script>

<template>
  <section class="roots">
    <div class="roots__inner">
      <SectionHeading v-reveal tone="night" :eyebrow="site.name" :title="roots.title" />

      <div class="roots__pair">
        <article
          v-for="(item, index) in roots.items"
          :key="item.name"
          v-reveal="index * 140"
          class="roots__item"
        >
          <h3 class="roots__name">
            {{ item.name }}
            <span class="roots__tag">{{ item.tag }}</span>
          </h3>
          <p class="roots__text">{{ item.text }}</p>
        </article>
      </div>

      <p v-reveal class="roots__closing">{{ roots.closing }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.roots {
  background: $night;
  color: $on-dark;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3.5rem);
    padding-block: $space-section;
  }

  &__pair {
    @include flex(column, stretch);

    @include from('md') {
      flex-direction: row;
    }
  }

  &__item {
    @include flex(column, flex-start, flex-start, 1.5rem);
    flex: 1;
    padding-block: 2.5rem;
    border-top: 1px solid $line-dark;

    @include from('md') {
      padding: 3rem 3rem 3rem 0;

      & + & {
        padding-left: 3rem;
        padding-right: 0;
        border-left: 1px solid $line-dark;
        // El segundo ritmo entra a destiempo: síncopa también en la composición.
        margin-top: 5rem;
      }
    }
  }

  &__name {
    @include display(clamp(4rem, 2.5rem + 8vw, 8.5rem));
    @include flex(column, flex-start);
    line-height: 0.85;

    // A dos columnas "MAMBO" debe caber entero en la suya.
    @include from('md') {
      font-size: min(8.8vw, 7rem);
    }
  }

  &__tag {
    @include script($display-sm);
    display: block;
    margin-top: -0.1em;
    padding-left: 0.4em;
    color: $accent;
    transform: rotate(-4deg);
    transform-origin: left bottom;
  }

  &__text {
    font-weight: 300;
    color: $on-dark-soft;
    max-width: 30rem;
  }

  &__closing {
    font-size: $text-xl;
    font-weight: 300;
    line-height: 1.45;
    max-width: 44rem;
    padding-left: 1.25rem;
    border-left: 2px solid $accent;
  }
}
</style>
