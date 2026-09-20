<script setup lang="ts">
import { site } from '@/config/site'
import HomeHero from '@/components/home/HomeHero.vue'
import HomePromos from '@/components/home/HomePromos.vue'
import HomeQuote from '@/components/home/HomeQuote.vue'
import HomePillars from '@/components/home/HomePillars.vue'
import HomeOnline from '@/components/home/HomeOnline.vue'
import HomeEvents from '@/components/home/HomeEvents.vue'
import HomeShop from '@/components/home/HomeShop.vue'
import HomeLoyalty from '@/components/home/HomeLoyalty.vue'
import BrandMarquee from '@/components/ui/BrandMarquee.vue'
</script>

<template>
  <div class="home">
    <HomeHero />
    <BrandMarquee :items="site.academy.values" variant="words" tone="red" />
    <HomePromos />
    <HomeQuote />
    <HomePillars />
    <HomeOnline />
    <HomeEvents />
    <HomeShop />
    <HomeLoyalty />
    <BrandMarquee :items="site.phrases" variant="phrases" tone="night" reverse />
  </div>
</template>

<style scoped lang="scss">
.home {
  @include flex(column, stretch);
  width: 100%;
  // Las fotos a sangre y los giros de la marca nunca deben abrir scroll lateral.
  overflow-x: clip;
}
</style>
