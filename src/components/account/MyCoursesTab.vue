<script setup lang="ts">
import { onMounted } from 'vue'
import StateBlock from './StateBlock.vue'
import { useRequest } from '@/composables/useRequest'
import { meService } from '@/services/me.service'
import { studentCopy } from '@/config/student'
import { formatDate } from '@/utils/format'
import type { MyCourse } from '@/types'

const { data: courses, loading, error, run } = useRequest(() => meService.courses())

const isActive = (course: MyCourse) => course.access.status === 'vigente'
const percent = (course: MyCourse) =>
  course.progress.total ? Math.round((course.progress.completed / course.progress.total) * 100) : 0

function accessLabel(course: MyCourse): string {
  const { status, expiresAt } = course.access
  if (status === 'revocado') return 'Tu acceso fue retirado'
  if (status === 'vencido') {
    return expiresAt ? `Tu acceso venció el ${formatDate(expiresAt)}` : 'Tu acceso venció'
  }
  return expiresAt ? `Disponible hasta el ${formatDate(expiresAt)}` : 'Acceso sin vencimiento'
}

onMounted(run)
</script>

<template>
  <StateBlock v-if="loading" kind="loading" text="Cargando tus clases…" />
  <StateBlock v-else-if="error" kind="error" :text="error" @retry="run" />
  <StateBlock
    v-else-if="!courses?.length"
    kind="empty"
    icon="fa-solid fa-play"
    title="Aún no tienes clases"
    :text="studentCopy.account.coursesEmpty"
  >
    <RouterLink class="btn btn--primary" to="/clases">Ver clases online</RouterLink>
  </StateBlock>

  <ul v-else class="courses">
    <li
      v-for="course in courses"
      :key="course.product.id"
      class="courses__item"
      :class="{ 'courses__item--locked': !isActive(course) }"
    >
      <div class="courses__media">
        <img v-if="course.product.cover" :src="course.product.cover.url" alt="" loading="lazy" />
        <span v-if="!isActive(course)" class="courses__lock">
          <i class="fa-solid fa-lock" aria-hidden="true"></i> Bloqueado
        </span>
      </div>

      <div class="courses__body">
        <h2 class="courses__title">{{ course.product.title }}</h2>
        <p class="courses__access">{{ accessLabel(course) }}</p>

        <div
          class="courses__bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="percent(course)"
          :aria-label="`Progreso de ${course.product.title}`"
        >
          <span :style="{ width: `${percent(course)}%` }"></span>
        </div>
        <p class="courses__progress">
          {{ course.progress.completed }} de {{ course.progress.total }} lecciones vistas
        </p>

        <RouterLink
          v-if="isActive(course)"
          class="btn btn--primary btn--block"
          :to="`/mis-clases/${course.product.slug}`"
        >
          {{ course.progress.completed ? 'Continuar' : 'Empezar' }}
        </RouterLink>
        <RouterLink v-else class="btn btn--ghost btn--block" :to="`/clases/${course.product.slug}`">
          Volver a comprar
        </RouterLink>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.courses {
  @include flex-cards(280px, 1.5rem);
  list-style: none;

  &__item {
    @include flex(column, stretch);
    max-width: 100%;
    overflow: hidden;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;

    @include from('md') {
      max-width: 380px;
    }
  }

  &__media {
    position: relative;
    aspect-ratio: 16 / 9;
    background: $wine;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .courses__item--locked & img {
      filter: grayscale(1);
      opacity: 0.45;
    }
  }

  &__lock {
    @include flex(row, center, center, 0.45rem);
    position: absolute;
    left: 0.8rem;
    bottom: 0.8rem;
    padding: 0.35rem 0.8rem;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $on-dark;
    background: $night;
    border-radius: $radius-pill;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.55rem);
    flex: 1;
    padding: 1.2rem;
  }

  &__title {
    @include display($text-lg, 600);
  }

  &__access,
  &__progress {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__item--locked &__access {
    color: $danger;
    font-weight: 600;
  }

  &__bar {
    height: 6px;
    margin-top: 0.3rem;
    overflow: hidden;
    background: $sand;
    border-radius: $radius-pill;

    span {
      display: block;
      height: 100%;
      background: $accent;
      border-radius: inherit;
    }
  }

  &__progress {
    margin-bottom: auto;
    padding-bottom: 0.6rem;
  }
}
</style>
