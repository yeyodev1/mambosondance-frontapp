import { defineStore } from 'pinia'
import type { CartLine } from '@/types'

const STORAGE_KEY = 'mamboson_cart'

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

/**
 * Carrito en localStorage. Guarda el precio solo para mostrarlo: el total real
 * lo calcula el servidor al crear la orden, así que un precio viejo acá no
 * puede terminar cobrándose.
 */
export const useCartStore = defineStore('cart', {
  state: () => ({ lines: load() }),

  getters: {
    count: (s) => s.lines.reduce((sum, line) => sum + line.input.quantity, 0),
    subtotalCents: (s) => s.lines.reduce((sum, l) => sum + l.unitCents * l.input.quantity, 0),
    hasPhysical: (s) => s.lines.some((line) => line.isPhysical),
    isEmpty: (s) => s.lines.length === 0,
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {
        // Modo privado: el carrito vive lo que dure la pestaña.
      }
    },

    /** Si el renglón ya existe (misma key) suma cantidad, salvo que sea de cantidad fija. */
    add(line: CartLine) {
      const existing = this.lines.find((l) => l.key === line.key)
      if (existing) {
        if (!existing.fixedQuantity) existing.input.quantity += line.input.quantity
      } else {
        this.lines.push(line)
      }
      this.persist()
    },

    setQuantity(key: string, quantity: number) {
      const line = this.lines.find((l) => l.key === key)
      if (!line || line.fixedQuantity) return
      line.input.quantity = Math.max(1, Math.min(20, Math.round(quantity)))
      this.persist()
    },

    remove(key: string) {
      this.lines = this.lines.filter((l) => l.key !== key)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },
  },
})
