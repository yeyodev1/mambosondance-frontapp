<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AdminCard from '@/components/admin/AdminCard.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import ImageUploader from '@/components/admin/ImageUploader.vue'
import MoneyInput from '@/components/admin/MoneyInput.vue'
import ProductCourseFields from '@/components/admin/ProductCourseFields.vue'
import ProductPhysicalFields from '@/components/admin/ProductPhysicalFields.vue'
import { useProductForm } from '@/composables/admin/useProductForm'

const route = useRoute()
const id = computed(() => String(route.params.id))

const { form, type, isNew, loading, error, saving, errors, categories, load, save } =
  useProductForm(
    () => id.value,
    () => (route.query.type === 'physical' ? 'physical' : 'course'),
  )

const isCourse = computed(() => type.value === 'course')
const title = computed(() => {
  if (!isNew.value) return form.title || 'Editar'
  return isCourse.value ? 'Nuevo paquete de clases' : 'Nuevo producto'
})

// La misma vista sirve para crear y editar: si cambia el id, se vuelve a cargar.
watch(id, load, { immediate: true })
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      :title="title"
      :back="{ name: 'AdminProducts', query: { type } }"
      back-label="Clases y merch"
    >
      <RouterLink
        v-if="!isNew && isCourse"
        :to="{ name: 'AdminCourseContent', params: { id } }"
        class="btn btn--dark"
      >
        <i class="fa-solid fa-film"></i>
        Gestionar contenido
      </RouterLink>
    </AdminPageHeader>

    <AdminState :loading="loading" :error="error" @retry="load">
      <form class="adm-stack" novalidate @submit.prevent="save">
        <AdminCard title="Lo básico">
          <div class="adm-form">
            <AdminField label="Nombre" for="product-title" required :error="errors.title">
              <input
                id="product-title"
                v-model="form.title"
                type="text"
                :placeholder="isCourse ? 'Salsa desde cero' : 'Camiseta MamboSon'"
              />
            </AdminField>
            <AdminField
              label="Resumen"
              for="product-summary"
              help="Una o dos líneas. Es lo que se ve en la tarjeta del listado."
            >
              <input id="product-summary" v-model="form.summary" type="text" maxlength="200" />
            </AdminField>
            <AdminField
              label="Descripción"
              for="product-description"
              help="Texto completo de la página. Puedes usar saltos de línea."
            >
              <textarea id="product-description" v-model="form.description" rows="6"></textarea>
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="Precio" hint="Escribe los valores en dólares, con centavos.">
          <div class="adm-form__row">
            <AdminField
              label="Precio de venta"
              for="product-price"
              required
              :error="errors.priceCents"
            >
              <MoneyInput id="product-price" v-model="form.priceCents" />
            </AdminField>
            <AdminField
              label="Precio tachado (opcional)"
              for="product-compare"
              :error="errors.compareAtCents"
              help="El precio 'de antes'. Aparece tachado junto al precio de venta."
            >
              <MoneyInput
                id="product-compare"
                v-model="form.compareAtCents"
                placeholder="Sin precio tachado"
              />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard :title="isCourse ? 'Detalles de las clases' : 'Detalles del producto'">
          <ProductCourseFields
            v-if="isCourse"
            v-model:level="form.level"
            v-model:style="form.style"
            v-model:access-mode="form.accessMode"
            v-model:access-days="form.accessDays"
            :errors="errors"
          />
          <ProductPhysicalFields
            v-else
            v-model:category="form.category"
            v-model:variants="form.variants"
            v-model:stock="form.stock"
            :categories="categories"
            :errors="errors"
          />
        </AdminCard>

        <AdminCard title="Fotos">
          <div class="adm-form">
            <ImageUploader
              v-model="form.cover"
              folder="productos"
              label="Portada"
              help="La foto principal. Horizontal se ve mejor."
            />
            <ImageUploader
              v-model:list="form.gallery"
              folder="productos"
              multiple
              label="Galería (opcional)"
              help="Puedes elegir varias fotos a la vez."
            />
          </div>
        </AdminCard>

        <AdminCard title="Visibilidad">
          <div class="adm-form">
            <AdminSwitch
              v-model="form.isPublished"
              label="Publicado"
              help="Si está apagado, nadie lo ve en el sitio. Útil mientras lo preparas."
            />
            <AdminSwitch
              v-model="form.isFeatured"
              label="Destacado"
              help="Aparece en la página de inicio."
            />
          </div>
        </AdminCard>

        <div class="adm-form__actions">
          <RouterLink :to="{ name: 'AdminProducts', query: { type } }" class="btn btn--ghost">
            Cancelar
          </RouterLink>
          <button type="submit" class="btn btn--primary" :disabled="saving">
            <i class="fa-solid" :class="saving ? 'fa-circle-notch fa-spin' : 'fa-check'"></i>
            {{ saving ? 'Guardando…' : isNew && isCourse ? 'Guardar y subir videos' : 'Guardar' }}
          </button>
        </div>
      </form>
    </AdminState>
  </div>
</template>
