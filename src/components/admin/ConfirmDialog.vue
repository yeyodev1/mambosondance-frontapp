<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

// Las acciones que no se pueden deshacer (borrar, revocar, anular) pasan por acá.
withDefaults(
  defineProps<{
    open: boolean
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    busy?: boolean
  }>(),
  { danger: true },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <BaseModal
    :open="open"
    :title="title"
    :message="message"
    :confirm-label="busy ? 'Un momento…' : confirmLabel"
    :cancel-label="cancelLabel"
    :danger="danger"
    @confirm="!busy && emit('confirm')"
    @cancel="!busy && emit('cancel')"
  >
    <slot />
  </BaseModal>
</template>
