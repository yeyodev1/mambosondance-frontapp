import { ref } from 'vue'
import { adminService, type ImageFolder } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { Image } from '@/types'
import { errorMessage, errorStatus } from './useAction'

const MAX_MB = 10

export function useImageUpload(folder: () => ImageFolder) {
  const uploading = ref(0)
  const error = ref('')
  const toast = useToastStore()

  function explain(err: unknown): string {
    // 503 = el servidor todavía no tiene las credenciales de Cloudinary.
    if (errorStatus(err) === 503) {
      return 'La subida de imágenes todavía no está activada en el servidor (falta configurar Cloudinary). Avísale a quien administra la web.'
    }
    if (errorStatus(err) === 413) return 'La imagen pesa demasiado. Prueba con una más liviana.'
    return errorMessage(err, 'No se pudo subir la imagen')
  }

  /** Sube los archivos de a uno y devuelve los que sí llegaron. */
  async function uploadAll(files: File[]): Promise<Image[]> {
    error.value = ''
    const done: Image[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        error.value = `"${file.name}" no es una imagen.`
        continue
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        error.value = `"${file.name}" pesa más de ${MAX_MB} MB.`
        continue
      }

      uploading.value += 1
      try {
        done.push(await adminService.uploadImage(file, folder()))
      } catch (err) {
        error.value = explain(err)
        toast.error(error.value)
        // Si Cloudinary no está configurado, las demás tampoco van a subir.
        if (errorStatus(err) === 503) {
          uploading.value -= 1
          break
        }
      }
      uploading.value -= 1
    }

    return done
  }

  return { uploading, error, uploadAll }
}
