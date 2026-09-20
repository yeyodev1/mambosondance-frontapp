import { ref } from 'vue'
import type { PayphoneConfig } from '@/types'

const CSS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const JS_URL = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'
const WAIT_MS = 15000

// Estado de módulo: los recursos del CDN se piden una sola vez por carga de página,
// aunque el checkout se monte varias veces.
let assets: Promise<void> | null = null

function waitForGlobal(): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (window.PPaymentButtonBox) return resolve()
      if (Date.now() - started > WAIT_MS) return reject(new Error('timeout'))
      window.setTimeout(tick, 120)
    }
    tick()
  })
}

function loadAssets(): Promise<void> {
  if (assets) return assets

  assets = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_URL}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = CSS_URL
      document.head.appendChild(link)
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${JS_URL}"]`)
    if (!script) {
      script = document.createElement('script')
      // El bundle de Payphone es un módulo ES: sin type="module" no se ejecuta.
      script.type = 'module'
      script.src = JS_URL
      script.addEventListener('error', () => reject(new Error('cdn')))
      document.head.appendChild(script)
    }

    // Un módulo no avisa cuándo dejó su global listo: se espera a que aparezca.
    waitForGlobal().then(resolve, reject)
  }).catch((error) => {
    // Si falló la red, el próximo intento vuelve a pedir el script.
    document.querySelector(`script[src="${JS_URL}"]`)?.remove()
    assets = null
    throw error
  })

  return assets
}

export type PayphoneStatus = 'idle' | 'loading' | 'ready' | 'error'

export function usePayphone() {
  const status = ref<PayphoneStatus>('idle')

  /** `containerId` debe existir en el DOM antes de llamar (usar tras onMounted). */
  async function mount(config: PayphoneConfig, containerId = 'pp-button') {
    status.value = 'loading'
    try {
      await loadAssets()
      const container = document.getElementById(containerId)
      if (!container || !window.PPaymentButtonBox) throw new Error('container')
      // Un intento anterior pudo dejar su formulario: cada orden pinta el suyo.
      container.innerHTML = ''

      new window.PPaymentButtonBox({
        ...config,
        lang: 'es',
        defaultMethod: 'card',
        timeZone: -5,
      }).render(containerId)
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  return { status, mount }
}
