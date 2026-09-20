<script setup lang="ts">
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// El panel de administración trae su propio layout: sin header ni footer públicos.
const route = useRoute()
const isAdmin = computed(() => route.matched.some((r) => r.meta.layout === 'admin'))
</script>

<template>
  <div class="app">
    <TheHeader v-if="!isAdmin" />
    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter v-if="!isAdmin" />
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
