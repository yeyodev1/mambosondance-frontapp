<script setup lang="ts">
import { computed } from 'vue'
import type { EventItem } from '@/types'
import { isPastEvent } from '@/utils/events'
import EventTickets from './EventTickets.vue'

const props = defineProps<{ event: EventItem }>()

const past = computed(() => isPastEvent(props.event))

// Cómo se consigue la entrada cuando no se vende en la web.
const channel = computed(() => {
  if (!props.event.contactUrl) return null
  if (props.event.salesMode === 'whatsapp') {
    return { icon: 'fa-brands fa-whatsapp', label: 'Reservar por WhatsApp' }
  }
  if (props.event.salesMode === 'instagram') {
    return { icon: 'fa-brands fa-instagram', label: 'Reservar por Instagram' }
  }
  if (props.event.salesMode === 'info') {
    return { icon: 'fa-solid fa-arrow-up-right-from-square', label: 'Más información' }
  }
  return null
})
</script>

<template>
  <div v-if="past" class="access access--past">
    <h2 class="access__heading">Este evento ya pasó</h2>
    <p class="access__text">Gracias a quienes lo bailaron con nosotros. Mira lo que viene.</p>
    <RouterLink to="/eventos" class="btn btn--dark btn--block">Ver próximos eventos</RouterLink>
  </div>

  <EventTickets v-else-if="event.salesMode === 'online' && event.tiers.length" :event="event" />

  <div v-else-if="channel" class="access">
    <h2 class="access__heading">Entradas</h2>
    <p class="access__text">
      Las entradas de este evento se reservan directamente con el equipo de la academia.
    </p>
    <a :href="event.contactUrl" class="btn btn--primary btn--block" target="_blank" rel="noopener">
      <i :class="channel.icon" aria-hidden="true"></i> {{ channel.label }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.access {
  @include flex(column, stretch, flex-start, 1.25rem);
  padding: 1.75rem 1.25rem;
  background: $sand;
  border-top: 3px solid $accent;

  @include from('md') {
    padding: 2.25rem 2rem;
  }

  &--past {
    border-top-color: $ink;
  }

  &__heading {
    @include display($display-sm);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
