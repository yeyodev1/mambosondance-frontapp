<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import QRCode from 'qrcode'
import { formatLongDate, formatTime, formatDate } from '@/utils/format'
import type { Ticket } from '@/types'

const props = defineProps<{ ticket: Ticket }>()

const qr = ref('')
const isValid = computed(() => props.ticket.status === 'valid')
const statusLabel = computed(() => {
  if (props.ticket.status === 'used') {
    return props.ticket.usedAt ? `Usada el ${formatDate(props.ticket.usedAt)}` : 'Usada'
  }
  return props.ticket.status === 'void' ? 'Anulada' : 'Válida'
})

onMounted(async () => {
  try {
    // Colores de marca con contraste suficiente para cualquier lector.
    qr.value = await QRCode.toDataURL(props.ticket.code, {
      margin: 1,
      width: 320,
      color: { dark: '#170705', light: '#ffffff' },
    })
  } catch {
    // Sin QR queda el código escrito, que el equipo también puede verificar.
  }
})
</script>

<template>
  <article class="ticket" :class="{ 'ticket--off': !isValid }">
    <div class="ticket__main">
      <p class="ticket__tier">{{ ticket.tierName }}</p>
      <h2 class="ticket__event">{{ ticket.event.title }}</h2>
      <p class="ticket__when">
        {{ formatLongDate(ticket.event.startsAt) }} · {{ formatTime(ticket.event.startsAt) }}
      </p>
      <p v-if="ticket.event.venue" class="ticket__venue">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ ticket.event.venue }}
      </p>
      <p class="ticket__holder"><span>Titular</span> {{ ticket.holderName }}</p>
    </div>

    <div class="ticket__stub">
      <img v-if="qr" class="ticket__qr" :src="qr" :alt="`Código QR de la entrada ${ticket.code}`" />
      <p class="ticket__code">{{ ticket.code }}</p>
      <p class="ticket__status" :class="`ticket__status--${ticket.status}`">{{ statusLabel }}</p>
    </div>
  </article>
</template>

<style scoped lang="scss">
.ticket {
  @include flex(column, stretch);
  overflow: hidden;
  border-radius: $radius-md;
  background: $wine;
  color: $on-dark;

  @include from('md') {
    flex-direction: row;
  }

  &--off {
    background: $ink-soft;
  }

  &__main {
    @include flex(column, flex-start, flex-start, 0.4rem);
    flex: 1;
    min-width: 0;
    padding: 1.4rem;
  }

  &__tier {
    @include eyebrow;
    color: $on-dark-soft;
  }

  &__event {
    @include display($text-xl);
    overflow-wrap: anywhere;
  }

  &__when::first-letter {
    text-transform: uppercase;
  }

  &__when,
  &__venue {
    font-size: $text-sm;
    color: $on-dark-soft;
  }

  &__holder {
    margin-top: auto;
    padding-top: 0.8rem;
    font-weight: 600;

    span {
      display: block;
      font-size: $text-xs;
      font-weight: 400;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $on-dark-soft;
    }
  }

  // El talón: papel claro con borde punteado, como el corte de un boleto.
  &__stub {
    @include flex(column, center, center, 0.5rem);
    padding: 1.4rem;
    background: $paper;
    color: $ink;
    border-top: 2px dashed $wine;

    @include from('md') {
      flex: 0 0 240px;
      border-top: none;
      border-left: 2px dashed $wine;
    }
  }

  &__qr {
    width: 168px;
    height: 168px;
    border-radius: $radius-sm;

    .ticket--off & {
      opacity: 0.25;
    }
  }

  &__code {
    font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    overflow-wrap: anywhere;
    text-align: center;

    .ticket--off & {
      text-decoration: line-through;
    }
  }

  &__status {
    padding: 0.25rem 0.8rem;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: $radius-pill;

    &--valid {
      color: $ink;
      background: $success-bg;
    }

    &--used {
      color: $ink-soft;
      background: $sand;
    }

    &--void {
      color: $danger;
      background: $danger-bg;
    }
  }
}
</style>
