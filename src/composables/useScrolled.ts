import { onBeforeUnmount, onMounted, ref } from 'vue'

/** true cuando la página bajó más allá del umbral. Sirve al header para volverse sólido. */
export function useScrolled(threshold = 24) {
  const scrolled = ref(false)

  function update() {
    scrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })

  onBeforeUnmount(() => window.removeEventListener('scroll', update))

  return scrolled
}
