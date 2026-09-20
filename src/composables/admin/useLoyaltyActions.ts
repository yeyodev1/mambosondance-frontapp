import { ref, type Ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { LoyaltyCard, LoyaltyStamp } from '@/types'
import { useAction } from './useAction'

/** Sellar, canjear y quitar sellos de la tarjeta de un alumno, identificado por su correo. */
export function useLoyaltyActions(email: () => string, card: Ref<LoyaltyCard | null>) {
  const { busy, run } = useAction()
  const toast = useToastStore()
  const toRemove = ref<LoyaltyStamp | null>(null)
  const redeeming = ref(false)

  const target = () => email().trim().toLowerCase()

  async function stamp(note: string, count: number): Promise<boolean> {
    const before = card.value?.rewardsAvailable ?? 0
    const ok = await run(async () => {
      card.value = await adminService.stamp({ email: target(), note: note.trim(), count })
    })
    if (!ok) return false

    // Si con este sello se completó la tarjeta, el aviso lo dice: es el momento de celebrarlo.
    const earned = (card.value?.rewardsAvailable ?? 0) > before
    if (earned) toast.success('Tarjeta completa: ganó su premio y le llega un correo.')
    else toast.success(count === 1 ? 'Sello puesto' : `${count} sellos puestos`)
    return true
  }

  async function redeem(note = ''): Promise<boolean> {
    const ok = await run(async () => {
      card.value = await adminService.redeem({ email: target(), note: note.trim() })
    }, 'Premio canjeado')
    redeeming.value = false
    return ok
  }

  async function removeStamp() {
    const stampToRemove = toRemove.value
    if (!stampToRemove) return
    await run(async () => {
      card.value = await adminService.removeStamp(stampToRemove.id, target())
    }, 'Sello quitado')
    toRemove.value = null
  }

  return { busy, toRemove, redeeming, stamp, redeem, removeStamp }
}
