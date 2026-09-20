<script setup lang="ts">
import EmptyState from './EmptyState.vue'

// Las tres caras de cualquier bloque con datos del API: carga, error y vacío.
withDefaults(
  defineProps<{
    loading: boolean
    error?: string
    empty?: boolean
    emptyTitle?: string
    emptyText?: string
    tone?: 'light' | 'dark'
  }>(),
  { error: '', empty: false, emptyTitle: '', emptyText: '', tone: 'light' },
)

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="loading" class="async" aria-busy="true">
    <span class="visually-hidden">Cargando…</span>
    <slot name="skeleton" />
  </div>

  <EmptyState v-else-if="error" title="No pudimos cargar esto" :text="error" :tone="tone">
    <button
      type="button"
      class="btn"
      :class="tone === 'dark' ? 'btn--outline-light' : 'btn--ghost'"
      @click="emit('retry')"
    >
      <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
    </button>
    <slot name="error-actions" />
  </EmptyState>

  <EmptyState v-else-if="empty" :title="emptyTitle" :text="emptyText" :tone="tone">
    <slot name="empty-actions" />
  </EmptyState>

  <slot v-else />
</template>

<style scoped lang="scss">
.async {
  width: 100%;
}
</style>
