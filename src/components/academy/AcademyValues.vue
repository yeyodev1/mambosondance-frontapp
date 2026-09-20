<script setup lang="ts">
import { site } from '@/config/site'
import { vReveal } from '@/composables/useReveal'
</script>

<template>
  <section class="values" aria-label="Valores">
    <ol class="values__list">
      <li
        v-for="(value, index) in site.academy.values"
        :key="value"
        v-reveal="index * 70"
        class="values__item"
      >
        <span class="values__index">0{{ index + 1 }}</span>
        <span class="values__word">{{ value }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
.values {
  background: $paper;

  &__list {
    @include container;
    @include flex(column, stretch);
    padding-block: $space-section;
    list-style: none;
  }

  &__item {
    @include flex(row, baseline, flex-start, 1.25rem);
    padding-block: 1.1rem;
    border-bottom: 1px solid $line;
    color: $ink;
    transition:
      color 0.4s ease,
      padding-left 0.6s $ease;

    &:first-child {
      border-top: 1px solid $line;
    }

    @include from('md') {
      gap: 3rem;
      padding-block: 1.5rem;

      &:hover {
        color: $accent;
        padding-left: 1.5rem;
      }
    }
  }

  &__index {
    flex: 0 0 2rem;
    font-size: $text-xs;
    font-weight: 500;
    letter-spacing: 0.12em;
    color: $ink-muted;
  }

  &__word {
    @include display(clamp(2.4rem, 1.4rem + 5.5vw, 6rem));
    overflow-wrap: anywhere;
  }
}
</style>
