<template>
  <div class="min-h-screen" :style="{ backgroundColor: '#F5F0EB' }">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-[#F5F0EB]/90 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <router-link to="/?tab=综合" class="font-sans text-xs tracking-[0.3em] uppercase text-[#4A3728]">
          ← Home
        </router-link>
        <span class="font-serif text-lg text-[#4A3728]">Beauty</span>
        <span class="font-sans text-xs tracking-[0.2em] uppercase text-[#6B6B4E]">Collection</span>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-24 pb-20 px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
        <div class="order-2 lg:order-1">
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#6B6B4E] mb-6">
            Botanical Formulations
          </p>
          <h1 class="font-serif text-5xl md:text-7xl text-[#4A3728] leading-tight mb-8">
            Formulated with<br />
            <em class="font-light">intention.</em>
          </h1>
          <p class="font-sans text-base text-[#6B6B4E] leading-relaxed max-w-md mb-10">
            Each product is a considered composition of botanical, laboratory-made and organic ingredients —
            designed to nurture skin, body and hair through daily ritual.
          </p>
          <a href="#products" class="inline-flex items-center gap-3 text-[#4A3728] border-b border-[#4A3728]/30 pb-1 hover:border-[#4A3728] transition-colors">
            <span class="text-sm tracking-wider uppercase">Discover the range</span>
          </a>
        </div>
        <div class="order-1 lg:order-2">
          <div class="aspect-[3/4] overflow-hidden rounded-sm">
            <img
              :src="img.beauty_hero"
              alt="Beauty hero"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy Strip -->
    <section class="bg-[#4A3728] py-20 px-8">
      <div class="max-w-4xl mx-auto text-center">
        <p class="font-serif text-2xl md:text-3xl text-[#F5F0EB] leading-relaxed italic">
          "We seek to create products of exceptional quality that enhance daily life
          and contribute to a more considered existence."
        </p>
        <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#C4A882] mt-8">
          Our Philosophy
        </p>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-24 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div v-for="cat in categories" :key="cat.name" class="group cursor-pointer">
            <div class="aspect-square overflow-hidden rounded-sm mb-6">
              <img
                :src="img[cat.imageKey]"
                :alt="cat.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h3 class="font-serif text-xl text-[#4A3728] mb-2">{{ cat.name }}</h3>
            <p class="font-sans text-sm text-[#6B6B4E]">{{ cat.count }} products</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section id="products" class="py-24 px-8 bg-white/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#6B6B4E] mb-4">Featured</p>
          <h2 class="font-serif text-4xl text-[#4A3728]">Essential Formulations</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="product in products" :key="product.name" class="group cursor-pointer">
            <div class="aspect-[3/4] overflow-hidden rounded-sm mb-5 bg-[#EDE8E2]">
              <img
                :src="img[product.imageKey]"
                :alt="product.name"
                class="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90"
              />
            </div>
            <p class="font-sans text-xs text-[#6B6B4E] tracking-wider uppercase mb-1">{{ product.category }}</p>
            <h4 class="font-serif text-lg text-[#4A3728] mb-1">{{ product.name }}</h4>
            <p class="font-sans text-sm text-[#6B6B4E]">{{ product.volume }}</p>
            <p class="font-sans text-sm text-[#4A3728] mt-2">¥{{ product.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Ingredients Section -->
    <section class="py-24 px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="aspect-[4/3] overflow-hidden rounded-sm">
          <img
            :src="img.beauty_ingredients"
            alt="Ingredients"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#6B6B4E] mb-6">Ingredients</p>
          <h2 class="font-serif text-4xl text-[#4A3728] mb-8">Sourced with<br />purpose.</h2>
          <p class="font-sans text-base text-[#6B6B4E] leading-relaxed mb-6">
            We source botanical extracts from trusted growers across the globe —
            Chamomile from Egypt, Rose Damascena from Turkey, Camellia Seed Oil from Japan.
          </p>
          <p class="font-sans text-base text-[#6B6B4E] leading-relaxed">
            Every ingredient is selected for its proven efficacy and environmental sustainability.
            No unnecessary additives. No compromise.
          </p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#4A3728] py-16 px-8">
      <div class="max-w-7xl mx-auto text-center">
        <p class="font-serif text-xl text-[#F5F0EB] mb-4">Fascinate Beauty</p>
        <p class="font-sans text-xs tracking-[0.2em] uppercase text-[#C4A882]">
          Formulated with intention
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useImagePaths } from '../composables/useImagePath'

const img = useImagePaths([
  'beauty_hero',
  'beauty_skin', 'beauty_body', 'beauty_hair',
  'beauty_product1', 'beauty_product2', 'beauty_product3', 'beauty_product4',
  'beauty_ingredients'
])

const categories = [
  { name: 'Skin', count: 12, imageKey: 'beauty_skin' },
  { name: 'Body', count: 8, imageKey: 'beauty_body' },
  { name: 'Hair', count: 6, imageKey: 'beauty_hair' },
]

const products = [
  { name: 'Parsley Seed Facial Cleanser', category: 'Skin', volume: '200ml', price: 380, imageKey: 'beauty_product1' },
  { name: 'Coriander Seed Body Cleanser', category: 'Body', volume: '500ml', price: 420, imageKey: 'beauty_product2' },
  { name: 'Rose Hair & Body Conditioner', category: 'Hair', volume: '500ml', price: 450, imageKey: 'beauty_product3' },
  { name: 'Tea Tree Leaf Hydrating Toner', category: 'Skin', volume: '100ml', price: 320, imageKey: 'beauty_product4' },
]
</script>
