<script setup lang="ts">
import { site } from '@/config/site'

withDefaults(
  defineProps<{
    title?: string
    text?: string
    tone?: 'light' | 'dark'
  }>(),
  { title: '', text: '', tone: 'light' },
)
</script>

<template>
  <div class="empty" :class="`empty--${tone}`">
    <img
      class="empty__mark"
      :src="tone === 'dark' ? site.logos.isoWhite : site.logos.iso"
      alt=""
      width="64"
      height="47"
    />
    <h3 v-if="title" class="empty__title">{{ title }}</h3>
    <p v-if="text" class="empty__text">{{ text }}</p>
    <div v-if="$slots.default" class="empty__actions"><slot /></div>
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.9rem);
  width: 100%;
  text-align: center;
  padding: 3.5rem 1.25rem;
  border-block: 1px solid $line;

  &__mark {
    width: 64px;
    height: auto;
    opacity: 0.9;
    margin-bottom: 0.4rem;
  }

  &__title {
    @include display($text-xl, 600);
    color: $ink;
  }

  &__text {
    font-size: $text-base;
    font-weight: 300;
    color: $ink-soft;
    max-width: 34rem;
  }

  &__actions {
    @include flex(row, center, center, 0.75rem);
    flex-wrap: wrap;
    margin-top: 0.6rem;
  }

  &--dark {
    border-color: $line-dark;

    .empty__title {
      color: $on-dark;
    }

    .empty__text {
      color: $on-dark-soft;
    }
  }
}
</style>
