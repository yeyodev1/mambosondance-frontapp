<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { vReveal } from '@/composables/useReveal'
import PageHero from '@/components/ui/PageHero.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import SkeletonCards from '@/components/ui/SkeletonCards.vue'
import TeacherCard from '@/components/catalog/TeacherCard.vue'

const intro = site.home.pillars[1]
const classesCta = site.home.hero.primaryCta

const { data, loading, error, run } = useAsyncData(() => catalogService.teachers())

const sorted = computed(() => [...(data.value ?? [])].sort((a, b) => a.order - b.order))
const founders = computed(() => sorted.value.filter((teacher) => teacher.isFounder))
const team = computed(() => sorted.value.filter((teacher) => !teacher.isFounder))

onMounted(run)
</script>

<template>
  <div class="teachers">
    <PageHero
      eyebrow="Profesores"
      :title="intro.title"
      :text="intro.text"
      :image="site.photos.expression"
    />

    <section class="teachers__section">
      <AsyncState
        :loading="loading"
        :error="error"
        :empty="!sorted.length"
        empty-title="Muy pronto"
        empty-text="Estamos preparando la presentación de nuestro equipo de profesores."
        @retry="run"
      >
        <template #skeleton><SkeletonCards :count="3" ratio="3/4" /></template>
        <template #empty-actions>
          <RouterLink :to="classesCta.to" class="btn btn--primary">{{
            classesCta.label
          }}</RouterLink>
        </template>

        <div v-if="founders.length" class="teachers__founders">
          <TeacherCard
            v-for="teacher in founders"
            :key="teacher.id"
            v-reveal
            :teacher="teacher"
            featured
          />
        </div>

        <div v-if="team.length" class="teachers__team">
          <TeacherCard
            v-for="(teacher, index) in team"
            :key="teacher.id"
            v-reveal="(index % 3) * 100"
            :teacher="teacher"
          />
        </div>
      </AsyncState>
    </section>
  </div>
</template>

<style scoped lang="scss">
.teachers {
  @include flex(column, stretch);
  width: 100%;

  &__section {
    @include container;
    @include flex(column, stretch, flex-start, $space-xl);
    padding-block: $space-xl $space-section;
  }

  &__founders {
    @include flex(column, stretch, flex-start, 4rem);

    @include from('md') {
      gap: 6rem;
    }
  }

  &__team {
    @include flex-cards(240px, 2.5rem 2rem);

    > * {
      max-width: 24rem;
    }
  }
}
</style>
