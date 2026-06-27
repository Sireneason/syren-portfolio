<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div class="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <router-link to="/?tab=综合" class="font-sans text-xs tracking-[0.3em] uppercase text-stone-800">
          ← Home
        </router-link>
        <div class="flex items-center gap-8">
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-[#F37021] transition-colors cursor-pointer">Women</span>
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-[#F37021] transition-colors cursor-pointer">Men</span>
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-[#F37021] transition-colors cursor-pointer">Accessories</span>
        </div>
        <span class="font-serif text-lg text-stone-800">Fashion</span>
      </div>
    </nav>

    <!-- Full-bleed Hero -->
    <section class="relative h-screen overflow-hidden">
      <div class="absolute inset-0">
        <img
          :src="img.fashion_hero"
          alt="Fashion hero"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
      </div>
      <div class="relative z-10 h-full flex flex-col justify-end pb-24 px-8">
        <div class="max-w-7xl mx-auto w-full">
          <p class="font-sans text-xs tracking-[0.4em] uppercase text-white/70 mb-4">
            Spring / Summer 2026
          </p>
          <h1 class="font-serif text-6xl md:text-8xl text-white leading-none mb-6">
            The Art of<br />
            <span class="text-[#F37021]">Movement</span>
          </h1>
          <p class="font-sans text-base text-white/80 max-w-lg leading-relaxed mb-8">
            A collection that celebrates the fluidity of form — where heritage meets modernity
            and every piece tells a story of exceptional savoir-faire.
          </p>
          <a href="#collection" class="inline-flex items-center gap-3 text-white border-b border-white/40 pb-1 hover:border-[#F37021] hover:text-[#F37021] transition-all">
            <span class="text-sm tracking-wider uppercase">Explore the collection</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Brand Story -->
    <section class="py-24 px-8 bg-[#FDF6EC]">
      <div class="max-w-4xl mx-auto text-center">
        <div class="w-12 h-12 mx-auto mb-10">
          <svg viewBox="0 0 48 48" fill="none" class="text-[#F37021]">
            <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M24 4v40M4 14l20 10 20-10" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h2 class="font-serif text-4xl text-[#1A1A1A] mb-8">A Legacy of<br />Craftsmanship</h2>
        <p class="font-sans text-base text-stone-600 leading-relaxed max-w-2xl mx-auto">
          Since our founding, we have believed that true luxury is born from the hands of artisans —
          each stitch, each cut, each finish executed with patience and precision.
          Our collections are not merely garments; they are investments in timeless elegance.
        </p>
      </div>
    </section>

    <!-- Collection Grid -->
    <section id="collection" class="py-24 px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-16">
          <div>
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-stone-400 mb-3">The Collection</p>
            <h2 class="font-serif text-4xl text-stone-800">SS26 Essentials</h2>
          </div>
          <span class="font-sans text-sm text-stone-400">12 pieces</span>
        </div>

        <!-- Mixed Grid -->
        <div class="grid grid-cols-12 gap-4">
          <!-- Large feature -->
          <div class="col-span-12 md:col-span-7 group cursor-pointer">
            <div class="aspect-[4/5] overflow-hidden mb-4">
              <img
                :src="img.fashion_feature1"
                alt="Feature"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p class="font-sans text-xs tracking-wider uppercase text-stone-400 mb-1">Outerwear</p>
            <h4 class="font-serif text-2xl text-stone-800 mb-1">Silk Twill Trench Coat</h4>
            <p class="font-sans text-sm text-[#F37021]">¥28,800</p>
          </div>

          <!-- Side items -->
          <div class="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
            <div class="group cursor-pointer">
              <div class="aspect-[3/4] overflow-hidden mb-3">
                <img
                  :src="img.fashion_side1"
                  alt="Side 1"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p class="font-sans text-xs text-stone-400 uppercase tracking-wider mb-1">Knitwear</p>
              <h4 class="font-serif text-base text-stone-800">Cashmere Pullover</h4>
              <p class="font-sans text-sm text-[#F37021] mt-1">¥12,600</p>
            </div>
            <div class="group cursor-pointer">
              <div class="aspect-[3/4] overflow-hidden mb-3">
                <img
                  :src="img.fashion_side2"
                  alt="Side 2"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p class="font-sans text-xs text-stone-400 uppercase tracking-wider mb-1">Trousers</p>
              <h4 class="font-serif text-base text-stone-800">Wide-leg Wool Pant</h4>
              <p class="font-sans text-sm text-[#F37021] mt-1">¥9,800</p>
            </div>
          </div>

          <!-- Bottom row -->
          <div class="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div v-for="item in bottomItems" :key="item.name" class="group cursor-pointer">
              <div class="aspect-[3/4] overflow-hidden mb-3">
                <img
                  :src="img[item.imageKey]"
                  :alt="item.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p class="font-sans text-xs text-stone-400 uppercase tracking-wider mb-1">{{ item.category }}</p>
              <h4 class="font-serif text-base text-stone-800">{{ item.name }}</h4>
              <p class="font-sans text-sm text-[#F37021] mt-1">{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Craftsmanship -->
    <section class="py-24 px-8 bg-stone-50">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p class="font-sans text-xs tracking-[0.3em] uppercase text-stone-400 mb-6">Savoir-Faire</p>
          <h2 class="font-serif text-4xl text-stone-800 mb-8">The Hands<br />Behind the Thread</h2>
          <p class="font-sans text-base text-stone-600 leading-relaxed mb-6">
            Every piece passes through the hands of our master artisans — some with over 30 years
            of experience. From pattern cutting to the final press, each step is guided by expertise
            passed down through generations.
          </p>
          <div class="flex gap-12 mt-10">
            <div>
              <p class="font-serif text-4xl text-[#F37021]">300+</p>
              <p class="font-sans text-xs tracking-wider uppercase text-stone-400 mt-2">Hours per piece</p>
            </div>
            <div>
              <p class="font-serif text-4xl text-[#F37021]">47</p>
              <p class="font-sans text-xs tracking-wider uppercase text-stone-400 mt-2">Master artisans</p>
            </div>
          </div>
        </div>
        <div class="aspect-[4/5] overflow-hidden">
          <img
            :src="img.fashion_craft"
            alt="Craftsmanship"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#1A1A1A] py-16 px-8">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="font-serif text-xl text-white">Fascinate Fashion</p>
        <div class="flex gap-8">
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-400">Atelier</span>
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-400">Careers</span>
          <span class="font-sans text-xs tracking-[0.2em] uppercase text-stone-400">Contact</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useImagePaths } from '../composables/useImagePath'

const img = useImagePaths([
  'fashion_hero',
  'fashion_feature1',
  'fashion_side1', 'fashion_side2',
  'fashion_item1', 'fashion_item2', 'fashion_item3', 'fashion_item4',
  'fashion_craft'
])

const bottomItems = [
  { name: 'Cotton Poplin Shirt', category: 'Shirts', price: '¥5,800', imageKey: 'fashion_item1' },
  { name: 'Leather Belt', category: 'Accessories', price: '¥4,200', imageKey: 'fashion_item2' },
  { name: 'Silk Scarf', category: 'Scarves', price: '¥3,600', imageKey: 'fashion_item3' },
  { name: 'Suede Loafers', category: 'Shoes', price: '¥8,900', imageKey: 'fashion_item4' },
]
</script>
