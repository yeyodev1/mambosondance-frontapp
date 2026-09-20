<script setup lang="ts">
import { ref } from 'vue'
import AdminCard from './AdminCard.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import CourseLessonItem from './CourseLessonItem.vue'
import InlineAdd from './InlineAdd.vue'
import { useCourseContent } from '@/composables/admin/useCourseContent'
import type { CourseModule } from '@/types'

const props = defineProps<{
  module: CourseModule
  index: number
  count: number
}>()

const content = useCourseContent()
const renaming = ref(false)
const confirming = ref(false)

async function rename(title: string) {
  if (await content.renameModule(props.module, title)) renaming.value = false
}

async function remove() {
  await content.removeModule(props.module)
  confirming.value = false
}
</script>

<template>
  <AdminCard>
    <header class="module__head">
      <p class="module__eyebrow">Módulo {{ index + 1 }}</p>
      <InlineAdd
        v-if="renaming"
        :initial="module.title"
        label="Nombre del módulo"
        button="Guardar"
        :busy="content.busy.value"
        cancellable
        @submit="rename"
        @cancel="renaming = false"
      />
      <h2 v-else class="module__title">{{ module.title }}</h2>

      <div class="module__actions">
        <button type="button" class="adm-action" @click="renaming = !renaming">
          <i class="fa-solid fa-pen"></i>
          Renombrar
        </button>
        <button
          type="button"
          class="adm-action adm-action--icon"
          aria-label="Subir módulo"
          :disabled="index === 0 || content.busy.value"
          @click="content.moveModule(index, -1)"
        >
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button
          type="button"
          class="adm-action adm-action--icon"
          aria-label="Bajar módulo"
          :disabled="index === count - 1 || content.busy.value"
          @click="content.moveModule(index, 1)"
        >
          <i class="fa-solid fa-arrow-down"></i>
        </button>
        <button
          type="button"
          class="adm-action adm-action--danger adm-action--icon"
          aria-label="Borrar módulo"
          @click="confirming = true"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </header>

    <ul v-if="module.lessons.length" class="module__lessons">
      <CourseLessonItem
        v-for="(lesson, lessonIndex) in module.lessons"
        :key="lesson.id"
        :lesson="lesson"
        :module="module"
        :index="lessonIndex"
      />
    </ul>
    <p v-else class="adm-help">
      Este módulo todavía no tiene lecciones. Agrega la primera aquí abajo.
    </p>

    <InlineAdd
      label="Nueva lección"
      placeholder="Ej.: Paso básico y conteo"
      button="Agregar lección"
      :busy="content.busy.value"
      @submit="(title) => content.addLesson(module, title)"
    />

    <ConfirmDialog
      :open="confirming"
      :title="`¿Borrar el módulo «${module.title}»?`"
      message="Se borran también todas sus lecciones y videos. No se puede deshacer."
      confirm-label="Sí, borrar"
      :busy="content.busy.value"
      @confirm="remove"
      @cancel="confirming = false"
    />
  </AdminCard>
</template>

<style scoped lang="scss">
.module {
  &__head {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-lg;
    font-weight: 700;
    text-transform: none;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__lessons {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }
}
</style>
