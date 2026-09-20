<script setup lang="ts">
import { computed } from 'vue'
import { formatCents } from '@/utils/format'
import type { CartLine } from '@/types'

const props = defineProps<{ line: CartLine }>()
const emit = defineEmits<{ quantity: [value: number]; remove: [] }>()

const quantity = computed(() => props.line.input.quantity)
const totalCents = computed(() => props.line.unitCents * quantity.value)
</script>

<template>
  <li class="line">
    <div class="line__media">
      <img v-if="line.image" :src="line.image" alt="" loading="lazy" />
      <i v-else class="fa-solid fa-music" aria-hidden="true"></i>
    </div>

    <div class="line__body">
      <div class="line__info">
        <h2 class="line__title">{{ line.title }}</h2>
        <p v-if="line.subtitle" class="line__subtitle">{{ line.subtitle }}</p>
        <p class="line__unit">{{ formatCents(line.unitCents) }} c/u</p>
      </div>

      <div class="line__controls">
        <p v-if="line.fixedQuantity" class="line__fixed">Cantidad: {{ quantity }}</p>
        <div v-else class="line__stepper" role="group" :aria-label="`Cantidad de ${line.title}`">
          <button
            type="button"
            aria-label="Quitar una unidad"
            :disabled="quantity <= 1"
            @click="emit('quantity', quantity - 1)"
          >
            <i class="fa-solid fa-minus"></i>
          </button>
          <span aria-live="polite">{{ quantity }}</span>
          <button
            type="button"
            aria-label="Agregar una unidad"
            :disabled="quantity >= 20"
            @click="emit('quantity', quantity + 1)"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <p class="line__total">{{ formatCents(totalCents) }}</p>

        <button class="line__remove" type="button" @click="emit('remove')">
          <i class="fa-regular fa-trash-can"></i>
          <span>Quitar</span>
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 1rem);
  padding-block: 1.25rem;
  border-bottom: 1px solid $line;

  &__media {
    @include flex(row, center, center);
    flex: 0 0 76px;
    height: 76px;
    overflow: hidden;
    border-radius: $radius-sm;
    background: $sand;
    color: $accent-deep;
    font-size: 1.3rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @include from('md') {
      flex-basis: 104px;
      height: 104px;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.75rem);
    flex: 1;
    min-width: 0;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  &__info {
    min-width: 0;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 700;
    line-height: 1.3;
    text-transform: none;
    overflow-wrap: anywhere;
  }

  &__subtitle,
  &__unit,
  &__fixed {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__controls {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;

    @include from('md') {
      flex-wrap: nowrap;
      flex-shrink: 0;
      gap: 1.25rem;
    }
  }

  &__stepper {
    @include flex(row, center, center);
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;

    button {
      width: 44px;
      height: 44px;
      font-size: 0.8rem;
      border-radius: $radius-pill;

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }

    span {
      min-width: 2ch;
      text-align: center;
      font-weight: 700;
    }
  }

  &__total {
    font-weight: 700;
    margin-left: auto;

    @include from('md') {
      min-width: 6.5ch;
      margin-left: 0;
      text-align: right;
    }
  }

  &__remove {
    @include flex(row, center, center, 0.4rem);
    min-height: 44px;
    padding-inline: 0.4rem;
    font-size: $text-sm;
    color: $ink-soft;

    &:hover {
      color: $danger;
    }
  }
}
</style>
