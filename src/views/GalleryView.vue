<script setup lang="ts">
import { ref, onMounted } from 'vue'

const galleryRows = ref<any[]>([])

onMounted(async () => {
  try {
    const res = await fetch('/assets.json')
    const data = await res.json()
    const galleryData = data.find((item: any) => item.type === 'gallery')
    
    if (galleryData && galleryData.mainMedia && galleryData.mainMedia.length > 0) {
      const allImages = galleryData.mainMedia
      
      // 🎯 优化：根据图片数量动态决定行数（3-4行），避免单行过长
      const totalImages = allImages.length
      const numRows = totalImages > 20 ? 4 : 3 
      const groupSize = Math.ceil(totalImages / numRows)
      
      const rows = []
      for (let i = 0; i < numRows; i++) {
        const start = i * groupSize
        const end = start + groupSize
        const group = allImages.slice(start, end)
        
        if (group.length > 0) {
          rows.push({
            direction: i % 2 === 0 ? 'left' : 'right', // 交替方向
            images: group.map(src => ({ src, alt: 'Gallery Work' }))
          })
        }
      }
      galleryRows.value = rows
    }
  } catch (e) {
    console.error('Failed to load gallery data', e)
  }
})
</script>

<template>
 <div class="min-h-screen bg-bg py-20 overflow-hidden">
   <div class="text-center mb-20">
     <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-text mb-4">Visual Gallery</h1>
     <p class="text-text-light font-light tracking-wide">画廊</p>
   </div>
   
   <!-- 🎯 斜向胶片滚动容器 -->
   <div class="flex flex-col gap-12 md:gap-16 w-full max-w-[140vw] mx-auto -rotate-[10deg] md:-rotate-[12deg]">
     <div 
      v-for="(row, rIdx) in galleryRows" 
      :key="rIdx"
      :class="`flex gap-4 md:gap-6 animate-scroll-${row.direction}`"
      :style="{ animationDuration: `${25 + rIdx * 8}s` }" 
     >
       <!-- 原始图片组 -->
       <div 
        v-for="(img, iIdx) in row.images" 
        :key="`orig-${iIdx}`"
        class="gallery-item"
       >
         <img 
          :src="img.src" 
          :alt="img.alt"
          loading="lazy"
          class="w-full h-auto object-cover rounded-lg shadow-lg"
        />
       </div>
      
       <!-- 复制一份用于无缝循环 -->
       <div 
        v-for="(img, iIdx) in row.images" 
        :key="`clone-${iIdx}`"
        class="gallery-item"
       >
         <img 
          :src="img.src" 
          :alt="img.alt"
          loading="lazy"
          class="w-full h-auto object-cover rounded-lg shadow-lg"
        />
       </div>
     </div>
   </div>
 </div>
</template>

<style scoped>
.gallery-item {
  flex-shrink: 0;
  width: 350px;
  transform: rotate(10deg);
  transition: transform 0.3s;
}

@media (min-width: 768px) {
  .gallery-item {
    width: 350px;
    transform: rotate(12deg);
  }
}

.gallery-item:hover {
  transform: rotate(10deg) scale(1.05);
}

@media (min-width: 768px) {
  .gallery-item:hover {
    transform: rotate(12deg) scale(1.05);
  }
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes scroll-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.animate-scroll-left {
  animation: scroll-left linear infinite;
}

.animate-scroll-right {
  animation: scroll-right linear infinite;
}
</style>