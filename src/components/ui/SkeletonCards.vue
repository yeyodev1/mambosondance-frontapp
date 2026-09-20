<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    ratio?: string
    basis?: string
    tone?: 'light' | 'dark'
  }>(),
  { count: 3, ratio: '4/5', basis: '260px', tone: 'light' },
)
</script>

<template>
  <div class="skeleton" :class="`skeleton--${tone}`" aria-hidden="true">
    <div v-for="n in count" :key="n" class="skeleton__card" :style="{ flexBasis: basis }">
      <div class="skeleton__media" :style="{ aspectRatio: ratio }"></div>
      <div class="skeleton__line skeleton__line--short"></div>
      <div class="skeleton__line"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  width: 100%;

  &__card {
    @include flex(column, stretch, flex-start, 0.7rem);
    flex: 1 1 260px;
    min-width: 0;
  }

  &__media,
  &__line {
    background: $sand;
    animation: skeleton-pulse 1.6s ease-in-out infinite;
  }

  &__line {
    height: 0.8rem;
    width: 80%;

    &--short {
      width: 35%;
    }
  }

  &--dark &__media,
  &--dark &__line {
    background: rgba($on-dark, 0.08);
  }
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
