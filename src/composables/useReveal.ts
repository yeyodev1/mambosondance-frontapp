import { onBeforeUnmount, onMounted, type Directive, type Ref } from 'vue'

/**
 * Entrada suave de los bloques al asomar en pantalla.
 *
 * Todo va con estilos en línea para no depender de una clase global, y se
 * limpian al terminar: así no pisan los hover ni las transiciones propias del
 * componente. Con `prefers-reduced-motion` no se toca nada.
 */

const DURATION = 900
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const delays = new WeakMap<Element, number>()
let observer: IntersectionObserver | null = null

function motionAllowed(): boolean {
  return (
    typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function show(el: HTMLElement) {
  const delay = delays.get(el) ?? 0
  el.style.transition = `opacity ${DURATION}ms ${EASE} ${delay}ms, transform ${DURATION}ms ${EASE} ${delay}ms`
  el.style.opacity = '1'
  el.style.transform = 'none'
  window.setTimeout(
    () => {
      for (const prop of ['transition', 'opacity', 'transform', 'will-change']) {
        el.style.removeProperty(prop)
      }
    },
    DURATION + delay + 60,
  )
}

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer?.unobserve(entry.target)
          show(entry.target as HTMLElement)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
  }
  return observer
}

function hide(el: HTMLElement, delay = 0) {
  if (!motionAllowed()) return
  delays.set(el, delay)
  el.style.opacity = '0'
  el.style.transform = 'translateY(28px)'
  el.style.willChange = 'opacity, transform'
  getObserver().observe(el)
}

/** `v-reveal` o `v-reveal="120"` (retraso en ms para escalonar hermanos). */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    hide(el, binding.value ?? 0)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

/** Versión por ref, para cuando el elemento no se puede marcar en la plantilla. */
export function useReveal(target: Ref<HTMLElement | null>, delay = 0) {
  onMounted(() => {
    if (target.value) hide(target.value, delay)
  })
  onBeforeUnmount(() => {
    if (target.value) observer?.unobserve(target.value)
  })
  return { vReveal }
}
