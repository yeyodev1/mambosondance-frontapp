import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, type EventInput } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { EventCategory, EventItem, Image, SalesMode } from '@/types'
import { isoToLocalInput, localInputToIso } from './dates'
import { errorMessage, useAction } from './useAction'

export interface TierDraft {
  /** Las tarifas que ya existen conservan su id: así el API no pierde las vendidas. */
  id?: string
  /** Clave local para el v-for; las nuevas no tienen id todavía. */
  key: string
  name: string
  priceCents: number | null
  availableFrom: string
  availableUntil: string
  capacity: number | null
  sold: number
}

export interface EventForm {
  title: string
  category: EventCategory
  summary: string
  description: string
  startsAt: string
  endsAt: string
  venue: string
  city: string
  mapUrl: string
  artistsText: string
  cover: Image | null
  gallery: Image[]
  salesMode: SalesMode | ''
  contactUrl: string
  tiers: TierDraft[]
  isPublished: boolean
  isFeatured: boolean
}

let tierSeq = 0
export function newTier(): TierDraft {
  tierSeq += 1
  return {
    key: `nueva-${tierSeq}`,
    name: '',
    priceCents: null,
    availableFrom: '',
    availableUntil: '',
    capacity: null,
    sold: 0,
  }
}

function emptyForm(): EventForm {
  return {
    title: '',
    category: 'social',
    summary: '',
    description: '',
    startsAt: '',
    endsAt: '',
    venue: '',
    city: '',
    mapUrl: '',
    artistsText: '',
    cover: null,
    gallery: [],
    salesMode: '',
    contactUrl: '',
    tiers: [],
    isPublished: false,
    isFeatured: false,
  }
}

export function useEventForm(id: () => string) {
  const router = useRouter()
  const toast = useToastStore()
  const { busy: saving, run } = useAction()

  const isNew = computed(() => id() === 'nuevo')
  const form = reactive<EventForm>(emptyForm())
  const loading = ref(false)
  const error = ref('')
  const tried = ref(false)

  function fill(event: EventItem) {
    Object.assign(form, {
      title: event.title,
      category: event.category,
      summary: event.summary,
      description: event.description,
      startsAt: isoToLocalInput(event.startsAt),
      endsAt: isoToLocalInput(event.endsAt),
      venue: event.venue,
      city: event.city,
      mapUrl: event.mapUrl,
      artistsText: event.artists.join(', '),
      cover: event.cover,
      gallery: [...event.gallery],
      salesMode: event.salesMode,
      contactUrl: event.contactUrl,
      tiers: event.tiers.map((tier) => ({
        id: tier.id,
        key: tier.id,
        name: tier.name,
        priceCents: tier.priceCents,
        availableFrom: isoToLocalInput(tier.availableFrom),
        availableUntil: isoToLocalInput(tier.availableUntil),
        capacity: tier.capacity,
        sold: tier.sold,
      })),
      isPublished: event.isPublished,
      isFeatured: event.isFeatured,
    } satisfies EventForm)
  }

  async function load() {
    Object.assign(form, emptyForm())
    tried.value = false
    error.value = ''
    if (isNew.value) return

    loading.value = true
    try {
      fill(await adminService.event(id()))
    } catch (err) {
      error.value = errorMessage(err, 'No se pudo cargar el evento')
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }

  const problems = computed(() => {
    const list: Partial<Record<keyof EventForm, string>> = {}
    if (!form.title.trim()) list.title = 'Ponle un nombre al evento.'
    if (!form.startsAt) list.startsAt = 'Indica cuándo empieza.'
    if (form.startsAt && form.endsAt && form.endsAt <= form.startsAt) {
      list.endsAt = 'Debe terminar después de empezar.'
    }
    if (!form.salesMode) list.salesMode = 'Elige cómo se consiguen las entradas.'
    if (
      (form.salesMode === 'whatsapp' || form.salesMode === 'instagram') &&
      !form.contactUrl.trim()
    ) {
      list.contactUrl = 'Pega el enlace al que lleva el botón.'
    }
    if (form.salesMode === 'online') {
      if (form.isPublished && !form.tiers.length) {
        list.tiers = 'Para publicarlo necesitas al menos una preventa con precio.'
      }
      const bad = form.tiers.find(
        (tier) =>
          !tier.name.trim() ||
          tier.priceCents === null ||
          (tier.availableFrom && tier.availableUntil && tier.availableUntil <= tier.availableFrom),
      )
      if (bad) {
        list.tiers = `Revisa la preventa «${bad.name || 'sin nombre'}»: necesita nombre, precio y fechas en orden.`
      }
    }
    return list
  })

  const valid = computed(() => Object.keys(problems.value).length === 0)
  const errors = computed(() => (tried.value ? problems.value : {}))

  function payload(): EventInput {
    const online = form.salesMode === 'online'
    return {
      title: form.title.trim(),
      category: form.category,
      summary: form.summary.trim(),
      description: form.description.trim(),
      startsAt: localInputToIso(form.startsAt) ?? '',
      endsAt: localInputToIso(form.endsAt),
      venue: form.venue.trim(),
      city: form.city.trim(),
      mapUrl: form.mapUrl.trim(),
      artists: form.artistsText
        .split(/[,\n]/)
        .map((name) => name.trim())
        .filter(Boolean),
      cover: form.cover,
      gallery: form.gallery,
      salesMode: form.salesMode || 'info',
      contactUrl: online || form.salesMode === 'info' ? '' : form.contactUrl.trim(),
      // Fuera del modo en línea las tarifas no se tocan: cambiar de modo por error
      // no debe borrar preventas que ya vendieron.
      ...(online
        ? {
            tiers: form.tiers.map((tier) => ({
              ...(tier.id ? { id: tier.id } : {}),
              name: tier.name.trim(),
              priceCents: tier.priceCents ?? 0,
              availableFrom: localInputToIso(tier.availableFrom),
              availableUntil: localInputToIso(tier.availableUntil),
              capacity: tier.capacity,
            })),
          }
        : {}),
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
    }
  }

  async function save() {
    tried.value = true
    if (!valid.value) {
      toast.error('Revisa los campos marcados en rojo')
      return
    }
    await run(async () => {
      if (isNew.value) {
        const created = await adminService.createEvent(payload())
        await router.replace({ name: 'AdminEventEdit', params: { id: created.id } })
      } else {
        fill(await adminService.updateEvent(id(), payload()))
      }
    }, 'Evento guardado')
  }

  return { form, isNew, loading, error, saving, errors, load, save }
}
