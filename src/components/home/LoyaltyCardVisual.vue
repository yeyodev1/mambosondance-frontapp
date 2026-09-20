<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'

const props = withDefaults(
  defineProps<{
    required: number
    /** Sellos ya ganados. En el home es una muestra, no la tarjeta real del alumno. */
    filled?: number
    rewardText?: string
  }>(),
  { filled: 0, rewardText: '' },
)

// Cada sello cae con su propio giro, como estampado a mano.
const tilts = [-8, 5, -3, 9, -6, 4, -10, 7, -4, 6]

const stamps = computed(() =>
  Array.from({ length: Math.max(1, Math.min(props.required, 24)) }, (_, index) => ({
    index,
    filled: index < props.filled,
    last: index === Math.min(props.required, 24) - 1,
    tilt: tilts[index % tilts.length],
  })),
)
</script>

<template>
  <div class="card" role="img" :aria-label="`Tarjeta de ${required} sellos`">
    <div class="card__head">
      <img :src="site.logos.horizontal" alt="" width="150" height="25" />
      <span class="card__count">{{ filled }}/{{ required }}</span>
    </div>

    <ul class="card__stamps" aria-hidden="true">
      <li
        v-for="stamp in stamps"
        :key="stamp.index"
        class="card__stamp"
        :class="{ 'card__stamp--filled': stamp.filled, 'card__stamp--reward': stamp.last }"
        :style="{ '--tilt': `${stamp.tilt}deg` }"
      >
        <img v-if="stamp.filled" :src="site.logos.isoWhite" alt="" width="28" height="21" />
        <i v-else-if="stamp.last" class="fa-solid fa-gift"></i>
        <span v-else>{{ stamp.index + 1 }}</span>
      </li>
    </ul>

    <p v-if="rewardText" class="card__reward">{{ rewardText }}</p>
  </div>
</template>

<style scoped lang="scss">
.card {
  @include flex(column, stretch, flex-start, 1.4rem);
  width: 100%;
  max-width: 27rem;
  padding: 1.5rem 1.35rem;
  background: $paper;
  color: $ink;
  border-radius: $radius-md;
  box-shadow: 0 30px 60px rgba($wine, 0.45);
  transform: rotate(-3deg);

  @include from('md') {
    padding: 2rem 1.9rem;
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding-bottom: 1.1rem;
    border-bottom: 1px dashed $line;

    img {
      width: 130px;
      height: auto;
    }
  }

  &__count {
    font-family: $font-display;
    font-weight: 700;
    font-size: $text-lg;
    color: $accent;
  }

  &__stamps {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    list-style: none;
  }

  // Borde de puntos: el dentado de una estampilla.
  &__stamp {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 3rem;
    height: 3rem;
    border: 2px dotted $ink-muted;
    border-radius: 50%;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;

    @include from('md') {
      width: 3.6rem;
      height: 3.6rem;
    }

    &--filled {
      border: 2px dotted $paper;
      outline: 2px solid $accent;
      outline-offset: -1px;
      background: $accent;
      transform: rotate(var(--tilt));

      img {
        width: 55%;
        height: auto;
      }
    }

    &--reward:not(.card__stamp--filled) {
      border-color: $accent;
      color: $accent;
      font-size: 1.05rem;
    }
  }

  &__reward {
    padding-top: 1rem;
    border-top: 1px dashed $line;
    font-size: $text-sm;
    font-weight: 500;
    text-align: center;
    color: $ink-soft;
  }
}
</style>
