<script setup lang="ts">
defineProps<{ visible: boolean; loading: boolean }>()
const emit = defineEmits<{ more: [] }>()
</script>

<template>
  <div v-if="visible" class="load-more">
    <button type="button" class="btn btn--ghost" :disabled="loading" @click="emit('more')">
      <i v-if="loading" class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
      {{ loading ? 'Cargando' : 'Ver más' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.load-more {
  @include flex(row, center, center);
  padding-top: 3rem;
}
</style>
