import { reactive, ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import { errorMessage } from './useAsyncData'

type Field = 'name' | 'email' | 'message'

export function useContactForm() {
  const form = reactive({ name: '', email: '', phone: '', message: '' })
  const errors = reactive<Record<Field, string>>({ name: '', email: '', message: '' })
  const sending = ref(false)
  const sent = ref(false)
  const failure = ref('')

  function validate(): boolean {
    errors.name = form.name.trim().length >= 2 ? '' : 'Cuéntanos tu nombre'
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'Revisa tu correo'
    errors.message = form.message.trim().length >= 10 ? '' : 'Escribe un mensaje un poco más largo'
    return !errors.name && !errors.email && !errors.message
  }

  async function submit() {
    if (sending.value || !validate()) return
    sending.value = true
    failure.value = ''
    try {
      await catalogService.contact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      })
      sent.value = true
      Object.assign(form, { name: '', email: '', phone: '', message: '' })
    } catch (err) {
      failure.value = errorMessage(err)
    } finally {
      sending.value = false
    }
  }

  function reset() {
    sent.value = false
  }

  return { form, errors, sending, sent, failure, submit, reset }
}
