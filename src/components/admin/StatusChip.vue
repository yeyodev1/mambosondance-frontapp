<script setup lang="ts">
import type { Tone } from '@/composables/admin/labels'

withDefaults(
  defineProps<{
    label: string
    tone?: Tone
    /** Nombre del ícono de Font Awesome sin el prefijo de estilo, ej. `fa-ban`. */
    icon?: string
  }>(),
  { tone: 'neutral' },
)
</script>

<template>
  <span class="chip" :class="`chip--${tone}`">
    <i v-if="icon" class="fa-solid" :class="[icon, { 'fa-spin': icon === 'fa-spinner' }]"></i>
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.22rem 0.65rem;
  border-radius: $radius-pill;
  font-size: $text-xs;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;

  // Los tonos de estado son claros: se oscurecen para que el texto se lea.
  &--success {
    background: $success-bg;
    color: darken($success, 22);
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 25);
  }

  &--danger {
    background: $danger-bg;
    color: $danger;
  }

  &--info {
    background: $info-bg;
    color: darken($info, 20);
  }

  &--neutral {
    background: $sand;
    color: $ink-soft;
  }
}
</style>
