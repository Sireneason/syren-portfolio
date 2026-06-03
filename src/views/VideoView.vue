<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 🎯 视频数据：包含横屏和竖屏（通过 isVertical 标记，竖屏使用 CSS 裁剪模拟）
const videos = [
  { 
    src: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4', 
    poster: 'https://picsum.photos/seed/vid1/1920/1080', 
    title: '横屏沉浸体验：海浪与微风', 
    author: '@Alex_Designer', 
    isVertical: false 
  },
  { 
    src: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4', 
    poster: 'https://picsum.photos/seed/vid2/1080/1920', 
    title: '竖屏沉浸体验：春日漫步 (模拟9:16)', 
    author: '@Alex_Designer', 
    isVertical: true 
  },
  { 
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-the-beach-702-large.mp4', 
    poster: 'https://picsum.photos/seed/vid3/1920/1080', 
    title: '横屏沉浸体验：奔跑的自由', 
    author: '@Alex_Designer', 
    isVertical: false 
  },
]

const videoRefs = ref<HTMLVideoElement[]>([])
let observer: IntersectionObserver | null = null

const setRef = (el: any, idx: number) => {
  if (el) videoRefs.value[idx] = el as HTMLVideoElement
}

onMounted(() => {
  // 监听视频是否进入屏幕中心，自动播放/暂停
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target as HTMLVideoElement
      if (entry.isIntersecting) {
        video.play().catch(() => {}) // 忽略自动播放被浏览器拦截的报错
      } else {
        video.pause()
      }
    })
  }, { threshold: 0.6 }) 

  videoRefs.value.forEach(v => { if (v) observer!.observe(v) })
})

onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<template>
  <div class="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
    <div
      v-for="(video, idx) in videos"
      :key="idx"
      class="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
    >
      <!-- 1. 模糊背景层 (铺满整个屏幕) -->
      <video
        :src="video.src"
        :poster="video.poster"
        muted loop playsinline
        class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
      ></video>
      
      <!-- 暗色遮罩 -->
      <div class="absolute inset-0 bg-black/20 z-[1]"></div>

      <!-- 2. 前景主视频 (核心：根据横竖屏应用不同的 CSS 策略) -->
      <video
        :ref="(el) => setRef(el, idx)"
        :src="video.src"
        :poster="video.poster"
        controls autoplay muted loop playsinline
        class="relative z-10 shadow-2xl rounded-lg"
        :class="video.isVertical ? 'h-full aspect-[9/16] w-auto object-cover' : 'w-full h-auto max-h-[90vh] object-contain'"
      ></video>

      <!-- 3. 左侧文案信息 -->
      <div class="absolute bottom-24 left-6 md:left-12 z-20 text-white max-w-md">
        <h2 class="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">{{ video.author }}</h2>
        <p class="text-sm md:text-base opacity-90 drop-shadow-md leading-relaxed">{{ video.title }} <span class="text-blue-400">#设计 #交互 #沉浸式</span></p>
      </div>

      <!-- 4. 右侧互动栏 -->
      <div class="absolute right-4 md:right-12 bottom-24 z-20 flex flex-col gap-6 items-center">
        <button class="flex flex-col items-center text-white drop-shadow-lg hover:scale-110 transition-transform active:scale-90">
          <span class="text-3xl mb-1">♥</span>
          <span class="text-xs">1.2w</span>
        </button>
        <button class="flex flex-col items-center text-white drop-shadow-lg hover:scale-110 transition-transform active:scale-90">
          <span class="text-3xl mb-1">💬</span>
          <span class="text-xs">856</span>
        </button>
        <button class="flex flex-col items-center text-white drop-shadow-lg hover:scale-110 transition-transform active:scale-90">
          <span class="text-3xl mb-1">↗</span>
          <span class="text-xs">分享</span>
        </button>
      </div>
      
      <!-- 底部渐变遮罩 -->
      <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent z-[5] pointer-events-none"></div>
    </div>
  </div>
</template>