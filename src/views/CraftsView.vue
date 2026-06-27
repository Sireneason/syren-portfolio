<template>
  <div class="min-h-screen bg-[#1A1A1A]">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-[#1A1A1A]/95 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between border-b border-white/10">
        <router-link to="/?tab=综合" class="font-sans text-xs tracking-[0.3em] uppercase text-white/60">
          ← Home
        </router-link>
        <span class="font-serif text-lg text-[#C4A265]">Crafts</span>
        <span class="font-sans text-xs tracking-[0.2em] uppercase text-white/40">Atelier</span>
      </div>
    </nav>

    <!-- Hero - Dramatic -->
    <section class="relative h-screen overflow-hidden flex items-center justify-center">
      <img
        :src="img.crafts_hero"
        alt="Crafts hero"
        class="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/60 via-transparent to-[#1A1A1A]"></div>
      <div class="relative z-10 text-center px-6">
        <div class="w-16 h-px bg-[#C4A265] mx-auto mb-10"></div>
        <h1 class="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
          The Object<br />
          <em class="text-[#C4A265] font-light">d'Art</em>
        </h1>
        <p class="font-sans text-sm text-white/60 max-w-md mx-auto leading-relaxed mb-10">
          Handcrafted treasures where ancient techniques meet contemporary vision —
          each piece a testament to the art of making.
        </p>
        <div class="w-16 h-px bg-[#C4A265]/40 mx-auto"></div>
      </div>
    </section>

    <!-- Manifesto -->
    <section class="py-28 px-8 border-b border-white/10">
      <div class="max-w-4xl mx-auto text-center">
        <p class="font-sans text-xs tracking-[0.4em] uppercase text-[#C4A265] mb-8">Manifesto</p>
        <p class="font-serif text-2xl md:text-3xl text-white/90 leading-relaxed italic">
          "In an age of mass production, we choose the slow path — the hand of the maker,
          the imperfection of the handmade, the soul embedded in every surface and curve."
        </p>
      </div>
    </section>

    <!-- Categories - Elegant Grid -->
    <section class="py-24 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Collections</p>
          <h2 class="font-serif text-4xl text-white">Disciplines</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          <div v-for="cat in categories" :key="cat.name" class="group cursor-pointer bg-[#1A1A1A] p-10 hover:bg-white/5 transition-colors duration-500">
            <div class="aspect-[3/4] overflow-hidden mb-8">
              <img
                :src="img[cat.imageKey]"
                :alt="cat.name"
                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            <h3 class="font-serif text-2xl text-white mb-3">{{ cat.name }}</h3>
            <p class="font-sans text-sm text-white/50 leading-relaxed mb-4">{{ cat.desc }}</p>
            <span class="font-sans text-xs tracking-[0.2em] uppercase text-[#C4A265]">
              {{ cat.count }} pieces
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Piece - Full Width -->
    <section class="py-24 px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="aspect-[4/5] overflow-hidden">
          <img
            :src="img.crafts_featured"
            alt="Featured piece"
            class="w-full h-full object-cover"
          />
        </div>
        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#C4A265] mb-6">Pièce de Résistance</p>
          <h2 class="font-serif text-4xl text-white mb-6">The Vessel<br />Collection</h2>
          <p class="font-sans text-base text-white/60 leading-relaxed mb-6">
            Hand-thrown on the wheel by master ceramicists in Jingdezhen —
            each vessel undergoes 47 individual steps from raw clay to finished form.
            The glazes, developed over years of experimentation, respond to the kiln's
            atmosphere in ways that cannot be replicated.
          </p>
          <p class="font-sans text-base text-white/60 leading-relaxed mb-10">
            No two pieces are identical. Each carries the mark of its maker and the
            memory of fire.
          </p>
          <div class="flex gap-12">
            <div>
              <p class="font-serif text-3xl text-[#C4A265]">47</p>
              <p class="font-sans text-xs text-white/40 uppercase tracking-wider mt-2">Steps per piece</p>
            </div>
            <div>
              <p class="font-serif text-3xl text-[#C4A265]">1280°C</p>
              <p class="font-sans text-xs text-white/40 uppercase tracking-wider mt-2">Kiln temperature</p>
            </div>
            <div>
              <p class="font-serif text-3xl text-[#C4A265]">3</p>
              <p class="font-sans text-xs text-white/40 uppercase tracking-wider mt-2">Generations</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Grid - Dark Elegance -->
    <section class="py-24 px-8 bg-[#111111]">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="font-serif text-4xl text-white">Selected Works</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.name" class="group cursor-pointer">
            <div class="aspect-[3/4] overflow-hidden mb-4 bg-white/5">
              <img
                :src="img[product.imageKey]"
                :alt="product.name"
                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
            <p class="font-sans text-xs text-white/40 uppercase tracking-wider mb-1">{{ product.category }}</p>
            <h4 class="font-serif text-base text-white mb-1">{{ product.name }}</h4>
            <p class="font-sans text-sm text-[#C4A265]">¥{{ product.price.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Artisan Spotlight -->
    <section class="py-24 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-[#C4A265] mb-6">Artisan Spotlight</p>
            <h2 class="font-serif text-4xl text-white mb-8">The Potter's<br />Silence</h2>
            <p class="font-sans text-base text-white/60 leading-relaxed mb-6">
              Master Chen works in silence. At the wheel, his hands move with a precision
              that comes from forty years of daily practice. "The clay tells you what it wants to be,"
              he says. "You just have to listen."
            </p>
            <p class="font-sans text-base text-white/60 leading-relaxed">
              His vessels — from delicate tea bowls to monumental vases — have been collected
              by museums and private collectors across three continents.
            </p>
          </div>
          <div class="aspect-[4/5] overflow-hidden">
            <img
              :src="img.crafts_artisan"
              alt="Artisan"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-16 px-8">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="font-serif text-lg text-[#C4A265]">Fascinate Crafts</p>
        <p class="font-sans text-xs tracking-[0.2em] uppercase text-white/30">
          Handmade with intention
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useImagePaths } from '../composables/useImagePath'

const img = useImagePaths([
  'crafts_hero',
  'crafts_ceramics', 'crafts_textiles', 'crafts_metal',
  'crafts_featured',
  'crafts_prod1', 'crafts_prod2', 'crafts_prod3', 'crafts_prod4',
  'crafts_prod5', 'crafts_prod6', 'crafts_prod7', 'crafts_prod8',
  'crafts_artisan'
])

const categories = [
  { name: 'Ceramics', count: 24, desc: 'Hand-thrown vessels, tea sets and sculptural forms from master potters.', imageKey: 'crafts_ceramics' },
  { name: 'Textiles', count: 18, desc: 'Hand-woven fabrics, tapestries and embroidered works.', imageKey: 'crafts_textiles' },
  { name: 'Metalwork', count: 12, desc: 'Forged iron, cast bronze and precious metal objects.', imageKey: 'crafts_metal' },
]

const products = [
  { name: 'Celadon Moon Flask', category: 'Ceramics', price: 12800, imageKey: 'crafts_prod1' },
  { name: 'Iron Chisel Vase', category: 'Metalwork', price: 8600, imageKey: 'crafts_prod2' },
  { name: 'Indigo Tapestry', category: 'Textiles', price: 15200, imageKey: 'crafts_prod3' },
  { name: 'Raku Tea Bowl Set', category: 'Ceramics', price: 6800, imageKey: 'crafts_prod4' },
  { name: 'Bronze Incense Holder', category: 'Metalwork', price: 4200, imageKey: 'crafts_prod5' },
  { name: 'Silk Embroidered Screen', category: 'Textiles', price: 28000, imageKey: 'crafts_prod6' },
  { name: 'Stoneware Planter', category: 'Ceramics', price: 3600, imageKey: 'crafts_prod7' },
  { name: 'Copper Wall Sculpture', category: 'Metalwork', price: 9800, imageKey: 'crafts_prod8' },
]
</script>
