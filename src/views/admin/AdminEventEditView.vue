<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import EventSalesFields from '@/components/admin/EventSalesFields.vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import { eventCategoryOptions } from '@/composables/admin/labels'
import { useEventForm } from '@/composables/admin/useEventForm'

const route = useRoute()
const id = computed(() => String(route.params.id))
const { form, isNew, loading, error, saving, errors, load, save } = useEventForm(() => id.value)

watch(id, load, { immediate: true })
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      :title="isNew ? 'Nuevo evento' : form.title || 'Editar evento'"
      :back="{ name: 'AdminEvents' }"
      back-label="Eventos"
    >
      <RouterLink
        v-if="!isNew && form.salesMode === 'online'"
        :to="{ name: 'AdminTickets', query: { event: id } }"
        class="btn btn--dark"
      >
        <i class="fa-solid fa-ticket"></i>
        Ver entradas vendidas
      </RouterLink>
    </AdminPageHeader>

    <AdminState :loading="loading" :error="error" @retry="load">
      <form class="adm-stack" novalidate @submit.prevent="save">
        <AdminCard title="Lo básico">
          <div class="adm-form">
            <div class="adm-form__row">
              <AdminField
                label="Nombre del evento"
                for="event-title"
                required
                :error="errors.title"
              >
                <input
                  id="event-title"
                  v-model="form.title"
                  type="text"
                  placeholder="Social de salsa"
                />
              </AdminField>
              <AdminField label="Tipo de evento" for="event-category" required>
                <select id="event-category" v-model="form.category">
                  <option
                    v-for="option in eventCategoryOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </AdminField>
            </div>
            <AdminField
              label="Resumen"
              for="event-summary"
              help="Una o dos líneas para la tarjeta del evento."
            >
              <input id="event-summary" v-model="form.summary" type="text" maxlength="200" />
            </AdminField>
            <AdminField
              label="Descripción"
              for="event-description"
              help="Todo lo que la gente debe saber. Puedes usar saltos de línea."
            >
              <textarea id="event-description" v-model="form.description" rows="6"></textarea>
            </AdminField>
            <AdminField
              label="Artistas o invitados (opcional)"
              for="event-artists"
              help="Separa los nombres con comas."
            >
              <input
                id="event-artists"
                v-model="form.artistsText"
                type="text"
                placeholder="DJ Timba, Orquesta La Clave"
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="Cuándo y dónde">
          <div class="adm-form">
            <div class="adm-form__row">
              <AdminField label="Empieza" for="event-starts" required :error="errors.startsAt">
                <input id="event-starts" v-model="form.startsAt" type="datetime-local" />
              </AdminField>
              <AdminField label="Termina (opcional)" for="event-ends" :error="errors.endsAt">
                <input
                  id="event-ends"
                  v-model="form.endsAt"
                  type="datetime-local"
                  :min="form.startsAt"
                />
              </AdminField>
            </div>
            <div class="adm-form__row">
              <AdminField label="Lugar" for="event-venue">
                <input
                  id="event-venue"
                  v-model="form.venue"
                  type="text"
                  placeholder="MamboSon Dance Studio"
                />
              </AdminField>
              <AdminField label="Ciudad" for="event-city">
                <input id="event-city" v-model="form.city" type="text" placeholder="Guayaquil" />
              </AdminField>
            </div>
            <AdminField
              label="Enlace del mapa (opcional)"
              for="event-map"
              help="En Google Maps: Compartir → Copiar enlace, y pégalo aquí."
            >
              <input
                id="event-map"
                v-model="form.mapUrl"
                type="url"
                inputmode="url"
                placeholder="https://maps.app.goo.gl/…"
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="Entradas" hint="¿Cómo consigue la gente su entrada?">
          <EventSalesFields
            v-model:sales-mode="form.salesMode"
            v-model:contact-url="form.contactUrl"
            v-model:tiers="form.tiers"
            :errors="errors"
          />
        </AdminCard>

        <AdminCard title="Afiche y fotos">
          <div class="adm-form">
            <ImageUploader
              v-model="form.cover"
              folder="eventos"
              label="Afiche"
              help="La imagen principal del evento."
            />
            <ImageUploader
              v-model:list="form.gallery"
              folder="eventos"
              multiple
              label="Galería (opcional)"
              help="Fotos del lugar o de ediciones anteriores."
            />
          </div>
        </AdminCard>

        <AdminCard title="Visibilidad">
          <div class="adm-form">
            <AdminSwitch
              v-model="form.isPublished"
              label="Publicado"
              help="Apagado, nadie lo ve en el sitio."
            />
            <AdminSwitch
              v-model="form.isFeatured"
              label="Destacado"
              help="Aparece en la página de inicio."
            />
          </div>
        </AdminCard>

        <div class="adm-form__actions">
          <RouterLink :to="{ name: 'AdminEvents' }" class="btn btn--ghost">Cancelar</RouterLink>
          <button type="submit" class="btn btn--primary" :disabled="saving">
            <i class="fa-solid" :class="saving ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            {{ saving ? 'Guardando…' : 'Guardar evento' }}
          </button>
        </div>
      </form>
    </AdminState>
  </div>
</template>
