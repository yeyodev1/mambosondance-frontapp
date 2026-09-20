<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AdminField from './AdminField.vue'
import AdminSwitch from './AdminSwitch.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import StatusChip from './StatusChip.vue'
import VideoUploader from './VideoUploader.vue'
import { publishedChip, videoStatusChip } from '@/composables/admin/labels'
import { useCourseContent } from '@/composables/admin/useCourseContent'
import type { CourseModule, Lesson } from '@/types'

const props = defineProps<{
  lesson: Lesson
  module: CourseModule
  index: number
}>()

const content = useCourseContent()
const open = computed(() => content.openLessonId.value === props.lesson.id)
const confirming = ref(false)
const video = computed(() => videoStatusChip[props.lesson.videoStatus])

const draft = reactive({ title: '', description: '', isFreePreview: false, isPublished: false })

function resetDraft() {
  draft.title = props.lesson.title
  draft.description = props.lesson.description
  draft.isFreePreview = props.lesson.isFreePreview
  draft.isPublished = props.lesson.isPublished
}

watch(() => props.lesson, resetDraft, { immediate: true })

function toggle() {
  content.openLessonId.value = open.value ? null : props.lesson.id
}

async function save() {
  if (!draft.title.trim()) return
  await content.saveLesson(props.lesson, { ...draft, title: draft.title.trim() })
}

async function remove() {
  await content.removeLesson(props.lesson)
  confirming.value = false
}
</script>

<template>
  <li class="lesson" :class="{ 'lesson--open': open }">
    <div class="lesson__head">
      <button type="button" class="lesson__toggle" :aria-expanded="open" @click="toggle">
        <span class="lesson__number">{{ index + 1 }}</span>
        <span class="lesson__info">
          <span class="lesson__title">{{ lesson.title }}</span>
          <span class="lesson__chips">
            <StatusChip :label="video.label" :tone="video.tone" :icon="video.icon" />
            <StatusChip v-bind="publishedChip(lesson.isPublished)" />
            <StatusChip v-if="lesson.isFreePreview" label="Gratis" tone="info" icon="fa-gift" />
          </span>
        </span>
        <i class="fa-solid" :class="open ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>
      <div class="lesson__move">
        <button
          type="button"
          class="adm-action adm-action--icon"
          aria-label="Subir lección"
          :disabled="index === 0 || content.busy.value"
          @click="content.moveLesson(module, index, -1)"
        >
          <i class="fa-solid fa-arrow-up"></i>
        </button>
        <button
          type="button"
          class="adm-action adm-action--icon"
          aria-label="Bajar lección"
          :disabled="index === module.lessons.length - 1 || content.busy.value"
          @click="content.moveLesson(module, index, 1)"
        >
          <i class="fa-solid fa-arrow-down"></i>
        </button>
      </div>
    </div>

    <div v-if="open" class="lesson__body">
      <VideoUploader :lesson="lesson" @updated="content.replaceLesson" />

      <form class="adm-form" @submit.prevent="save">
        <AdminField label="Título de la lección" :for="`lesson-title-${lesson.id}`" required>
          <input :id="`lesson-title-${lesson.id}`" v-model="draft.title" type="text" />
        </AdminField>
        <AdminField label="Descripción (opcional)" :for="`lesson-desc-${lesson.id}`">
          <textarea
            :id="`lesson-desc-${lesson.id}`"
            v-model="draft.description"
            rows="3"
          ></textarea>
        </AdminField>
        <AdminSwitch
          v-model="draft.isFreePreview"
          label="Vista previa gratis"
          help="Cualquiera puede verla sin comprar. Sirve de muestra."
        />
        <AdminSwitch
          v-model="draft.isPublished"
          label="Publicada"
          help="Apagada, los alumnos no la ven. Préndela cuando el video esté listo."
        />
        <div class="adm-form__actions">
          <button type="button" class="btn btn--ghost lesson__delete" @click="confirming = true">
            <i class="fa-solid fa-trash"></i>
            Borrar lección
          </button>
          <button
            type="submit"
            class="btn btn--primary"
            :disabled="content.busy.value || !draft.title.trim()"
          >
            Guardar lección
          </button>
        </div>
      </form>
    </div>

    <ConfirmDialog
      :open="confirming"
      :title="`¿Borrar «${lesson.title}»?`"
      message="Se borra la lección con su video. No se puede deshacer."
      confirm-label="Sí, borrar"
      :busy="content.busy.value"
      @confirm="remove"
      @cancel="confirming = false"
    />
  </li>
</template>

<style scoped lang="scss">
.lesson {
  border: 1px solid $line;
  border-radius: $radius-sm;
  background: $surface;

  &--open {
    border-color: $ink-muted;
  }

  &__head {
    @include flex(row, center, space-between, 0.4rem);
    padding: 0.5rem 0.6rem;
  }

  &__toggle {
    @include flex(row, center, flex-start, 0.7rem);
    flex: 1 1 auto;
    min-width: 0;
    min-height: 48px;
    text-align: left;
    color: $ink-soft;
  }

  &__number {
    flex: 0 0 auto;
    @include flex(row, center, center);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: $sand;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink;
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.3rem);
    flex: 1 1 auto;
    min-width: 0;
  }

  &__title {
    font-weight: 600;
    color: $ink;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.3rem);
    flex-wrap: wrap;
  }

  &__move {
    @include flex(column, center, center, 0.3rem);
    flex: 0 0 auto;

    @include from('sm') {
      flex-direction: row;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.1rem);
    padding: 0.4rem 0.75rem 1rem;
    border-top: 1px solid $line;
  }

  &__delete {
    color: $danger;
    border-color: $danger;
  }
}
</style>
