import { ref, type Ref } from 'vue'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Reglas cortas y en español para los formularios de acceso y perfil. */
export const rules = {
  email: (value: string) => (EMAIL.test(value.trim()) ? '' : 'Escribe un correo válido'),
  name: (value: string) => (value.trim().length >= 3 ? '' : 'Escribe tu nombre completo'),
  phone: (value: string) =>
    value.replace(/\D/g, '').length >= 7 ? '' : 'Escribe un teléfono válido',
  password: (value: string) =>
    value.length >= 8 ? '' : 'La contraseña debe tener al menos 8 caracteres',
  required: (value: string) => (value ? '' : 'Este campo es obligatorio'),
}

export function useFormErrors<K extends string>() {
  const errors = ref({}) as Ref<Partial<Record<K, string>>>

  /** Recibe el mensaje de cada campo ('' = válido) y dice si el formulario pasa. */
  function check(result: Record<K, string>): boolean {
    const found: Partial<Record<K, string>> = {}
    for (const key of Object.keys(result) as K[]) {
      if (result[key]) found[key] = result[key]
    }
    errors.value = found
    return Object.keys(found).length === 0
  }

  return { errors, check }
}
