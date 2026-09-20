<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'

const props = defineProps<{ required: number; count: number; reward: string; holder?: string }>()

const slots = computed(() =>
  Array.from({ length: Math.max(props.required, 1) }, (_, i) => i < props.count),
)
</script>

<template>
  <div class="card">
    <div class="card__top">
      <img class="card__logo" :src="site.logos.horizontalWhite" :alt="site.name" />
      <p class="card__count" aria-live="polite">
        <strong>{{ Math.min(count, required) }}</strong> de {{ required }}
      </p>
    </div>

    <ul class="card__stamps" :aria-label="`${count} de ${required} sellos`">
      <li
        v-for="(stamped, i) in slots"
        :key="i"
        class="card__stamp"
        :class="{ 'card__stamp--on': stamped }"
      >
        <img v-if="stamped" :src="site.logos.isoWhite" alt="" />
        <span v-else>{{ i + 1 }}</span>
      </li>
    </ul>

    <div class="card__bottom">
      <p class="card__reward"><span>Tu premio</span> {{ reward }}</p>
      <p v-if="holder" class="card__holder">{{ holder }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  @include flex(column, stretch, flex-start, 1.4rem);
  width: 100%;
  max-width: 480px;
  padding: 1.4rem;
  color: $on-dark;
  background: $accent;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;

  @include from('md') {
    padding: 1.8rem;
  }

  &__top {
    @include flex(row, center, space-between, 1rem);
  }

  &__logo {
    width: 128px;
  }

  &__count {
    font-size: $text-sm;
    white-space: nowrap;

    strong {
      font-family: $font-display;
      font-size: $display-sm;
      line-height: 1;
    }
  }

  // Cinco por fila: los sellos mantienen tamaño de dedo incluso a 360 px.
  &__stamps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    list-style: none;
  }

  &__stamp {
    @include flex(row, center, center);
    flex: 0 0 calc((100% - 2.4rem) / 5);
    aspect-ratio: 1;
    font-size: $text-sm;
    font-weight: 700;
    color: rgba($on-dark, 0.6);
    border: 1.5px dashed rgba($on-dark, 0.5);
    border-radius: 50%;

    &--on {
      background: $wine;
      border: 1.5px solid $wine;
      transform: rotate(-8deg);
    }

    img {
      width: 62%;
    }
  }

  &__bottom {
    @include flex(column, flex-start, flex-start, 0.5rem);
    padding-top: 1rem;
    border-top: 1px solid rgba($on-dark, 0.25);
  }

  &__reward {
    font-weight: 600;
    line-height: 1.4;

    span {
      display: block;
      font-size: $text-xs;
      font-weight: 400;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      opacity: 0.8;
    }
  }

  &__holder {
    font-family: $font-display;
    font-size: $text-sm;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.85;
  }
}
</style>
