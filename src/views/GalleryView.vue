<script setup lang="ts">
import { ref } from 'vue'

// 🎯 画廊数据：每行图片宽度一致，高度自适应
const galleryRows = ref([
  { 
    direction: 'left', 
    images: [
      { src: 'https://picsum.photos/seed/g1-1/400/300', alt: '作品1' },
      { src: 'https://picsum.photos/seed/g1-2/400/500', alt: '作品2' },
      { src: 'https://picsum.photos/seed/g1-3/400/350', alt: '作品3' },
      { src: 'https://picsum.photos/seed/g1-4/400/450', alt: '作品4' },
      { src: 'https://picsum.photos/seed/g1-5/400/400', alt: '作品5' },
    ] 
  },
  { 
    direction: 'right', 
    images: [
      { src: 'https://picsum.photos/seed/g2-1/400/350', alt: '作品6' },
      { src: 'https://picsum.photos/seed/g2-2/400/450', alt: '作品7' },
      { src: 'https://picsum.photos/seed/g2-3/400/300', alt: '作品8' },
      { src: 'https://picsum.photos/seed/g2-4/400/500', alt: '作品9' },
      { src: 'https://picsum.photos/seed/g2-5/400/400', alt: '作品10' },
    ] 
  },
  { 
    direction: 'left', 
    images: [
      { src: 'https://picsum.photos/seed/g3-1/400/400', alt: '作品11' },
      { src: 'https://picsum.photos/seed/g3-2/400/350', alt: '作品12' },
      { src: 'https://picsum.photos/seed/g3-3/400/450', alt: '作品13' },
      { src: 'https://picsum.photos/seed/g3-4/400/300', alt: '作品14' },
      { src: 'https://picsum.photos/seed/g3-5/400/500', alt: '作品15' },
    ] 
  },
  { 
    direction: 'right', 
    images: [
      { src: 'https://picsum.photos/seed/g4-1/400/450', alt: '作品16' },
      { src: 'https://picsum.photos/seed/g4-2/400/400', alt: '作品17' },
      { src: 'https://picsum.photos/seed/g4-3/400/350', alt: '作品18' },
      { src: 'https://picsum.photos/seed/g4-4/400/500', alt: '作品19' },
      { src: 'https://picsum.photos/seed/g4-5/400/300', alt: '作品20' },
    ] 
  },
])
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
        :style="{ animationDuration: `${20 + rIdx * 5}s` }"
      >
        <!-- 原始图片组（首尾相连） -->
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
/* 🎯 固定宽度的图片容器 */
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

/* 🎯 核心动画：向左平移 */
@keyframes scroll-left {
  0% { 
    transform: translateX(0); 
  }
  100% { 
    transform: translateX(-50%); 
  }
}

/* 🎯 核心动画：向右平移 */
@keyframes scroll-right {
  0% { 
    transform: translateX(-50%); 
  }
  100% { 
    transform: translateX(0); 
  }
}

/* 🎯 应用动画类 */
.animate-scroll-left {
  animation: scroll-left linear infinite;
}

.animate-scroll-right {
  animation: scroll-right linear infinite;
}
</style>