<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { vReveal } from '@/composables/useReveal'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CourseCard from '@/components/catalog/CourseCard.vue'

const online = site.home.online

// Los cursos son un extra: si el API no responde, el bloque sigue contando lo suyo.
const { data, run } = useAsyncData(() => catalogService.products({ type: 'course', limit: 3 }))
const courses = computed(() => (data.value?.items ?? []).slice(0, 3))

onMounted(run)
</script>

<template>
  <section class="online">
    <div class="online__inner">
      <div class="online__top">
        <div v-reveal class="online__photo">
          <img :src="site.photos.steps" alt="" loading="lazy" decoding="async" />
          <span class="online__badge" aria-hidden="true">
            <i class="fa-solid fa-play"></i>
          </span>
        </div>

        <div class="online__copy">
          <SectionHeading
            v-reveal
            :eyebrow="online.eyebrow"
            :title="online.title"
            :script="online.script"
            :text="online.text"
          />
          <RouterLink v-reveal="120" :to="online.cta.to" class="btn btn--primary">
            {{ online.cta.label }}
          </RouterLink>
        </div>
      </div>

      <div v-if="courses.length" class="online__courses">
        <CourseCard
          v-for="(course, index) in courses"
          :key="course.id"
          v-reveal="index * 100"
          :course="course"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.online {
  background: $sand;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 4rem);
    padding-block: $space-section;
  }

  &__top {
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('md') {
      flex-direction: row-reverse;
      align-items: center;
      gap: 4.5rem;
    }
  }

  &__photo {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    @include from('md') {
      flex: 0 0 52%;
      aspect-ratio: 5 / 6;
      // Sale del contenedor hacia el borde: la foto respira a sangre.
      margin-right: -2rem;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1.2s $ease;
    }

    &:hover img {
      transform: scale(1.04);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(20deg, rgba($wine, 0.8) 0%, transparent 55%);
    }
  }

  &__badge {
    @include flex(row, center, center);
    position: absolute;
    left: 1.25rem;
    bottom: 1.25rem;
    z-index: 1;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 1.1rem;
    padding-left: 4px;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 2rem);
    flex: 1;
  }

  &__courses {
    @include flex-cards(260px, 2rem);
  }
}
</style>
