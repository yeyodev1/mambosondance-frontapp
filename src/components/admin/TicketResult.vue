<script setup lang="ts">
import { computed } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { formatDateTime } from '@/composables/admin/dates'
import type { CheckResult } from '@/composables/admin/useTicketCheck'

// Pantalla completa y de un solo color: quien está en la puerta decide de un vistazo,
// de noche y con el celular en la mano.
const props = defineProps<{
  result: CheckResult | null
  busy: boolean
}>()

const emit = defineEmits<{ 'check-in': []; close: [] }>()

useBodyScroll(computed(() => Boolean(props.result)))

const view = computed(() => {
  const r = props.result
  if (!r) return null
  const used = r.ticket?.usedAt ? formatDateTime(r.ticket.usedAt) : ''
  switch (r.kind) {
    case 'valid':
      return {
        tone: 'ok',
        icon: 'fa-circle-check',
        title: 'Entrada válida',
        text: 'Todavía no ha ingresado.',
      }
    case 'checked':
      return { tone: 'ok', icon: 'fa-door-open', title: 'Ingreso marcado', text: 'Puede pasar.' }
    case 'used':
      return {
        tone: 'warn',
        icon: 'fa-triangle-exclamation',
        title: used ? `Ya fue usada el ${used}` : 'Ya fue usada',
        text: 'Esta entrada ya ingresó. No dejes pasar dos veces con el mismo código.',
      }
    case 'void':
      return {
        tone: 'bad',
        icon: 'fa-ban',
        title: 'Anulada',
        text: 'Esta entrada fue anulada y no sirve para ingresar.',
      }
    case 'missing':
      return {
        tone: 'bad',
        icon: 'fa-circle-xmark',
        title: 'No existe',
        text: 'Ese código no corresponde a ninguna entrada. Revisa que esté bien escrito.',
      }
    default:
      return {
        tone: 'bad',
        icon: 'fa-wifi',
        title: 'No se pudo verificar',
        text: r.message || 'Revisa la conexión e intenta de nuevo.',
      }
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="result && view"
        class="result"
        :class="`result--${view.tone}`"
        role="alertdialog"
        aria-modal="true"
        :aria-label="view.title"
      >
        <i class="fa-solid result__icon" :class="view.icon"></i>
        <h2 class="result__title">{{ view.title }}</h2>
        <p class="result__text">{{ view.text }}</p>
        <p class="result__code">{{ result.code }}</p>

        <dl v-if="result.ticket" class="result__data">
          <div class="result__pair">
            <dt>Titular</dt>
            <dd>{{ result.ticket.holderName || result.ticket.holderEmail }}</dd>
          </div>
          <div class="result__pair">
            <dt>Evento</dt>
            <dd>{{ result.ticket.event.title }}</dd>
          </div>
          <div class="result__pair">
            <dt>Entrada</dt>
            <dd>{{ result.ticket.tierName }}</dd>
          </div>
        </dl>

        <div class="result__actions">
          <button
            v-if="result.kind === 'valid'"
            type="button"
            class="btn btn--light btn--block result__main"
            :disabled="busy"
            @click="emit('check-in')"
          >
            <i class="fa-solid" :class="busy ? 'fa-circle-notch fa-spin' : 'fa-door-open'"></i>
            {{ busy ? 'Marcando…' : 'Marcar ingreso' }}
          </button>
          <button type="button" class="btn btn--outline-light btn--block" @click="emit('close')">
            Verificar otra entrada
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.result {
  position: fixed;
  inset: 0;
  z-index: 190;
  @include flex(column, center, center, 0.75rem);
  padding: 1.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));
  overflow-y: auto;
  text-align: center;
  color: $surface;

  &--ok {
    background: darken($success, 18);
  }

  &--warn {
    background: darken($warning, 22);
  }

  &--bad {
    background: $danger;
  }

  &__icon {
    font-size: 4.5rem;
  }

  &__title {
    @include display($display-md);
    max-width: 16ch;
  }

  &__text {
    max-width: 34ch;
    font-size: $text-lg;
    line-height: 1.4;
  }

  &__code {
    padding: 0.3rem 0.9rem;
    border: 1px solid rgba($surface, 0.5);
    border-radius: $radius-pill;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: $text-lg;
    font-weight: 700;
    letter-spacing: 0.14em;
  }

  &__data {
    @include flex(column, stretch, flex-start, 0.5rem);
    width: 100%;
    max-width: 420px;
    padding: 1rem;
    border-radius: $radius-md;
    background: rgba($night, 0.22);
    text-align: left;
  }

  &__pair {
    @include flex(row, baseline, space-between, 1rem);

    dt {
      flex: 0 0 auto;
      font-size: $text-sm;
      opacity: 0.8;
    }

    dd {
      font-weight: 700;
      text-align: right;
      overflow-wrap: anywhere;
    }
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
    width: 100%;
    max-width: 420px;
    margin-top: 0.5rem;
  }

  &__main {
    min-height: 64px;
    font-size: 1rem;
    color: $ink;
  }
}
</style>
