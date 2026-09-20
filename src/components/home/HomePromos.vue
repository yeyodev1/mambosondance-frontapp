<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { useAsyncData } from '@/composables/useAsyncData'
import { isInternalUrl, optimized } from '@/utils/image'

// Sin promos activas (o sin API) esta sección no existe: no deja hueco ni mensaje.
const { data, run } = useAsyncData(() => catalogService.promos())
const promos = computed(() => [...(data.value ?? [])].sort((a, b) => a.order - b.order))

onMounted(run)
</script>

<template>
  <section v-if="promos.length" class="promos" aria-label="Promociones">
    <div class="promos__track" :class="{ 'promos__track--single': promos.length === 1 }">
      <article v-for="promo in promos" :key="promo.id" class="promos__item">
        <img
          v-if="promo.image"
          class="promos__image"
          :src="optimized(promo.image.url, 1400)"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div class="promos__body">
          <h2 class="promos__title">{{ promo.title }}</h2>
          <p v-if="promo.text" class="promos__text">{{ promo.text }}</p>
          <template v-if="promo.ctaUrl && promo.ctaLabel">
            <RouterLink
              v-if="isInternalUrl(promo.ctaUrl)"
              :to="promo.ctaUrl"
              class="btn btn--light"
            >
              {{ promo.ctaLabel }}
            </RouterLink>
            <a v-else :href="promo.ctaUrl" class="btn btn--light" target="_blank" rel="noopener">
              {{ promo.ctaLabel }}
            </a>
          </template>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.promos {
  background: $paper;
  padding-block: 2.5rem 0;

  @include from('md') {
    padding-block: 4rem 0;
  }

  // Carrusel nativo con scroll-snap: sin librerías ni JS.
  &__track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding-inline: 1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      gap: 1.5rem;
      padding-inline: 2rem;
      scroll-padding-inline: 2rem;
    }

    &--single {
      @include container;
      overflow: visible;
    }
  }

  &__item {
    position: relative;
    display: flex;
    flex: 0 0 88%;
    min-height: 20rem;
    overflow: hidden;
    scroll-snap-align: start;
    background: $wine;
    color: $on-dark;

    @include from('md') {
      flex-basis: 62%;
      min-height: 24rem;
    }
  }

  &__track--single &__item {
    flex-basis: 100%;
  }

  &__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__body {
    @include flex(column, flex-start, flex-end, 1rem);
    position: relative;
    width: 100%;
    padding: 1.75rem 1.5rem;
    background: linear-gradient(
      75deg,
      rgba($wine, 0.95) 0%,
      rgba($accent-deep, 0.7) 55%,
      rgba($accent-deep, 0.1) 100%
    );

    @include from('md') {
      padding: 3rem;
    }
  }

  &__title {
    @include display($display-sm);
    max-width: 16em;
  }

  &__text {
    font-weight: 300;
    color: rgba($on-dark, 0.88);
    max-width: 32rem;
    white-space: pre-line;
  }

  .btn {
    margin-top: 0.5rem;
  }
}
</style>
