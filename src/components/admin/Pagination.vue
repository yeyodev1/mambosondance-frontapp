<script setup lang="ts">
defineProps<{
  page: number
  pages: number
  total?: number
}>()

const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav v-if="pages > 1" class="pagination" aria-label="Páginas">
    <button
      type="button"
      class="adm-action"
      :disabled="page <= 1"
      aria-label="Página anterior"
      @click="emit('change', page - 1)"
    >
      <i class="fa-solid fa-chevron-left"></i>
      Anterior
    </button>
    <span class="pagination__info">
      Página {{ page }} de {{ pages }}
      <span v-if="total !== undefined" class="pagination__total">· {{ total }} en total</span>
    </span>
    <button
      type="button"
      class="adm-action"
      :disabled="page >= pages"
      aria-label="Página siguiente"
      @click="emit('change', page + 1)"
    >
      Siguiente
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
  @include flex(row, center, space-between, 0.6rem);
  flex-wrap: wrap;
  padding-top: 0.5rem;

  &__info {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;
    flex: 1 1 auto;
  }

  &__total {
    color: $ink-muted;
  }
}
</style>
