<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '../store/cart'

const route = useRoute()
const router = useRouter()
const { addItem } = useCart()

const item = ref<any>(null)
const showToTop = ref(false)
const showSku = ref(false)
const showPayment = ref(false)
const actionType = ref<'cart' | 'buy'>('cart')

const selectedColor = ref('经典黑')
const selectedSize = ref('M')
const buyQuantity = ref(1)

const mainImages = ref<string[]>([])
const mainScrollRef = ref<HTMLElement | null>(null)
const currentMainImage = ref(0)

const onMainScroll = () => {
  if (!mainScrollRef.value) return
  const width = mainScrollRef.value.clientWidth
  currentMainImage.value = Math.round(mainScrollRef.value.scrollLeft / width)
}

const switchMainImage = (directionOrIndex: number) => {
  if (!mainScrollRef.value) return
  let targetIndex = currentMainImage.value + directionOrIndex
  if (Math.abs(directionOrIndex) > 1 || directionOrIndex === 0) targetIndex = directionOrIndex
  if (targetIndex < 0) targetIndex = mainImages.value.length - 1
  if (targetIndex >= mainImages.value.length) targetIndex = 0
  mainScrollRef.value.scrollTo({ left: targetIndex * mainScrollRef.value.clientWidth, behavior: 'smooth' })
}

onMounted(async () => {
  const res = await fetch('/assets.json')
  const list = await res.json()
  item.value = list.find((i: any) => i.id === route.params.id)
  if (item.value) {
    if (item.value.mainMedia && item.value.mainMedia.length > 0) mainImages.value = item.value.mainMedia
    else mainImages.value = [item.value.cover, ...item.value.detailMedia.slice(0, 3)]
    mainImages.value = [...new Set(mainImages.value)]
  }
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const handleScroll = () => {
  const y = window.scrollY
  showToTop.value = y > window.innerHeight * 0.4
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => { showToTop.value = false }, 300)
}

const openSku = (type: 'cart' | 'buy') => { actionType.value = type; showSku.value = true }

const confirmAction = () => {
  const skuText = `${selectedColor.value} / ${selectedSize.value}`
  if (actionType.value === 'cart') {
    for(let i=0; i<buyQuantity.value; i++) addItem({ id: item.value.id, title: item.value.title, cover: item.value.cover, price: parseFloat(item.value.price || 99), sku: skuText })
    showSku.value = false
    showToast('✅ 已成功加入购物车')
  } else {
    showSku.value = false
    showPayment.value = true
  }
}

const toastMsg = ref('')
const showToast = (msg: string) => { toastMsg.value = msg; setTimeout(() => { toastMsg.value = '' }, 2000) }
</script>

<template>
  <div v-if="item" class="min-h-screen bg-bg pb-24 md:pb-20">
    <div v-if="toastMsg" class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-text text-white text-sm font-medium tracking-widest px-8 py-3 rounded-full shadow-xl animate-fade-in">
      {{ toastMsg }}
    </div>

    <!-- 🎯 修复 1：移除 v-show，PC端常驻。修复 2：蓝色描边 (border-primary text-primary) -->
    <button @click="router.back()" class="fixed top-6 md:top-24 left-6 z-50 w-10 h-10 bg-white/90 backdrop-blur-md border-2 border-primary text-primary rounded-full flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all">←</button>
    
    <!--  修复 2：回到顶部按钮同样改为蓝色描边 -->
    <button v-show="showToTop" @click="scrollToTop" class="fixed bottom-28 md:bottom-24 right-6 z-50 w-10 h-10 bg-white/90 backdrop-blur-md border-2 border-primary text-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all">↑</button>

    <!-- 主图轮播区 -->
    <div class="w-full bg-white md:bg-gray-50 relative group border-b border-gray-100 md:h-[calc(100vh-144px)] flex md:items-center md:justify-center overflow-hidden">
      <video v-if="item.type === 'video'" :src="item.videoSrc" :poster="item.cover" controls autoplay muted playsinline class="w-full h-full object-cover md:w-auto md:h-full md:max-h-full"></video>
      <div v-else class="w-full h-full md:h-full md:w-full flex md:items-center md:justify-center">
        <div ref="mainScrollRef" @scroll="onMainScroll" class="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar h-full w-full">
          <div v-for="(img, idx) in mainImages" :key="idx" class="w-full h-full shrink-0 snap-center flex items-center justify-center">
            <img :src="img" class="w-full h-full object-cover md:object-contain" />
          </div>
        </div>
      </div>
      
      <div class="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-text text-sm font-medium px-4 py-2 rounded-full shadow-sm z-10 tracking-wider">
        {{ currentMainImage + 1 }} / {{ mainImages.length }}
      </div>

      <button @click.stop="switchMainImage(-1)" class="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center text-text text-xl transition-all opacity-0 group-hover:opacity-100 shadow-md z-10">‹</button>
      <button @click.stop="switchMainImage(1)" class="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full items-center justify-center text-text text-xl transition-all opacity-0 group-hover:opacity-100 shadow-md z-10">›</button>

      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-10">
        <button v-for="(_, idx) in mainImages" :key="idx" @click.stop="switchMainImage(idx)" class="h-1.5 rounded-full transition-all duration-300" :class="currentMainImage === idx ? 'bg-primary w-6' : 'bg-gray-300 w-1.5 hover:bg-gray-400'"></button>
      </div>
    </div>

    <!-- 商品信息区 -->
    <div class="p-6 md:p-12 space-y-6 max-w-3xl mx-auto">
      <div class="flex items-baseline gap-3">
        <span class="text-4xl text-primary font-black tracking-tight">¥{{ item.price || '99' }}</span>
        <span class="text-base text-gray-300 line-through font-light">¥{{ item.originPrice || '299' }}</span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-text">{{ item.title }}</h1>
      <div class="text-sm text-text-light font-light bg-white border border-gray-100 p-5 rounded-xl tracking-wide">
        规格: {{ selectedColor }} / {{ selectedSize }} &nbsp;|&nbsp; 快递: 免运费 &nbsp;|&nbsp; 7天无理由退换
      </div>
      
      <div class="flex flex-col gap-0 mt-6 border-t border-gray-100 pt-6">
        <h2 class="text-sm font-bold text-text-light tracking-[0.2em] mb-4 flex items-center gap-2">
          <span class="w-1.5 h-5 bg-accent rounded-full"></span> 商品详情
        </h2>
        <div v-for="(img, idx) in item.detailMedia" :key="idx" class="w-full">
          <img :src="img" loading="lazy" class="w-full h-auto block" />
        </div>
        <div v-if="!item.detailMedia || item.detailMedia.length === 0" class="text-center text-gray-300 py-10 text-base tracking-widest">暂无更多详情图片</div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-2xl border-t border-white/60 px-6 h-16 md:h-20 flex items-center z-40 pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
      <div class="max-w-3xl mx-auto w-full flex items-center gap-6">
        <router-link to="/cart" class="flex flex-col items-center text-xs text-text-light font-light tracking-wider w-14 hover:text-primary transition-colors">
          <span class="text-2xl mb-1"></span>购物车
        </router-link>
        <button @click="openSku('cart')" class="flex-1 bg-white border-2 border-text text-text py-3.5 md:py-4 rounded-full text-base font-bold tracking-wider hover:bg-text hover:text-white transition-all">加入购物车</button>
        <button @click="openSku('buy')" class="flex-1 bg-primary text-white py-3.5 md:py-4 rounded-full text-base font-bold tracking-wider hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">立即购买</button>
      </div>
    </div>

    <!-- SKU 弹窗 -->
    <div v-if="showSku" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end" @click.self="showSku = false">
      <div class="bg-white w-full rounded-t-3xl p-6 md:p-8 space-y-6 animate-slide-up max-w-3xl mx-auto mb-safe">
        <div class="flex gap-4">
          <img :src="item.cover" class="w-24 h-24 object-cover rounded-xl border border-gray-100" />
          <div class="flex-1">
            <div class="text-3xl text-primary font-black tracking-tight">¥{{ item.price || '99' }}</div>
            <div class="text-sm text-text-light mt-2 font-light tracking-wide">已选: {{ selectedColor }} / {{ selectedSize }} / 数量: {{ buyQuantity }}</div>
          </div>
          <button @click="showSku = false" class="text-gray-300 hover:text-text text-2xl transition-colors">✕</button>
        </div>
        <div>
          <div class="text-xs font-bold text-text-light tracking-[0.2em] mb-3">颜色</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="c in ['经典黑', '珍珠白', '远峰蓝']" :key="c" @click="selectedColor = c" class="px-5 py-2.5 text-sm rounded-full border transition-all" :class="selectedColor === c ? 'border-primary text-primary bg-primary/5 font-medium' : 'border-gray-200 text-text-light hover:border-gray-400'">{{ c }}</button>
          </div>
        </div>
        <div>
          <div class="text-xs font-bold text-text-light tracking-[0.2em] mb-3">尺码</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="s in ['S', 'M', 'L', 'XL']" :key="s" @click="selectedSize = s" class="px-5 py-2.5 text-sm rounded-full border transition-all" :class="selectedSize === s ? 'border-primary text-primary bg-primary/5 font-medium' : 'border-gray-200 text-text-light hover:border-gray-400'">{{ s }}</button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-text-light tracking-[0.2em]">数量</span>
          <div class="flex items-center border border-gray-200 rounded-full">
            <button @click="buyQuantity > 1 && buyQuantity--" class="w-9 h-9 text-text-light hover:bg-gray-50 rounded-l-full transition-colors">-</button>
            <span class="w-12 text-center text-base font-medium">{{ buyQuantity }}</span>
            <button @click="buyQuantity++" class="w-9 h-9 text-text-light hover:bg-gray-50 rounded-r-full transition-colors">+</button>
          </div>
        </div>
        <button @click="confirmAction" class="w-full bg-text text-white py-4 rounded-full font-bold tracking-widest text-base mt-4 hover:bg-text/90 transition-colors shadow-xl">确定</button>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <div v-if="showPayment" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showPayment = false">
      <div class="bg-white w-full max-w-sm rounded-3xl p-8 text-center space-y-4 shadow-2xl animate-slide-up">
        <div class="text-5xl">💳</div>
        <h3 class="text-2xl font-black tracking-tight">模拟收银台</h3>
        <p class="text-base text-text-light font-light">需支付: <span class="text-primary font-bold text-2xl">¥{{ (parseFloat(item.price || 99) * buyQuantity).toFixed(2) }}</span></p>
        <p class="text-xs text-gray-400 bg-gray-50 py-3 rounded-xl tracking-wider border border-gray-100">该示例商品不可付款，感谢您的支持！</p>
        <button @click="showPayment = false" class="w-full bg-text text-white py-3.5 rounded-full text-base font-bold tracking-widest hover:bg-text/90 transition-colors">我知道了</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
</style>