<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCart } from './store/cart'
import { computed } from 'vue'

const route = useRoute()
const { state } = useCart()
const cartCount = computed(() => state.items.reduce((sum, i) => sum + i.quantity, 0))
const isActive = (path: string) => route.path === path

const showTabBar = computed(() => {
  return ['/', '/video', '/gallery', '/cart', '/about'].includes(route.path)
})
const showHeader = computed(() => {
  return !['/beauty', '/fashion', '/furniture', '/crafts'].includes(route.path)
})
</script>

<template>
  <div class="min-h-screen bg-bg" :class="showTabBar ? 'pb-14 md:pb-0' : ''">
    <header v-show="showHeader" class="hidden md:flex sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 px-12 items-center justify-between">
      <router-link to="/" class="text-2xl font-black tracking-tighter text-text hover:opacity-80 transition-opacity">
        PORTFOLIO<span class="text-primary">.</span>
      </router-link>
      
      <nav class="flex gap-8 text-base font-light text-text-light tracking-wide items-center">
        <router-link to="/" class="hover:text-text transition-colors relative pb-1" :class="{'text-text font-medium': isActive('/')}">首页
          <span v-if="isActive('/')" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </router-link>
        <router-link to="/video" class="hover:text-text transition-colors relative pb-1" :class="{'text-text font-medium': isActive('/video')}">视频
          <span v-if="isActive('/video')" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </router-link>
        <router-link to="/gallery" class="hover:text-text transition-colors relative pb-1" :class="{'text-text font-medium': isActive('/gallery')}">画廊
          <span v-if="isActive('/gallery')" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </router-link>
        <router-link to="/cart" class="hover:text-text transition-colors flex items-center gap-2 relative pb-1" :class="{'text-text font-medium': isActive('/cart')}">购物车
          <span v-if="cartCount > 0" class="absolute -top-2 -right-5 bg-accent text-text text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{{ cartCount > 99 ? '99+' : cartCount }}</span>
          <span v-if="isActive('/cart')" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
        </router-link>
        
        <router-link to="/about" class="ml-auto hover:opacity-80 transition-all relative border border-primary/40 bg-primary/5 text-primary px-5 py-1.5 rounded-full text-base font-medium tracking-wide" :class="{'ring-2 ring-accent shadow-lg shadow-accent/20': isActive('/about')}">关于我</router-link>
      </nav>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <nav v-show="showTabBar" class="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 h-14 flex items-center justify-around z-50 pb-safe">
      <router-link to="/" class="flex flex-col items-center text-[11px] font-light tracking-wider" :class="isActive('/') ? 'text-primary font-medium' : 'text-text-light'"><span class="text-xl mb-0.5">🏠</span>首页</router-link>
      <router-link to="/video" class="flex flex-col items-center text-[11px] font-light tracking-wider" :class="isActive('/video') ? 'text-primary font-medium' : 'text-text-light'"><span class="text-xl mb-0.5">▶️</span>视频</router-link>
      <router-link to="/gallery" class="flex flex-col items-center text-[11px] font-light tracking-wider" :class="isActive('/gallery') ? 'text-primary font-medium' : 'text-text-light'"><span class="text-xl mb-0.5">🖼️</span>画廊</router-link>
      <router-link to="/cart" class="flex flex-col items-center text-[11px] font-light tracking-wider relative" :class="isActive('/cart') ? 'text-primary font-medium' : 'text-text-light'"><span class="text-xl mb-0.5">🛒</span>购物车
        <span v-if="cartCount > 0" class="absolute top-0 left-7 bg-accent text-text text-[9px] font-bold min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </router-link>
      <router-link to="/about" class="flex flex-col items-center text-[11px] tracking-wide px-3 py-1 rounded-lg transition-all text-primary font-medium border border-primary/40 bg-primary/5" :class="{'ring-2 ring-accent': isActive('/about')}"><span class="text-lg mb-0.5">👤</span>关于我</router-link>
    </nav>
  </div>
</template>