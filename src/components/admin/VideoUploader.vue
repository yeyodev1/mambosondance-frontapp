<script setup lang="ts">
import { computed, ref } from 'vue'
import StatusChip from './StatusChip.vue'
import { useVideoUpload } from '@/composables/admin/useVideoUpload'
import { videoStatusChip } from '@/composables/admin/labels'
import type { Lesson } from '@/types'
import { formatDuration } from '@/utils/format'

const props = defineProps<{ lesson: Lesson }>()
const emit = defineEmits<{ updated: [lesson: Lesson] }>()

const input = ref<HTMLInputElement | null>(null)
const { phase, progress, error, fileName, working, start, sync, cancel } = useVideoUpload(
  () => props.lesson.id,
  (lesson) => emit('updated', lesson),
)

const chip = computed(() => videoStatusChip[props.lesson.videoStatus])
const hasVideo = computed(() => props.lesson.videoStatus !== 'none')

function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (file) void start(file)
}
</script>

<template>
  <div class="video">
    <div class="video__status">
      <StatusChip :label="chip.label" :tone="chip.tone" :icon="chip.icon" />
      <span v-if="lesson.videoStatus === 'ready' && lesson.durationSeconds" class="adm-help">
        Dura {{ formatDuration(lesson.durationSeconds) }}
      </span>
    </div>

    <div v-if="working" class="video__progress" aria-live="polite">
      <p class="video__file">
        {{ phase === 'signing' ? 'Preparando la subida…' : `Subiendo ${fileName}` }}
      </p>
      <div
        class="video__bar"
        role="progressbar"
        :aria-valuenow="progress"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span class="video__fill" :style="{ width: `${progress}%` }"></span>
      </div>
      <p class="video__percent">{{ progress }} %</p>
      <p class="video__warning">
        <i class="fa-solid fa-triangle-exclamation"></i>
        No cierres esta pestaña ni bloquees el celular hasta que termine.
      </p>
      <button type="button" class="adm-action adm-action--danger" @click="cancel">
        Cancelar subida
      </button>
    </div>

    <template v-else>
      <p v-if="error" class="video__error" role="alert">{{ error }}</p>
      <p v-if="lesson.videoStatus === 'processing'" class="adm-help">
        El video ya se subió y se está procesando. Suele tardar unos minutos; toca "Actualizar
        estado" hasta que diga "Video listo".
      </p>

      <div class="video__actions">
        <button type="button" class="adm-action adm-action--primary" @click="input?.click()">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          {{ hasVideo ? 'Reemplazar video' : 'Subir video' }}
        </button>
        <button
          v-if="hasVideo && lesson.videoStatus !== 'ready'"
          type="button"
          class="adm-action"
          :disabled="phase === 'syncing'"
          @click="sync"
        >
          <i class="fa-solid fa-rotate" :class="{ 'fa-spin': phase === 'syncing' }"></i>
          Actualizar estado
        </button>
      </div>
      <p class="adm-help">Usa wifi si puedes: un video de clase suele pesar bastante.</p>
    </template>

    <input
      ref="input"
      class="visually-hidden"
      type="file"
      accept="video/*"
      tabindex="-1"
      @change="onPick"
    />
  </div>
</template>

<style scoped lang="scss">
.video {
  @include flex(column, stretch, flex-start, 0.65rem);
  padding: 0.9rem;
  border-radius: $radius-sm;
  background: $paper;
  border: 1px solid $line;

  &__status,
  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__progress {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__file {
    font-size: $text-sm;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  &__bar {
    height: 12px;
    border-radius: $radius-pill;
    background: $line;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    border-radius: $radius-pill;
    background: $accent;
    transition: width 0.3s ease;
  }

  &__percent {
    font-size: $text-sm;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__warning {
    padding: 0.55rem 0.7rem;
    border-radius: $radius-sm;
    background: $warning-bg;
    font-size: $text-sm;
    font-weight: 600;
    color: darken($warning, 28);
  }

  &__error {
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
  }
}
</style>
