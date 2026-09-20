<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useDetail } from '@/composables/useDetail'
import { useLessonPreview } from '@/composables/useLessonPreview'
import AsyncState from '@/components/ui/AsyncState.vue'
import DetailSkeleton from '@/components/ui/DetailSkeleton.vue'
import DetailHero from '@/components/catalog/DetailHero.vue'
import CoursePurchase from '@/components/catalog/CoursePurchase.vue'
import CourseSyllabus from '@/components/catalog/CourseSyllabus.vue'
import LessonPreviewModal from '@/components/catalog/LessonPreviewModal.vue'

const { data: course, loading, error, reload } = useDetail((slug) => catalogService.product(slug))
const preview = useLessonPreview()

// Un producto físico abierto desde un enlace de clases se manda a la tienda.
const router = useRouter()
watch(course, (item) => {
  if (item?.type === 'physical') router.replace(`/tienda/${item.slug}`)
})

const eyebrow = computed(() => {
  const level = course.value?.level
  return [course.value?.style, level ? site.levels[level] : ''].filter(Boolean).join(' · ')
})

const hasPreview = computed(
  () => course.value?.modules.some((m) => m.lessons.some((l) => l.isFreePreview)) ?? false,
)
</script>

<template>
  <div class="course">
    <AsyncState :loading="loading" :error="error" @retry="reload">
      <template #skeleton><DetailSkeleton /></template>
      <template #error-actions>
        <RouterLink to="/clases" class="btn btn--primary">Ver todas las clases</RouterLink>
      </template>

      <template v-if="course">
        <DetailHero
          :image="course.cover?.url"
          :alt="course.title"
          :eyebrow="eyebrow"
          :title="course.title"
          back-to="/clases"
          :back-label="site.home.online.eyebrow"
        >
          <p v-if="course.summary" class="course__summary">{{ course.summary }}</p>
        </DetailHero>

        <div class="course__layout">
          <div class="course__main">
            <section v-if="course.description" class="course__block">
              <h2 class="course__heading">Sobre esta clase</h2>
              <p class="course__description">{{ course.description }}</p>
            </section>

            <section v-if="course.modules.length" class="course__block">
              <h2 class="course__heading">Temario</h2>
              <p v-if="hasPreview" class="course__hint">
                Las lecciones marcadas como vista previa se pueden ver sin comprar.
              </p>
              <CourseSyllabus :modules="course.modules" @preview="preview.open" />
            </section>
          </div>

          <div class="course__side">
            <CoursePurchase :course="course" />
          </div>
        </div>
      </template>
    </AsyncState>

    <LessonPreviewModal
      :lesson="preview.lesson.value"
      :embed-url="preview.embedUrl.value"
      :loading="preview.loading.value"
      :error="preview.error.value"
      @close="preview.close"
      @retry="preview.retry"
    />
  </div>
</template>

<style scoped lang="scss">
.course {
  @include flex(column, stretch);
  width: 100%;

  &__summary {
    font-size: $text-lg;
    font-weight: 300;
    color: $on-dark-soft;
    max-width: 34rem;
  }

  &__layout {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: 2.5rem $space-section;

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
      padding-top: 4rem;
    }
  }

  // En el celular la compra va primero: es lo que la persona vino a decidir.
  &__side {
    order: -1;

    @include from('md') {
      order: 0;
      flex: 0 0 38%;
      position: sticky;
      top: 6.5rem;
      // Deja pasar el afiche que cuelga del hero.
      margin-top: 3.5rem;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, 3.5rem);
    flex: 1;
    min-width: 0;
  }

  &__block {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__heading {
    @include display($display-sm);
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__description {
    font-weight: 300;
    font-size: $text-lg;
    line-height: 1.7;
    color: $ink-soft;
    white-space: pre-line;
    max-width: 40rem;
  }
}
</style>
