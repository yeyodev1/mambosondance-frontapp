<script setup lang="ts">
import { site } from '@/config/site'

withDefaults(
  defineProps<{
    items: readonly string[]
    /** `words`: valores en Balgin. `phrases`: frases largas, en texto fino. */
    variant?: 'words' | 'phrases'
    tone?: 'red' | 'night' | 'paper'
    reverse?: boolean
  }>(),
  { variant: 'words', tone: 'red', reverse: false },
)
</script>

<template>
  <div class="marquee" :class="[`marquee--${variant}`, `marquee--${tone}`]">
    <!-- La lista real se lee una vez; la copia que cierra el bucle es decorativa. -->
    <ul class="visually-hidden">
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
    <div class="marquee__track" :class="{ 'marquee__track--reverse': reverse }" aria-hidden="true">
      <div v-for="copy in 2" :key="copy" class="marquee__group">
        <template v-for="round in variant === 'words' ? 3 : 1" :key="round">
          <span v-for="item in items" :key="`${round}-${item}`" class="marquee__item">
            {{ item }}
            <img
              class="marquee__mark"
              :src="tone === 'paper' ? site.logos.iso : site.logos.isoWhite"
              alt=""
              width="34"
              height="25"
            />
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marquee {
  overflow: hidden;
  width: 100%;
  padding-block: 1.1rem;
  background: $accent;
  color: $on-dark;

  &--night {
    background: $night;
    border-block: 1px solid $line-dark;
  }

  &--paper {
    background: $paper;
    color: $ink;
    border-block: 1px solid $line;
  }

  &__track {
    display: flex;
    width: max-content;
    animation: marquee-slide 48s linear infinite;

    &--reverse {
      animation-direction: reverse;
    }

    @include reduced-motion {
      animation: none;
    }
  }

  &:hover &__track {
    animation-play-state: paused;
  }

  &__group {
    display: flex;
    flex: 0 0 auto;
  }

  &__item {
    @include flex(row, center, flex-start, 1.75rem);
    flex: 0 0 auto;
    padding-right: 1.75rem;
    white-space: nowrap;
  }

  &__mark {
    width: 1.6rem;
    height: auto;
    opacity: 0.85;
  }

  &--words &__item {
    @include display($text-xl, 600);
    letter-spacing: 0.06em;
  }

  &--phrases &__item {
    font-size: $text-lg;
    font-weight: 300;
    font-style: italic;
  }

  &--phrases &__track {
    animation-duration: 70s;
  }
}

@keyframes marquee-slide {
  to {
    transform: translateX(-50%);
  }
}
</style>
