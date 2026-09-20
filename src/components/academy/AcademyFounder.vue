<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { useAsyncData } from '@/composables/useAsyncData'
import TeacherCard from '@/components/catalog/TeacherCard.vue'

// La reseña sale de los perfiles marcados como fundador en el panel: si no hay
// ninguno (o el API no responde), el bloque no se pinta.
const { data, run } = useAsyncData(() => catalogService.teachers())
const founders = computed(() => (data.value ?? []).filter((teacher) => teacher.isFounder))

onMounted(run)
</script>

<template>
  <section v-if="founders.length" class="founder">
    <div class="founder__inner">
      <TeacherCard v-for="teacher in founders" :key="teacher.id" :teacher="teacher" featured />
    </div>
  </section>
</template>

<style scoped lang="scss">
.founder {
  background: $sand;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 4rem);
    padding-block: $space-section;
  }
}
</style>
