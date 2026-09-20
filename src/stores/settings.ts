import { defineStore } from 'pinia'
import { catalogService } from '@/services/catalog.service'
import { site } from '@/config/site'
import type { PublicSettings } from '@/types'

// Varias secciones piden los ajustes al montar: comparten una sola petición.
let pending: Promise<void> | null = null

/** Acepta "@mamboson", "mamboson" o la URL completa. */
function instagramUrl(value: string): string {
  const raw = value.trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://www.instagram.com/${raw.replace(/^@/, '')}`
}

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null as PublicSettings | null,
    loaded: false,
  }),

  getters: {
    // Lo que el admin define en Ajustes manda sobre lo escrito en site.ts.
    whatsapp: (s): string => (s.settings?.whatsapp || site.whatsapp).replace(/\D/g, ''),
    instagram: (s): string => instagramUrl(s.settings?.instagram || site.social.instagram),
    shippingNote: (s): string => s.settings?.shippingNote || '',
    // Solo se oculta cuando el API lo dice de forma explícita.
    loyaltyEnabled: (s): boolean => s.settings?.loyaltyEnabled !== false,
    loyaltyStampsRequired: (s): number => s.settings?.loyaltyStampsRequired || 10,
    loyaltyRewardText: (s): string => s.settings?.loyaltyRewardText || '',
  },

  actions: {
    load(): Promise<void> {
      if (this.loaded) return Promise.resolve()
      if (!pending) {
        pending = catalogService
          .publicSettings()
          .then((settings) => {
            this.settings = settings
            this.loaded = true
          })
          .catch(() => {
            // Sin ajustes la web sigue funcionando con los valores de site.ts.
          })
          .finally(() => {
            pending = null
          })
      }
      return pending
    },
  },
})
