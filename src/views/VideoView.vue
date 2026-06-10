<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const videos = ref<any[]>([])
const videoRefs = ref<HTMLVideoElement[]>([])
let observer: IntersectionObserver | null = null

const setRef = (el: any, idx: number) => {
  if (el) videoRefs.value[idx] = el as HTMLVideoElement
}

const initObserver = () => {
  if (observer) observer.disconnect()
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
}

onMounted(async () => {
  try {
    const res = await fetch('/assets.json')
    const data = await res.json()
    
    // 过滤出所有视频类型的数据
    const videoData = data.filter((item: any) => item.type === 'video')
    
    videos.value = videoData.map(item => ({
      src: item.videoSrc,
      poster: item.cover || '', // 如果有封面就用，没有就为空（浏览器会显示首帧）
      title: item.title || 'Video Work',
      author: '@Fascinate', // 默认作者名
      isVertical: false // 默认横屏，如需竖屏可在 assets.json 中扩展字段
    }))

    // 等待 DOM 更新后初始化观察器
    await nextTick()
    initObserver()
  } catch (e) {
    console.error('Failed to load video data', e)
  }
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

     <!-- 2. 前景主视频 -->
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
       <p class="text-sm md:text-base opacity-90 drop-shadow-md leading-relaxed">
         {{ video.title }} 
         <span class="text-blue-400">#设计 #广告</span>
       </p>
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