<script setup lang="ts">
import LessonList from '@/components/player/LessonList.vue'
import StateBlock from '@/components/account/StateBlock.vue'
import { useCoursePlayer } from '@/composables/useCoursePlayer'
import { studentCopy } from '@/config/student'
import { formatDate } from '@/utils/format'

const copy = studentCopy.player
const {
  course,
  loading,
  error,
  blocked,
  lessons,
  completedCount,
  current,
  previous,
  next,
  embedUrl,
  playbackLoading,
  playbackError,
  saving,
  slug,
  load,
  select,
  toggleComplete,
  retryPlayback,
} = useCoursePlayer()
</script>

<template>
  <section class="player">
    <RouterLink class="player__back" to="/cuenta?tab=clases">
      <i class="fa-solid fa-arrow-left"></i> Mis clases
    </RouterLink>

    <StateBlock v-if="loading" kind="loading" text="Cargando tu clase…" />

    <StateBlock v-else-if="error || !course" kind="error" :text="error" @retry="load">
      <RouterLink class="btn btn--primary" :to="`/clases/${slug}`">Ver esta clase</RouterLink>
    </StateBlock>

    <StateBlock
      v-else-if="blocked"
      kind="empty"
      icon="fa-solid fa-lock"
      :title="copy.blockedTitle"
      :text="
        course.access.expiresAt && course.access.status === 'vencido'
          ? `Venció el ${formatDate(course.access.expiresAt)}. ${copy.blockedText}`
          : copy.blockedText
      "
    >
      <RouterLink class="btn btn--primary" :to="`/clases/${course.slug}`">
        Volver a comprar
      </RouterLink>
    </StateBlock>

    <template v-else>
      <header class="player__head">
        <h1 class="player__course">{{ course.title }}</h1>
        <p v-if="course.access.expiresAt" class="player__access">
          Disponible hasta el {{ formatDate(course.access.expiresAt) }}
        </p>
      </header>

      <div class="player__layout">
        <div class="player__main">
          <div class="player__frame">
            <iframe
              v-if="embedUrl"
              :key="embedUrl"
              :src="embedUrl"
              :title="current?.title || course.title"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="player__placeholder" :role="playbackError ? 'alert' : 'status'">
              <template v-if="playbackLoading">
                <i class="fa-solid fa-circle-notch fa-spin"></i>
                <p>Preparando el video…</p>
              </template>
              <template v-else-if="playbackError">
                <p>{{ playbackError }}</p>
                <button class="btn btn--outline-light" type="button" @click="retryPlayback">
                  Reintentar
                </button>
              </template>
              <p v-else>{{ copy.empty }}</p>
            </div>
          </div>

          <div v-if="current" class="player__lesson">
            <h2 class="player__title">{{ current.title }}</h2>
            <p v-if="current.description" class="player__description">
              {{ current.description }}
            </p>

            <div class="player__actions">
              <button
                class="btn"
                :class="current.completed ? 'btn--ghost' : 'btn--primary'"
                type="button"
                :disabled="saving"
                :aria-pressed="Boolean(current.completed)"
                @click="toggleComplete"
              >
                <i
                  :class="current.completed ? 'fa-solid fa-check' : 'fa-regular fa-circle-check'"
                ></i>
                {{ current.completed ? 'Vista' : 'Marcar como vista' }}
              </button>
              <div class="player__nav">
                <button
                  class="btn btn--ghost"
                  type="button"
                  :disabled="!previous"
                  @click="previous && select(previous)"
                >
                  <i class="fa-solid fa-arrow-left"></i> Anterior
                </button>
                <button
                  class="btn btn--dark"
                  type="button"
                  :disabled="!next"
                  @click="next && select(next)"
                >
                  Siguiente <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside class="player__aside">
          <LessonList
            :modules="course.modules"
            :current-id="current?.id"
            :completed="completedCount"
            :total="lessons.length"
            @select="select"
          />
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.player {
  @include container(1240px);
  @include flex(column, stretch, flex-start, $space-md);
  padding-block: $space-md $space-xl;

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    align-self: flex-start;
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;

    &:hover {
      color: $accent;
    }
  }

  &__course {
    @include display($display-sm);
  }

  &__access {
    margin-top: 0.4rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: $space-lg;
    }
  }

  &__main {
    @include flex(column, stretch, flex-start, $space-md);
    flex: 1;
    min-width: 0;
  }

  &__frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: $night;
    border-radius: $radius-md;

    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  &__placeholder {
    @include flex(column, center, center, 0.8rem);
    position: absolute;
    inset: 0;
    padding: 1rem;
    text-align: center;
    font-size: $text-sm;
    color: $on-dark-soft;

    i {
      font-size: 1.5rem;
      color: $on-dark;
    }
  }

  &__title {
    font-family: $font-principal;
    font-size: $text-xl;
    font-weight: 700;
    line-height: 1.25;
    text-transform: none;
  }

  &__description {
    margin-top: 0.5rem;
    color: $ink-soft;
    white-space: pre-line;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.7rem);
    margin-top: $space-md;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__nav {
    @include flex(row, center, flex-start, 0.6rem);

    .btn {
      flex: 1;
      padding-inline: 1rem;
    }
  }

  &__aside {
    min-width: 0;

    @include from('lg') {
      flex: 0 0 360px;
      position: sticky;
      top: 6rem;
      max-height: calc(100vh - 7rem);
      overflow-y: auto;
    }
  }
}
</style>
