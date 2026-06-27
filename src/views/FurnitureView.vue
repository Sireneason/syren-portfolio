<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div class="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <router-link to="/?tab=综合" class="font-sans text-xs tracking-[0.3em] uppercase text-stone-800">
          ← Home
        </router-link>
        <span class="font-serif text-lg text-stone-800">Furniture</span>
        <div class="flex gap-6">
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-[#8B6F47] transition-colors cursor-pointer">Living</span>
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-[#8B6F47] transition-colors cursor-pointer">Bedroom</span>
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-[#8B6F47] transition-colors cursor-pointer">Dining</span>
        </div>
      </div>
    </nav>

    <!-- Hero - Lifestyle Scene -->
    <section class="relative h-[90vh] overflow-hidden mt-20">
      <img
        :src="img.furniture_hero"
        alt="Furniture hero"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
      <div class="absolute inset-0 flex items-center">
        <div class="max-w-7xl mx-auto px-8 w-full">
          <div class="max-w-lg">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-white/70 mb-4">New Arrivals</p>
            <h1 class="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
              Live<br />Beautifully.
            </h1>
            <p class="font-sans text-base text-white/80 leading-relaxed mb-8">
              Thoughtfully designed furniture that brings warmth, character and comfort
              to every room in your home.
            </p>
            <a href="#rooms" class="inline-flex items-center gap-3 text-white border-b border-white/40 pb-1 hover:border-white transition-all">
              <span class="text-sm tracking-wider uppercase">Shop by room</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Shop by Room -->
    <section id="rooms" class="py-24 px-8 bg-[#F7F3EE]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="font-serif text-4xl text-stone-800 mb-4">Shop by Room</h2>
          <p class="font-sans text-sm text-stone-500">Find inspiration for every space</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="room in rooms" :key="room.name" class="group cursor-pointer">
            <div class="relative aspect-[3/4] overflow-hidden rounded-lg mb-5">
              <img
                :src="img[room.imageKey]"
                :alt="room.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div class="absolute bottom-6 left-6">
                <h3 class="font-serif text-2xl text-white">{{ room.name }}</h3>
                <p class="font-sans text-sm text-white/80">{{ room.count }} pieces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Collection -->
    <section class="py-24 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-16">
          <div>
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#A8B5A0] mb-3">This Season</p>
            <h2 class="font-serif text-4xl text-stone-800">Organic Modern</h2>
          </div>
          <span class="font-sans text-sm text-stone-400">8 pieces</span>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.name" class="group cursor-pointer">
            <div class="aspect-square overflow-hidden rounded-lg mb-4 bg-stone-100">
              <img
                :src="img[product.imageKey]"
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h4 class="font-serif text-base text-stone-800 mb-1">{{ product.name }}</h4>
            <p class="font-sans text-xs text-stone-500 uppercase tracking-wider mb-2">{{ product.material }}</p>
            <p class="font-sans text-sm text-[#8B6F47]">¥{{ product.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lifestyle Banner -->
    <section class="relative h-[60vh] overflow-hidden">
      <img
        :src="img.furniture_lifestyle"
        alt="Lifestyle"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-white/70 mb-4">Our Promise</p>
          <h2 class="font-serif text-4xl md:text-5xl text-white mb-6">
            Sustainable by Design
          </h2>
          <p class="font-sans text-base text-white/80 max-w-lg mx-auto leading-relaxed">
            Every piece is crafted from responsibly sourced materials —
            FSC-certified wood, organic cotton, recycled metals. Beautiful living, responsibly made.
          </p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-24 px-8 bg-[#F7F3EE]">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="font-serif text-3xl text-stone-800 mb-4">What Our Customers Say</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div v-for="review in reviews" :key="review.name" class="text-center">
            <div class="flex justify-center mb-4">
              <span v-for="i in 5" :key="i" class="text-[#8B6F47]">★</span>
            </div>
            <p class="font-serif text-lg text-stone-700 italic leading-relaxed mb-6">
              "{{ review.text }}"
            </p>
            <p class="font-sans text-sm text-stone-500">— {{ review.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#8B6F47] py-16 px-8">
      <div class="max-w-7xl mx-auto text-center">
        <p class="font-serif text-xl text-white mb-4">Fascinate Furniture</p>
        <p class="font-sans text-xs tracking-[0.2em] uppercase text-white/60">
          Designed for how you live
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useImagePaths } from '../composables/useImagePath'

const img = useImagePaths([
  'furniture_hero',
  'furniture_living', 'furniture_bedroom', 'furniture_dining',
  'furniture_prod1', 'furniture_prod2', 'furniture_prod3', 'furniture_prod4',
  'furniture_prod5', 'furniture_prod6', 'furniture_prod7', 'furniture_prod8',
  'furniture_lifestyle'
])

const rooms = [
  { name: 'Living Room', count: 42, imageKey: 'furniture_living' },
  { name: 'Bedroom', count: 36, imageKey: 'furniture_bedroom' },
  { name: 'Dining', count: 28, imageKey: 'furniture_dining' },
]

const products = [
  { name: 'Arlo Boucle Sofa', material: 'Boucle / Walnut', price: 18800, imageKey: 'furniture_prod1' },
  { name: 'Sage Oak Dining Table', material: 'Solid Oak', price: 12600, imageKey: 'furniture_prod2' },
  { name: 'Linen Armchair', material: 'Belgian Linen', price: 8900, imageKey: 'furniture_prod3' },
  { name: 'Ceramic Table Lamp', material: 'Hand-thrown Ceramic', price: 2400, imageKey: 'furniture_prod4' },
  { name: 'Wool Area Rug', material: 'New Zealand Wool', price: 5600, imageKey: 'furniture_prod5' },
  { name: 'Brass Floor Lamp', material: 'Brushed Brass', price: 3800, imageKey: 'furniture_prod6' },
  { name: 'Linen Curtain Set', material: 'Organic Linen', price: 2800, imageKey: 'furniture_prod7' },
  { name: 'Walnut Bookshelf', material: 'American Walnut', price: 9200, imageKey: 'furniture_prod8' },
]

const reviews = [
  { name: 'Sarah K.', text: 'The quality is extraordinary. Our sofa has become the heart of our home — beautifully made and incredibly comfortable.' },
  { name: 'James L.', text: 'Sustainable materials without compromising on design. The oak dining table is a masterpiece we use every single day.' },
]
</script>
