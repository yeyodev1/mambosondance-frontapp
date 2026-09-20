<script setup lang="ts">
import AdminField from './AdminField.vue'
import type { VariantDraft } from '@/composables/admin/useProductForm'

const category = defineModel<string>('category', { required: true })
const variants = defineModel<VariantDraft[]>('variants', { required: true })
const stock = defineModel<number | null>('stock', { required: true })

defineProps<{
  categories: string[]
  errors: Partial<Record<'category', string>>
}>()

function addVariant() {
  variants.value = [...variants.value, { name: '', optionsText: '' }]
}

function removeVariant(index: number) {
  variants.value = variants.value.filter((_, i) => i !== index)
}

// Un input number vacío entrega '' y no null: acá se normaliza.
function onStock(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const value = Number(raw)
  stock.value = raw === '' || !Number.isInteger(value) || value < 0 ? null : value
}
</script>

<template>
  <div class="adm-form">
    <div class="adm-form__row">
      <AdminField
        label="Categoría"
        for="product-category"
        required
        :error="errors.category"
        help="Elige una de las que ya usas o escribe una nueva."
      >
        <input
          id="product-category"
          v-model="category"
          type="text"
          list="product-categories"
          placeholder="Camisetas, Zapatos, Termos…"
        />
        <datalist id="product-categories">
          <option v-for="item in categories" :key="item" :value="item"></option>
        </datalist>
      </AdminField>

      <AdminField
        label="Unidades disponibles (opcional)"
        for="product-stock"
        help="Déjalo vacío si no quieres llevar la cuenta del stock."
      >
        <input
          id="product-stock"
          :value="stock ?? ''"
          type="number"
          inputmode="numeric"
          min="0"
          step="1"
          placeholder="Sin control"
          @input="onStock"
        />
      </AdminField>
    </div>

    <div v-if="categories.length" class="suggest">
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        class="suggest__chip"
        :class="{ 'suggest__chip--on': item === category }"
        @click="category = item"
      >
        {{ item }}
      </button>
    </div>

    <div class="variants">
      <p class="adm-subtitle">Variantes (tallas, colores…)</p>
      <p class="adm-help">
        Lo que el cliente debe elegir al comprar. Separa las opciones con comas: S, M, L, XL.
      </p>

      <div v-for="(variant, index) in variants" :key="index" class="variants__item">
        <div class="adm-form__row">
          <AdminField label="Nombre" :for="`variant-name-${index}`">
            <input
              :id="`variant-name-${index}`"
              v-model="variant.name"
              type="text"
              placeholder="Talla"
            />
          </AdminField>
          <AdminField label="Opciones, separadas por coma" :for="`variant-options-${index}`">
            <input
              :id="`variant-options-${index}`"
              v-model="variant.optionsText"
              type="text"
              placeholder="S, M, L, XL"
            />
          </AdminField>
        </div>
        <button
          type="button"
          class="adm-action adm-action--danger variants__remove"
          @click="removeVariant(index)"
        >
          <i class="fa-solid fa-trash"></i>
          Quitar variante
        </button>
      </div>

      <button type="button" class="adm-action variants__add" @click="addVariant">
        <i class="fa-solid fa-plus"></i>
        Agregar variante
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.suggest {
  @include flex(row, center, flex-start, 0.4rem);
  flex-wrap: wrap;
  margin-top: -0.5rem;

  &__chip {
    min-height: 38px;
    padding: 0.3rem 0.85rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: $text-sm;
    color: $ink-soft;

    &--on {
      border-color: $accent;
      color: $accent;
      font-weight: 700;
    }
  }
}

.variants {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__item {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 0.9rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $paper;
  }

  &__remove,
  &__add {
    align-self: flex-start;
  }
}
</style>
