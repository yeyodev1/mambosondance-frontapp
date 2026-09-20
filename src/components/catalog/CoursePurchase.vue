<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ProductDetail } from '@/types'
import { useCartStore } from '@/stores/cart'
import { courseLine } from '@/utils/cartLines'
import { formatDuration } from '@/utils/format'
import PriceTag from '@/components/ui/PriceTag.vue'

const props = defineProps<{ course: ProductDetail }>()

const router = useRouter()
const cart = useCartStore()

const accessLabel = computed(() =>
  props.course.accessDurationDays
    ? `Acceso por ${props.course.accessDurationDays} días`
    : 'Acceso de por vida',
)

const facts = computed(() => {
  const lessons = props.course.lessonsCount
  return [
    { icon: 'fa-regular fa-clock', text: accessLabel.value },
    lessons > 0 && {
      icon: 'fa-solid fa-play',
      text: `${lessons} ${lessons === 1 ? 'lección' : 'lecciones'}`,
    },
    props.course.durationSeconds > 0 && {
      icon: 'fa-solid fa-hourglass-half',
      text: `${formatDuration(props.course.durationSeconds)} de clase`,
    },
    { icon: 'fa-solid fa-rotate', text: 'Repite cada paso las veces que necesites' },
  ].filter((fact): fact is { icon: string; text: string } => Boolean(fact))
})

function buy() {
  cart.add(courseLine(props.course))
  router.push('/carrito')
}
</script>

<template>
  <aside class="purchase" aria-label="Comprar esta clase">
    <PriceTag :cents="course.priceCents" :compare-at-cents="course.compareAtCents" size="lg" />

    <ul class="purchase__facts">
      <li v-for="fact in facts" :key="fact.text">
        <i :class="fact.icon" aria-hidden="true"></i> {{ fact.text }}
      </li>
    </ul>

    <button type="button" class="btn btn--primary btn--block" @click="buy">Comprar</button>
    <p class="purchase__note">Pago seguro con tarjeta. El acceso se activa al confirmar el pago.</p>
  </aside>
</template>

<style scoped lang="scss">
.purchase {
  @include flex(column, stretch, flex-start, 1.5rem);
  padding: 1.75rem 1.5rem;
  background: $sand;
  border-top: 3px solid $accent;

  @include from('md') {
    padding: 2.25rem 2rem;
  }

  &__facts {
    @include flex(column, stretch, flex-start, 0.75rem);
    list-style: none;
    font-size: $text-sm;
    color: $ink-soft;

    li {
      @include flex(row, baseline, flex-start, 0.75rem);
    }

    i {
      flex: 0 0 1rem;
      text-align: center;
      color: $accent;
    }
  }

  &__note {
    font-size: $text-xs;
    color: $ink-muted;
    text-align: center;
  }
}
</style>
