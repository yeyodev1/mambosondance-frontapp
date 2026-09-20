<script setup lang="ts">
import { computed, ref } from 'vue'
import { useImageUpload } from '@/composables/admin/useImageUpload'
import type { ImageFolder } from '@/services/admin.service'
import type { Image } from '@/types'

// Una sola imagen (portada, foto) o varias (galería), según `multiple`.
const single = defineModel<Image | null>({ default: null })
const many = defineModel<Image[]>('list', { default: () => [] })

const props = defineProps<{
  folder: ImageFolder
  multiple?: boolean
  label?: string
  help?: string
}>()

const input = ref<HTMLInputElement | null>(null)
const { uploading, error, uploadAll } = useImageUpload(() => props.folder)

const images = computed<Image[]>(() =>
  props.multiple ? many.value : single.value ? [single.value] : [],
)
const canAdd = computed(() => props.multiple || !single.value)

async function onPick(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  // Se limpia para poder volver a elegir el mismo archivo tras un error.
  target.value = ''
  if (!files.length) return

  const uploaded = await uploadAll(props.multiple ? files : files.slice(0, 1))
  if (!uploaded.length) return
  if (props.multiple) many.value = [...many.value, ...uploaded]
  else single.value = uploaded[0] ?? null
}

function remove(image: Image) {
  if (props.multiple) many.value = many.value.filter((item) => item.publicId !== image.publicId)
  else single.value = null
}
</script>

<template>
  <div class="uploader">
    <p v-if="label" class="uploader__label">{{ label }}</p>

    <ul class="uploader__list">
      <li v-for="image in images" :key="image.publicId || image.url" class="uploader__item">
        <img :src="image.url" alt="" class="uploader__img" loading="lazy" />
        <button
          type="button"
          class="uploader__remove"
          aria-label="Quitar imagen"
          @click="remove(image)"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>

      <li v-if="uploading" class="uploader__item uploader__item--busy" aria-live="polite">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <span>Subiendo…</span>
      </li>

      <li v-else-if="canAdd" class="uploader__item">
        <button type="button" class="uploader__add" @click="input?.click()">
          <i class="fa-solid fa-camera"></i>
          <span>{{ images.length ? 'Agregar otra' : 'Elegir foto' }}</span>
        </button>
      </li>
    </ul>

    <button
      v-if="!multiple && single && !uploading"
      type="button"
      class="adm-action uploader__change"
      @click="input?.click()"
    >
      <i class="fa-solid fa-arrows-rotate"></i>
      Cambiar foto
    </button>

    <input
      ref="input"
      class="visually-hidden"
      type="file"
      accept="image/*"
      tabindex="-1"
      :multiple="multiple"
      @change="onPick"
    />

    <p v-if="error" class="uploader__error" role="alert">
      <i class="fa-solid fa-circle-exclamation"></i>
      {{ error }}
    </p>
    <p v-else-if="help" class="adm-help">{{ help }}</p>
  </div>
</template>

<style scoped lang="scss">
.uploader {
  @include flex(column, stretch, flex-start, 0.55rem);

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
  }

  &__list {
    list-style: none;
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__item {
    position: relative;
    flex: 0 0 auto;
    width: 104px;
    height: 104px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $sand;

    &--busy {
      @include flex(column, center, center, 0.35rem);
      font-size: $text-xs;
      color: $ink-soft;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__remove {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $overlay;
    color: $surface;
    @include flex(row, center, center);
  }

  &__add {
    @include flex(column, center, center, 0.35rem);
    width: 100%;
    height: 100%;
    border: 2px dashed $line;
    border-radius: $radius-sm;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;

    i {
      font-size: 1.3rem;
      color: $accent;
    }

    &:hover {
      border-color: $accent;
    }
  }

  &__change {
    align-self: flex-start;
  }

  &__error {
    padding: 0.6rem 0.75rem;
    border-radius: $radius-sm;
    background: $danger-bg;
    font-size: $text-sm;
    font-weight: 500;
    color: $danger;
  }
}
</style>
