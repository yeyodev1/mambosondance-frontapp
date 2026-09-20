<script setup lang="ts">
import { adminNav } from '@/composables/admin/nav'

defineProps<{ userName: string }>()
const emit = defineEmits<{ navigate: []; logout: [] }>()
</script>

<template>
  <nav class="nav" aria-label="Secciones del panel">
    <div v-for="group in adminNav" :key="group.title" class="nav__group">
      <p class="nav__heading">{{ group.title }}</p>
      <RouterLink
        v-for="item in group.items"
        :key="item.name"
        :to="{ name: item.name }"
        class="nav__link"
        :exact-active-class="
          item.name === 'AdminDashboard' ? 'nav__link--active' : 'nav__link--exact'
        "
        :active-class="item.name === 'AdminDashboard' ? 'nav__link--within' : 'nav__link--active'"
        @click="emit('navigate')"
      >
        <i :class="item.icon" class="nav__icon"></i>
        {{ item.label }}
      </RouterLink>
    </div>

    <div class="nav__group nav__group--foot">
      <p class="nav__user">
        <i class="fa-solid fa-circle-user"></i>
        {{ userName }}
      </p>
      <RouterLink :to="{ name: 'Home' }" class="nav__link" @click="emit('navigate')">
        <i class="fa-solid fa-arrow-up-right-from-square nav__icon"></i>
        Ver el sitio
      </RouterLink>
      <button type="button" class="nav__link" @click="emit('logout')">
        <i class="fa-solid fa-right-from-bracket nav__icon"></i>
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  @include flex(column, stretch, flex-start, 1.25rem);
  flex: 1 1 auto;
  padding: 1rem 0.75rem 1.5rem;
  overflow-y: auto;

  &__group {
    @include flex(column, stretch, flex-start, 0.15rem);

    &--foot {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid $line-dark;
    }
  }

  &__heading {
    padding: 0 0.75rem 0.3rem;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $on-dark-soft;
  }

  &__user {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0 0.75rem 0.5rem;
    font-size: $text-sm;
    color: $on-dark-soft;
    overflow-wrap: anywhere;
  }

  &__link {
    @include flex(row, center, flex-start, 0.75rem);
    min-height: 46px;
    padding: 0.5rem 0.75rem;
    border-radius: $radius-sm;
    font-size: $text-base;
    font-weight: 500;
    color: $on-dark;
    text-align: left;
    @include transition(background-color);

    &:hover {
      background: $line-dark;
    }

    &--active {
      background: $accent;
      font-weight: 700;

      &:hover {
        background: $accent;
      }
    }
  }

  &__icon {
    flex: 0 0 auto;
    width: 1.25rem;
    text-align: center;
  }
}
</style>
