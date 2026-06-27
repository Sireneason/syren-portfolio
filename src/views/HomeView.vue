<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'
import type { ObjectDirective } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const allItems = ref<any[]>([])
const displayItems = ref<any[]>([])
const activeTab = ref('推荐')
const tabs = ['推荐', '服饰', '美妆', '日用品', '跨境', '综合']
const searchQuery = ref('')
const isLoading = ref(false)

const categoryMap: Record<string, string> = {
  '服饰': 'clothing', '美妆': 'beauty', '日用品': 'daily', '跨境': 'crossborder', '综合': 'general'
}

const realBanners = computed(() => {
  const banners = allItems.value
    .filter(item => item.bannerImg)
    .map(item => ({
      img: item.bannerImg,
      linkId: item.id,
      title: item.title.length > 10 ? item.title.substring(0, 10) + '...' : item.title
    }))
  for (let i = banners.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[banners[i], banners[j]] = [banners[j], banners[i]]
  }
  return banners
})

const loopBanners = computed(() => {
  if (realBanners.value.length === 0) return []
  if (realBanners.value.length === 1) return realBanners.value
  return [
    realBanners.value[realBanners.value.length - 1],
    ...realBanners.value,
    realBanners.value[0]
  ]
})

const bannerScrollRef = ref<HTMLElement | null>(null)
const currentBanner = ref(0)
let bannerTimer: any = null

const startBannerTimer = () => {
  stopBannerTimer()
  if (realBanners.value.length <= 1) return
  bannerTimer = setInterval(() => {
    if (!bannerScrollRef.value) return
    let targetIndex = currentBanner.value + 1
    if (targetIndex >= realBanners.value.length) targetIndex = 0
    bannerScrollRef.value.scrollTo({ left: (targetIndex + 1) * bannerScrollRef.value.clientWidth, behavior: 'smooth' })
  }, 5000)
}

const stopBannerTimer = () => { if (bannerTimer) clearInterval(bannerTimer) }

const onBannerScroll = () => {
  if (!bannerScrollRef.value) return
  const width = bannerScrollRef.value.clientWidth
  const scrollLeft = bannerScrollRef.value.scrollLeft
  let index = Math.round(scrollLeft / width)
  if (index === loopBanners.value.length - 1) {
    bannerScrollRef.value.scrollTo({ left: 1 * width, behavior: 'auto' })
    currentBanner.value = 0
  } else if (index === 0) {
    bannerScrollRef.value.scrollTo({ left: realBanners.value.length * width, behavior: 'auto' })
    currentBanner.value = realBanners.value.length - 1
  } else {
    currentBanner.value = index - 1
  }
}

const switchBanner = (direction: 1 | -1) => {
  if (!bannerScrollRef.value) return
  let nextIndex = currentBanner.value + direction
  if (nextIndex < 0) nextIndex = realBanners.value.length - 1
  if (nextIndex >= realBanners.value.length) nextIndex = 0
  bannerScrollRef.value.scrollTo({ left: (nextIndex + 1) * bannerScrollRef.value.clientWidth, behavior: 'smooth' })
  startBannerTimer()
}

const vReveal: ObjectDirective<HTMLElement> = {
  mounted(el: HTMLElement) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('is-visible'), parseInt(el.dataset.delay || '0'))
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    observer.observe(el)
  }
}

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const loadMore = () => {
  if (isLoading.value) return
  isLoading.value = true
  setTimeout(() => {
    let candidates = [...allItems.value]
    const newBatch = shuffle(candidates)
    displayItems.value.push(...newBatch)
    isLoading.value = false
  }, 600)
}

const handleScroll = () => {
  if (activeTab.value !== '推荐' || searchQuery.value.trim()) return
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800) {
    loadMore()
  }
}

const handleTabOrSearchChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  isLoading.value = false
}

onMounted(async () => {
  // 读取 URL query 中的 tab 参数，支持从子页面 ←HOME 返回时定位到指定 tab
  const queryTab = route.query.tab as string
  if (queryTab && tabs.includes(queryTab)) {
    activeTab.value = queryTab
  }

  const res = await fetch('/assets.json')
  const data = await res.json()
  
  // 🎯 核心修复：过滤掉 type 为 'video' 和 'gallery' 的项目，防止它们在主页显示为幽灵商品
  allItems.value = data
    .filter(item => item.type !== 'video' && item.type !== 'gallery')
    .map((item: any) => ({
      ...item,
      price: item.price || (Math.random() * 800 + 50).toFixed(0),
      originPrice: item.originPrice || (Math.random() * 1000 + 500).toFixed(0)
    }))
    
  loadMore()
  nextTick(() => {
    if (bannerScrollRef.value) bannerScrollRef.value.scrollLeft = bannerScrollRef.value.clientWidth * 1
    startBannerTimer()
  })
  window.addEventListener('scroll', handleScroll, { passive: true })
  // 预加载综合页 Hero 图片（多格式自动探测）
  heroBases.forEach(tryLoadHeroImage)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  stopBannerTimer()
})

const filteredItems = computed(() => {
  const isInfiniteMode = activeTab.value === '推荐' && !searchQuery.value.trim()
  let items = isInfiniteMode ? displayItems.value : allItems.value
  if (activeTab.value !== '推荐') {
    items = items.filter(i => i.category === categoryMap[activeTab.value])
  } else if (isInfiniteMode) {
    items = items.filter(i => i.category !== 'general')
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    items = items.filter(i => i.title.toLowerCase().includes(query))
  }
  return items
})

const goDetail = (id: string) => { router.push(`/detail/${id}`) }

// 综合页 Hero 图片多格式支持（jpg/png/webp 自动探测）
const heroBases = ['beauty_hero', 'fashion_hero', 'furniture_hero', 'crafts_hero'] as const
const heroImageMap = reactive<Record<string, string>>({})
const HERO_EXTS = ['webp', 'jpg', 'jpeg', 'png']

const tryLoadHeroImage = (baseName: string) => {
  const tryNext = (extIndex: number) => {
    if (extIndex >= HERO_EXTS.length) {
      heroImageMap[baseName] = `/images/${baseName}.jpg`
      return
    }
    const ext = HERO_EXTS[extIndex]
    const img = new Image()
    img.onload = () => {
      heroImageMap[baseName] = `/images/${baseName}.${ext}`
    }
    img.onerror = () => { tryNext(extIndex + 1) }
    img.src = `/images/${baseName}.${ext}`
  }
  tryNext(0)
}
</script>

<template>
  <div class="min-h-screen bg-bg">
    <header class="sticky top-0 md:top-16 z-40 bg-bg/80 backdrop-blur-xl border-b border-gray-100">
      <div class="px-4 h-16 flex items-center gap-4 max-w-7xl mx-auto">
        <h1 class="text-xl font-black tracking-tighter md:hidden">PORTFOLIO<span class="text-primary">.</span></h1>
        <div class="flex-1 relative max-w-xl mx-auto">
          <input v-model="searchQuery" @change="handleTabOrSearchChange" type="text" placeholder="搜索作品、商品..." class="w-full bg-white border border-gray-200 rounded-full px-6 py-2.5 text-base font-light outline-none focus:border-primary transition-all" />
          <span class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
        </div>
      </div>
      <div class="flex overflow-x-auto hide-scrollbar px-4 pb-4 gap-3 max-w-7xl mx-auto">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab; handleTabOrSearchChange()" class="px-6 py-2 text-sm font-medium tracking-wider rounded-full whitespace-nowrap transition-all border" :class="activeTab === tab ? 'bg-text text-white border-text' : 'bg-white text-text-light border-gray-200 hover:border-primary hover:text-primary'">{{ tab }}</button>
      </div>
    </header>

    <div v-if="activeTab === '推荐' && !searchQuery.trim()" class="max-w-7xl mx-auto px-4 md:px-12 mt-6">
      <div class="group relative w-full aspect-[21/9] md:aspect-[213/100] rounded-2xl overflow-hidden border border-gray-200 bg-white" @mouseenter="stopBannerTimer" @mouseleave="startBannerTimer" @touchstart="stopBannerTimer" @touchend="startBannerTimer">
        <div ref="bannerScrollRef" @scroll="onBannerScroll" class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar h-full">
          <div v-for="(banner, idx) in loopBanners" :key="idx" class="w-full h-full shrink-0 snap-center relative cursor-pointer" @click="goDetail(banner.linkId)">
            <img :src="banner.img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent hidden md:block"></div>
            <div class="absolute bottom-8 left-8 text-white hidden md:block">
              <div class="text-base font-light opacity-90 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full inline-block border border-white/30">Explore More →</div>
            </div>
          </div>
        </div>
        <button v-if="realBanners.length > 1" @click.stop="switchBanner(-1)" class="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-lg text-text text-xl transition-all duration-300 opacity-0 group-hover:opacity-100 z-10">‹</button>
        <button v-if="realBanners.length > 1" @click.stop="switchBanner(1)" class="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center shadow-lg text-text text-xl transition-all duration-300 opacity-0 group-hover:opacity-100 z-10">›</button>
        <div v-if="realBanners.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
          <div v-for="(_, idx) in realBanners" :key="idx" class="h-1 rounded-full transition-all duration-300" :class="currentBanner === idx ? 'bg-accent w-8' : 'bg-white/50 w-2'"></div>
        </div>
      </div>
    </div>

    <!-- 多类目展示 -->
    <section v-if="activeTab === '综合' && !searchQuery.trim()" class="max-w-7xl mx-auto px-4 md:px-12 mt-6">
      <div class="mb-5">
        <h2 class="text-lg font-medium text-text tracking-wide">多类目展示</h2>
      </div>
      <div class="flex flex-col gap-4 md:gap-6">
        <router-link to="/beauty" class="group relative w-full aspect-[16/7] md:aspect-[21/7] rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer">
          <img :src="heroImageMap['beauty_hero'] || '/images/beauty_hero.webp'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-5 md:p-8">
            <span class="text-white/50 text-xs font-light tracking-[0.2em] uppercase">Beauty</span>
            <h3 class="text-white text-2xl md:text-4xl font-medium tracking-wide mt-1">美妆</h3>
          </div>
          <div class="absolute bottom-5 md:bottom-8 right-5 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <span class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-sm px-5 py-2 rounded-full border border-white/20">进入<span class="text-xs">›</span></span>
          </div>
        </router-link>
        <router-link to="/fashion" class="group relative w-full aspect-[16/7] md:aspect-[21/7] rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer">
          <img :src="heroImageMap['fashion_hero'] || '/images/fashion_hero.webp'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-5 md:p-8">
            <span class="text-white/50 text-xs font-light tracking-[0.2em] uppercase">Fashion</span>
            <h3 class="text-white text-2xl md:text-4xl font-medium tracking-wide mt-1">时装</h3>
          </div>
          <div class="absolute bottom-5 md:bottom-8 right-5 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <span class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-sm px-5 py-2 rounded-full border border-white/20">进入<span class="text-xs">›</span></span>
          </div>
        </router-link>
        <router-link to="/furniture" class="group relative w-full aspect-[16/7] md:aspect-[21/7] rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer">
          <img :src="heroImageMap['furniture_hero'] || '/images/furniture_hero.webp'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-5 md:p-8">
            <span class="text-white/50 text-xs font-light tracking-[0.2em] uppercase">Furniture</span>
            <h3 class="text-white text-2xl md:text-4xl font-medium tracking-wide mt-1">家居</h3>
          </div>
          <div class="absolute bottom-5 md:bottom-8 right-5 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <span class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-sm px-5 py-2 rounded-full border border-white/20">进入<span class="text-xs">›</span></span>
          </div>
        </router-link>
        <router-link to="/crafts" class="group relative w-full aspect-[16/7] md:aspect-[21/7] rounded-2xl overflow-hidden border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer">
          <img :src="heroImageMap['crafts_hero'] || '/images/crafts_hero.webp'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-5 md:p-8">
            <span class="text-white/50 text-xs font-light tracking-[0.2em] uppercase">Crafts</span>
            <h3 class="text-white text-2xl md:text-4xl font-medium tracking-wide mt-1">工艺品</h3>
          </div>
          <div class="absolute bottom-5 md:bottom-8 right-5 md:right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
            <span class="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-sm px-5 py-2 rounded-full border border-white/20">进入<span class="text-xs">›</span></span>
          </div>
        </router-link>
      </div>
    </section>

    <main v-if="!(activeTab === '综合' && !searchQuery.trim())" class="p-2 md:px-12 columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-5 max-w-7xl mx-auto mt-4 md:mt-10">
      <div
        v-for="(item, index) in filteredItems" :key="`${item.id}-${index}`"
        @click="goDetail(item.id)"
        v-reveal
        :data-delay="(index % 4) * 50"
        class="reveal-item break-inside-avoid mb-2 md:mb-5 group relative rounded-2xl overflow-hidden bg-card border border-gray-100 hover:border-primary hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
      >
        <div v-if="item.type !== 'recommend'" class="w-full overflow-hidden">
          <img :src="item.cover" loading="lazy" decoding="async" class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div v-else class="aspect-[16/9] w-full overflow-hidden flex items-center justify-center p-4 bg-primary/5">
           <h3 class="text-xl font-black tracking-tight text-text text-center">{{ item.title }}</h3>
        </div>
        <div class="p-4">
          <h3 class="text-base font-light text-text mb-3 line-clamp-2 min-h-[48px] leading-relaxed">{{ item.title }}</h3>
          <div v-if="item.type !== 'recommend'" class="flex items-baseline justify-between border-t border-gray-50 pt-3">
            <div class="flex items-baseline gap-2">
              <span class="text-primary font-bold text-lg tracking-tight">¥{{ item.price }}</span>
              <span class="text-xs text-gray-300 line-through font-light">¥{{ item.originPrice }}</span>
            </div>
            <span class="text-xs text-gray-300 font-light">👁 {{ Math.floor(Math.random() * 9000 + 1000) }}</span>
          </div>
        </div>
      </div>
      <div v-if="filteredItems.length === 0 && !isLoading" class="col-span-full text-center py-20 text-gray-400 font-light tracking-widest text-base">
        {{ searchQuery.trim() ? '暂未收录该商品，感谢支持' : '' }}
      </div>
    </main>

    <div v-if="isLoading && activeTab === '推荐' && !searchQuery.trim()" class="flex justify-center items-center py-10 gap-3 text-text-light font-light tracking-widest text-sm">
      <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span>正在探索更多灵感...</span>
    </div>
  </div>
</template>