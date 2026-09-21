<script setup lang="ts">
// Los ocho tiempos de la salsa. El 4 y el 8 son pausas: no se pisan, y acá
// tampoco se encienden. La animación recorre el compás en bucle con solo CSS.
defineProps<{ label: string; pauseLabel: string }>()

const beats = [1, 2, 3, 4, 5, 6, 7, 8]
const isPause = (beat: number) => beat % 4 === 0
</script>

<template>
  <ol class="beats" :aria-label="label">
    <li
      v-for="beat in beats"
      :key="beat"
      class="beats__item"
      :class="{ 'beats__item--pause': isPause(beat) }"
      :style="{ '--i': beat - 1 }"
    >
      <span class="beats__dot">{{ beat }}</span>
      <span v-if="isPause(beat)" class="beats__pause">{{ pauseLabel }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
@use 'sass:color';

$beat: 0.55s;

.beats {
  display: flex;
  gap: 0.4rem;
  list-style: none;

  @include from('md') {
    gap: 0.6rem;
  }

  // Los ocho tiempos caben siempre en una sola fila: el compás no se parte.
  &__item {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  &__dot {
    @include flex(row, center, center);
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid $line-dark;
    border-radius: 50%;
    font-size: $text-sm;
    font-weight: 700;
    color: $on-dark-soft;
    animation: beat-on ($beat * 8) linear infinite;
    animation-delay: calc(var(--i) * #{$beat});

    @include from('md') {
      font-size: $text-base;
    }
  }

  // La pausa: trazo punteado, sin relleno y sin encenderse nunca.
  &__item--pause &__dot {
    border-style: dashed;
    border-color: $accent;
    background: rgba($accent, 0.14);
    color: color.scale($accent, $lightness: 22%);
    animation-name: beat-rest;
  }

  // En el 8, el rótulo se alinea a la derecha para no salirse a 360 px.
  &__item:last-child &__pause {
    right: 0;
  }

  &__pause {
    position: absolute;
    top: 100%;
    margin-top: 0.35rem;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: color.scale($accent, $lightness: 22%);
  }
}

@keyframes beat-on {
  0%,
  11% {
    background: $accent;
    border-color: $accent;
    color: $surface;
    transform: scale(1.12);
  }
  14%,
  100% {
    background: transparent;
    border-color: $line-dark;
    color: $on-dark-soft;
    transform: scale(1);
  }
}

// En la pausa el círculo solo respira.
@keyframes beat-rest {
  0%,
  11% {
    transform: scale(0.88);
  }
  14%,
  100% {
    transform: scale(1);
  }
}
</style>
