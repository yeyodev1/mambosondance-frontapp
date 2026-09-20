<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminState from '@/components/admin/AdminState.vue'
import ConfirmDialog from '@/components/admin/ConfirmDialog.vue'
import Pagination from '@/components/admin/Pagination.vue'
import SearchInput from '@/components/admin/SearchInput.vue'
import StatusChip from '@/components/admin/StatusChip.vue'
import { publishedChip } from '@/composables/admin/labels'
import { useAction } from '@/composables/admin/useAction'
import { usePagedList } from '@/composables/admin/useResource'
import { adminService } from '@/services/admin.service'
import type { Product, ProductType } from '@/types'
import { formatCents } from '@/utils/format'

const route = useRoute()
const router = useRouter()

// La pestaña vive en la URL: al volver de editar un producto se cae en la misma.
const type = computed<ProductType>(() => (route.query.type === 'physical' ? 'physical' : 'course'))
const q = ref('')
const isCourse = computed(() => type.value === 'course')

const { items, page, pages, total, loading, error, load, reload } = usePagedList((target) =>
  adminService.products({ type: type.value, q: q.value, page: target }),
)
const { busy, run } = useAction()
const toDelete = ref<Product | null>(null)

watch([type, q], () => load(1), { immediate: true })

function setType(next: ProductType) {
  router.replace({ query: { type: next } })
}

function meta(product: Product): string {
  if (product.type === 'course') {
    const lessons = `${product.lessonsCount} ${product.lessonsCount === 1 ? 'lección' : 'lecciones'}`
    return [product.style, product.level, lessons].filter(Boolean).join(' · ')
  }
  const stock = product.stock === null ? 'Sin control de stock' : `${product.stock} en stock`
  return [product.category, stock].filter(Boolean).join(' · ')
}

async function togglePublished(product: Product) {
  const next = !product.isPublished
  await run(
    async () => {
      const saved = await adminService.updateProduct(product.id, { isPublished: next })
      Object.assign(product, saved)
    },
    next ? 'Publicado: ya se ve en el sitio' : 'Oculto: ya no se ve en el sitio',
  )
}

async function confirmDelete() {
  const product = toDelete.value
  if (!product) return
  const ok = await run(() => adminService.deleteProduct(product.id), 'Eliminado')
  toDelete.value = null
  if (ok) reload()
}
</script>

<template>
  <div class="adm-stack">
    <AdminPageHeader
      title="Clases y merch"
      subtitle="Crea paquetes de clases, ponles precio y carga los productos de la tienda."
    >
      <RouterLink
        :to="{ name: 'AdminProductEdit', params: { id: 'nuevo' }, query: { type } }"
        class="btn btn--primary"
      >
        <i class="fa-solid fa-plus"></i>
        {{ isCourse ? 'Nuevo paquete de clases' : 'Nuevo producto' }}
      </RouterLink>
    </AdminPageHeader>

    <div class="adm-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        class="adm-tab"
        :class="{ 'adm-tab--active': isCourse }"
        :aria-selected="isCourse"
        @click="setType('course')"
      >
        <i class="fa-solid fa-circle-play"></i>
        Clases online
      </button>
      <button
        type="button"
        role="tab"
        class="adm-tab"
        :class="{ 'adm-tab--active': !isCourse }"
        :aria-selected="!isCourse"
        @click="setType('physical')"
      >
        <i class="fa-solid fa-shirt"></i>
        Merch
      </button>
    </div>

    <SearchInput v-model="q" placeholder="Buscar por nombre…" />

    <AdminState
      :loading="loading"
      :error="error"
      :empty="!items.length"
      :empty-title="q ? 'No encontramos nada con ese nombre' : 'Todavía no hay nada aquí'"
      :empty-text="
        q
          ? 'Prueba con otra palabra.'
          : isCourse
            ? 'Crea tu primer paquete de clases y después súbele los videos.'
            : 'Carga tu primer producto de la tienda.'
      "
      @retry="reload"
    >
      <template #empty-action>
        <RouterLink
          v-if="!q"
          :to="{ name: 'AdminProductEdit', params: { id: 'nuevo' }, query: { type } }"
          class="btn btn--primary"
        >
          <i class="fa-solid fa-plus"></i>
          Crear ahora
        </RouterLink>
      </template>

      <ul class="adm-list">
        <li v-for="product in items" :key="product.id" class="adm-row">
          <div class="adm-row__head">
            <img
              v-if="product.cover"
              :src="product.cover.url"
              alt=""
              class="adm-row__thumb"
              loading="lazy"
            />
            <span v-else class="adm-row__thumb"><i class="fa-regular fa-image"></i></span>
            <div class="adm-row__main">
              <p class="adm-row__title">{{ product.title }}</p>
              <p class="adm-row__meta">{{ meta(product) }}</p>
            </div>
          </div>

          <div class="adm-row__cell">
            <span class="adm-row__label">Precio</span>
            <span>
              <strong>{{ formatCents(product.priceCents) }}</strong>
              <s v-if="product.compareAtCents" class="adm-row__meta">
                {{ formatCents(product.compareAtCents) }}
              </s>
            </span>
          </div>

          <div class="adm-row__cell">
            <span class="adm-row__label">Estado</span>
            <span class="chips">
              <StatusChip v-bind="publishedChip(product.isPublished)" />
              <StatusChip v-if="product.isFeatured" label="Destacado" tone="info" icon="fa-star" />
            </span>
          </div>

          <div class="adm-row__actions">
            <RouterLink
              :to="{ name: 'AdminProductEdit', params: { id: product.id } }"
              class="adm-action"
            >
              <i class="fa-solid fa-pen"></i>
              Editar
            </RouterLink>
            <RouterLink
              v-if="product.type === 'course'"
              :to="{ name: 'AdminCourseContent', params: { id: product.id } }"
              class="adm-action"
            >
              <i class="fa-solid fa-film"></i>
              Videos
            </RouterLink>
            <button
              type="button"
              class="adm-action"
              :disabled="busy"
              @click="togglePublished(product)"
            >
              <i class="fa-solid" :class="product.isPublished ? 'fa-eye-slash' : 'fa-eye'"></i>
              {{ product.isPublished ? 'Ocultar' : 'Publicar' }}
            </button>
            <button
              type="button"
              class="adm-action adm-action--danger adm-action--icon"
              aria-label="Borrar"
              @click="toDelete = product"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
      <Pagination :page="page" :pages="pages" :total="total" @change="load" />
    </AdminState>

    <ConfirmDialog
      :open="Boolean(toDelete)"
      :title="`¿Borrar «${toDelete?.title}»?`"
      message="Desaparece del sitio y no se puede recuperar. Si solo quieres que no se vea, mejor ocúltalo."
      confirm-label="Sí, borrar"
      :busy="busy"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </div>
</template>

<style scoped lang="scss">
.chips {
  @include flex(row, center, flex-end, 0.3rem);
  flex-wrap: wrap;

  @include from('md') {
    justify-content: flex-start;
  }
}
</style>
