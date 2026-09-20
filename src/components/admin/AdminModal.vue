<script setup lang="ts">
import { toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

// Modal para formularios: en el celular sube desde abajo y ocupa casi toda la
// pantalla; el contenido hace scroll por dentro y los botones quedan a la vista.
const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ close: [] }>()

useBodyScroll(toRef(props, 'open'))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet" @click.self="emit('close')" @keydown.esc="emit('close')">
        <div class="sheet__box" role="dialog" aria-modal="true" :aria-label="title">
          <header class="sheet__head">
            <h2 class="sheet__title">{{ title }}</h2>
            <button type="button" class="sheet__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <div class="sheet__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="sheet__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 180;
  background: $overlay;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  &__box {
    @include flex(column, stretch, flex-start);
    background: $surface;
    border-radius: $radius-lg $radius-lg 0 0;
    max-height: 92dvh;
    width: 100%;
    box-shadow: $shadow-lg;

    @include from('md') {
      max-width: 620px;
      max-height: 88vh;
      border-radius: $radius-md;
    }
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1rem 1.1rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-lg;
    font-weight: 700;
    text-transform: none;
    line-height: 1.25;
  }

  &__close {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 1.1rem;
    color: $ink-soft;

    &:hover {
      background: $sand;
    }
  }

  &__body {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 1.1rem;
    -webkit-overflow-scrolling: touch;
  }

  &__foot {
    @include flex(column-reverse, stretch, flex-start, 0.5rem);
    padding: 0.9rem 1.1rem calc(0.9rem + env(safe-area-inset-bottom));
    border-top: 1px solid $line;

    @include from('md') {
      flex-direction: row;
      justify-content: flex-end;
    }
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;

  .sheet__box {
    transition: transform 0.3s $ease;
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__box {
    transform: translateY(24px);
  }
}
</style>
