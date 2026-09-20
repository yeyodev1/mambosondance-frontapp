import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import type { Access } from '@/types'
import { useAction } from './useAction'

/** Revocar y editar el vencimiento de un acceso, con sus confirmaciones. */
export function useAccessManage(onChanged: () => void) {
  const { busy, run } = useAction()
  const toRevoke = ref<Access | null>(null)
  const toEdit = ref<Access | null>(null)
  /** Mismo contrato que ExpiryChoice: undefined mientras no haya una elección válida. */
  const editValue = ref<string | null | undefined>(undefined)

  function askEdit(access: Access) {
    editValue.value = access.expiresAt
    toEdit.value = access
  }

  async function confirmRevoke() {
    const access = toRevoke.value
    if (!access) return
    const ok = await run(() => adminService.revokeAccess(access.id), 'Acceso revocado')
    toRevoke.value = null
    if (ok) onChanged()
  }

  async function confirmEdit() {
    const access = toEdit.value
    const value = editValue.value
    if (!access || value === undefined) return
    const ok = await run(
      () => adminService.updateAccess(access.id, value),
      'Vencimiento actualizado',
    )
    if (!ok) return
    toEdit.value = null
    onChanged()
  }

  return { busy, toRevoke, toEdit, editValue, askEdit, confirmRevoke, confirmEdit }
}
