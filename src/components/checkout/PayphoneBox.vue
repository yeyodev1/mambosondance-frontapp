<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue'
import { usePayphone } from '@/composables/usePayphone'
import { studentCopy } from '@/config/student'
import type { PayphoneConfig } from '@/types'

// El padre monta este componente con :key="clientTransactionId": cada intento de
// pago es un componente nuevo con su propio formulario de Payphone.
const props = defineProps<{
  config: PayphoneConfig
  remaining: number
  expired: boolean
  regenerating?: boolean
}>()

defineEmits<{ regenerate: [] }>()

const copy = studentCopy.checkout
const { status, mount } = usePayphone()

const clock = computed(() => {
  const minutes = Math.floor(props.remaining / 60)
  const seconds = String(props.remaining % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

async function render() {
  await nextTick()
  mount(props.config, 'pp-button')
}

onMounted(render)
</script>

<template>
  <section class="paybox">
    <header class="paybox__head">
      <div>
        <h2 class="paybox__title">{{ copy.payTitle }}</h2>
        <p class="paybox__text">{{ copy.payText }}</p>
      </div>
      <p
        v-if="!expired"
        class="paybox__timer"
        :class="{ 'paybox__timer--low': remaining <= 60 }"
        role="timer"
        :aria-label="`Tiempo restante para pagar: ${clock}`"
      >
        <i class="fa-regular fa-clock" aria-hidden="true"></i> {{ clock }}
      </p>
    </header>

    <div v-if="expired" class="paybox__state" role="alert">
      <i class="fa-regular fa-hourglass"></i>
      <h3>{{ copy.expiredTitle }}</h3>
      <p>{{ copy.expiredText }}</p>
      <button
        class="btn btn--primary"
        type="button"
        :disabled="regenerating"
        @click="$emit('regenerate')"
      >
        <i v-if="regenerating" class="fa-solid fa-circle-notch fa-spin"></i>
        Generar nuevo intento
      </button>
    </div>

    <template v-else>
      <div v-if="status === 'loading' || status === 'idle'" class="paybox__state" role="status">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <p>Cargando el formulario de pago seguro…</p>
      </div>

      <div v-else-if="status === 'error'" class="paybox__state" role="alert">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>No pudimos cargar el formulario de Payphone. Revisa tu conexión e inténtalo otra vez.</p>
        <button class="btn btn--ghost" type="button" @click="render">Reintentar</button>
      </div>

      <!-- El interior es de Payphone; sus clases se ajustan en global.scss. -->
      <div id="pp-button" class="paybox__box"></div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.paybox {
  @include flex(column, stretch, flex-start, $space-md);
  min-width: 0;

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__title {
    @include display($text-xl, 600);
    margin-bottom: 0.3rem;
  }

  &__text {
    max-width: 46ch;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__timer {
    @include flex(row, center, center, 0.45rem);
    padding: 0.45rem 0.9rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: $wine;
    background: $sand;
    border-radius: $radius-pill;

    &--low {
      color: $surface;
      background: $accent;
    }
  }

  &__state {
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    padding: $space-lg 1rem;
    border: 1px dashed $line;
    border-radius: $radius-md;
    font-size: $text-sm;
    color: $ink-soft;

    > i {
      font-size: 1.5rem;
      color: $accent;
    }

    h3 {
      @include display($text-lg, 600);
      color: $ink;
    }

    p {
      max-width: 44ch;
    }
  }

  &__box {
    width: 100%;
    min-width: 0;
  }
}
</style>
