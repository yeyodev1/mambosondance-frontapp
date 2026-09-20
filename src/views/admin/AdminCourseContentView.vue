<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import CourseModuleBlock from '@/components/admin/CourseModuleBlock.vue'
import InlineAdd from '@/components/admin/InlineAdd.vue'
import { provideCourseContent } from '@/composables/admin/useCourseContent'
import { formatDuration } from '@/utils/format'

const route = useRoute()
const id = computed(() => String(route.params.id))
const { course, loading, error, busy, load, addModule } = provideCourseContent(() => id.value)

const summary = computed(() => {
  const modules = course.value?.modules ?? []
  const lessons = modules.flatMap((m) => m.lessons)
  const ready = lessons.filter((l) => l.videoStatus === 'ready')
  const seconds = ready.reduce((sum, l) => sum + (l.durationSeconds || 0), 0)
  return {
    modules: modules.length,
    lessons: lessons.length,
    ready: ready.length,
    duration: seconds ? formatDuration(seconds) : '',
  }
})

watch(id, load, { immediate: true })
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      :title="course?.title || 'Contenido del curso'"
      subtitle="Organiza las clases en módulos, y dentro de cada módulo sube una lección por video."
      :back="{ name: 'AdminProductEdit', params: { id } }"
      back-label="Datos y precio del paquete"
    />

    <AdminState :loading="loading" :error="error" @retry="load">
      <div v-if="course" class="adm-stack">
        <p v-if="course.type !== 'course'" class="notice" role="alert">
          Este producto es de la tienda y no lleva videos.
        </p>

        <template v-else>
          <p class="notice">
            <i class="fa-solid fa-circle-info"></i>
            {{ summary.modules }} {{ summary.modules === 1 ? 'módulo' : 'módulos' }} ·
            {{ summary.lessons }} {{ summary.lessons === 1 ? 'lección' : 'lecciones' }} ·
            {{ summary.ready }} con video listo
            <template v-if="summary.duration"> · {{ summary.duration }}</template>
          </p>

          <AdminState
            :empty="!course.modules.length"
            empty-icon="fa-solid fa-layer-group"
            empty-title="Empieza creando un módulo"
            empty-text="Un módulo agrupa lecciones, por ejemplo «Semana 1» o «Pasos básicos». Créalo aquí abajo."
          >
            <CourseModuleBlock
              v-for="(module, index) in course.modules"
              :key="module.id"
              :module="module"
              :index="index"
              :count="course.modules.length"
            />
          </AdminState>

          <AdminCard title="Nuevo módulo" icon="fa-solid fa-layer-group">
            <InlineAdd
              label="Nombre del módulo"
              placeholder="Ej.: Semana 1 — Fundamentos"
              button="Crear módulo"
              :busy="busy"
              @submit="addModule"
            />
          </AdminCard>
        </template>
      </div>
    </AdminState>
  </div>
</template>

<style scoped lang="scss">
.notice {
  padding: 0.7rem 0.9rem;
  border-radius: $radius-sm;
  background: $sand;
  font-size: $text-sm;
  color: $ink-soft;

  i {
    color: $accent;
    margin-right: 0.3rem;
  }
}
</style>
