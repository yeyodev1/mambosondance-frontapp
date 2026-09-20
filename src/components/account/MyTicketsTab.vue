<script setup lang="ts">
import { computed, onMounted } from 'vue'
import StateBlock from './StateBlock.vue'
import TicketCard from './TicketCard.vue'
import { useRequest } from '@/composables/useRequest'
import { meService } from '@/services/me.service'
import { studentCopy } from '@/config/student'

const { data: tickets, loading, error, run } = useRequest(() => meService.tickets())

// Primero las que todavía sirven y, entre ellas, la fecha más cercana.
const sorted = computed(() =>
  [...(tickets.value ?? [])].sort((a, b) => {
    if ((a.status === 'valid') !== (b.status === 'valid')) return a.status === 'valid' ? -1 : 1
    return new Date(a.event.startsAt).getTime() - new Date(b.event.startsAt).getTime()
  }),
)

onMounted(run)
</script>

<template>
  <StateBlock v-if="loading" kind="loading" text="Cargando tus entradas…" />
  <StateBlock v-else-if="error" kind="error" :text="error" @retry="run" />
  <StateBlock
    v-else-if="!sorted.length"
    kind="empty"
    icon="fa-solid fa-ticket"
    title="Aún no tienes entradas"
    :text="studentCopy.account.ticketsEmpty"
  >
    <RouterLink class="btn btn--primary" to="/eventos">Ver eventos</RouterLink>
  </StateBlock>

  <div v-else class="tickets">
    <p class="tickets__hint">Muestra el código QR en la entrada del evento.</p>
    <TicketCard v-for="ticket in sorted" :key="ticket.id" :ticket="ticket" />
  </div>
</template>

<style scoped lang="scss">
.tickets {
  @include flex(column, stretch, flex-start, 1.25rem);
  max-width: 760px;

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
