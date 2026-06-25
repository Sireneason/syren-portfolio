<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const galleryRows = ref<any[]>([])
const isMobile = ref(false)

// 大图弹窗状态
const lightboxImg = ref<string | null>(null)
const lightboxVisible = ref(false)

// 手机端：标记上次触摸是否发生了移动，防止滑动后误触打开大图
const touchMoved = ref(false)

const states = ref<Array<{
  pos: number
  speed: number
  autoSpeed: number
  touching: boolean
  lastX: number
  lastY: number
  lastTime: number
  vel: number
  raf: number | null
}>>([])

const rowRefs = ref<(HTMLElement | null)[]>([])

const setRef = (el: any, idx: number) => {
  if (el) rowRefs.value[idx] = el as HTMLElement
}

// 打开大图弹窗
const openLightbox = (src: string) => {
  // 手机端：如果上次触摸发生了移动，说明是滑动不是点击，忽略此次打开
  if (touchMoved.value) {
    touchMoved.value = false
    return
  }
  lightboxImg.value = src
  // 下一帧再触发入场动画，确保 DOM 已渲染
  requestAnimationFrame(() => {
    lightboxVisible.value = true
  })
}

// 关闭大图弹窗
const closeLightbox = () => {
  lightboxVisible.value = false
  // 等待退场动画结束再清除图片
  setTimeout(() => {
    lightboxImg.value = null
  }, 350)
}

onMounted(async () => {
  isMobile.value = window.innerWidth < 768

  try {
    const res = await fetch('/assets.json')
    const data = await res.json()
    const galleryData = data.find((item: any) => item.type === 'gallery')

    if (galleryData && galleryData.mainMedia && galleryData.mainMedia.length > 0) {
      const allImages = galleryData.mainMedia
      const totalImages = allImages.length
      const numRows = totalImages > 20 ? 4 : 3
      const groupSize = Math.ceil(totalImages / numRows)

      const rows = []
      for (let i = 0; i < numRows; i++) {
        const group = allImages.slice(i * groupSize, (i + 1) * groupSize)
        if (group.length > 0) {
          rows.push({
            direction: i % 2 === 0 ? 'left' : 'right',
            images: group.map(src => ({ src, alt: 'Gallery Work' }))
          })
        }
      }
      galleryRows.value = rows

      // 初始化每行状态
      states.value = rows.map(row => ({
        pos: 0,
        speed: row.direction === 'left' ? -0.35 : 0.35,
        autoSpeed: row.direction === 'left' ? -0.35 : 0.35,
        touching: false,
        lastX: 0,
        lastY: 0,
        lastTime: 0,
        vel: 0,
        raf: null
      }))

      if (isMobile.value) {
        await nextTick()
        startMobile()
      }
    }
  } catch (e) {
    console.error('Failed to load gallery data', e)
  }
})

const startMobile = () => {
  states.value.forEach((st, idx) => {
    const el = rowRefs.value[idx]
    if (!el) return

    const half = el.scrollWidth / 2
    // 减慢速度：duration 从 25+idx*8 改为 50+idx*16（约减半）
    const duration = 50 + idx * 16
    const speedPxPerFrame = half / duration / 60

    st.autoSpeed = st.speed < 0 ? -speedPxPerFrame : speedPxPerFrame
    st.speed = st.autoSpeed
    st.pos = st.speed < 0 ? 0 : -half

    const loop = () => {
      if (!st.touching) {
        st.pos += st.speed
        el!.style.transform = `translateX(${st.pos}px)`

        // 无缝循环重置
        const h = el!.scrollWidth / 2
        if (st.speed < 0 && st.pos <= -h) {
          st.pos += h
        } else if (st.speed > 0 && st.pos >= 0) {
          st.pos -= h
        }
      }
      st.raf = requestAnimationFrame(loop)
    }
    st.raf = requestAnimationFrame(loop)
  })
}

const onTouchStart = (e: TouchEvent, idx: number) => {
  if (!isMobile.value) return
  touchMoved.value = false
  const st = states.value[idx]
  st.touching = true
  st.lastX = e.touches[0].clientX
  st.lastY = e.touches[0].clientY
  st.lastTime = Date.now()
}

const onTouchMove = (e: TouchEvent, idx: number) => {
  if (!isMobile.value) return
  const st = states.value[idx]
  const x = e.touches[0].clientX
  const y = e.touches[0].clientY
  const dx = x - st.lastX

  st.pos += dx

  // 标记发生了移动，防止松手后误触打开大图
  if (Math.abs(dx) > 3) {
    touchMoved.value = true
  }

  // 计算滑动速度（px/ms），用于松手后的惯性
  const now = Date.now()
  const dt = now - st.lastTime
  if (dt > 0) st.vel = dx / dt

  st.lastX = x
  st.lastY = y
  st.lastTime = now

  // 立即应用位移
  const el = rowRefs.value[idx]
  if (el) el.style.transform = `translateX(${st.pos}px)`
}

const onTouchEnd = (idx: number) => {
  if (!isMobile.value) return
  const st = states.value[idx]
  st.touching = false

  // 松手时根据滑动速度设置当前速度
  const vFrame = st.vel * 17
  st.speed = vFrame * 0.4 + st.autoSpeed * 0.6

  // 速度逐渐衰减回自动慢速
  const decelerate = () => {
    if (st.touching) return
    st.speed = st.speed * 0.93 + st.autoSpeed * 0.07
    if (Math.abs(st.speed - st.autoSpeed) < 0.05) {
      st.speed = st.autoSpeed
      return
    }
    requestAnimationFrame(decelerate)
  }
  requestAnimationFrame(decelerate)
}

onBeforeUnmount(() => {
  states.value.forEach(st => {
    if (st.raf) cancelAnimationFrame(st.raf)
  })
})
</script>

<template>
  <div class="min-h-screen bg-bg py-20 overflow-hidden relative">
    <div class="text-center mb-20">
      <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-text mb-4">Visual Gallery</h1>
      <p class="text-text-light font-light tracking-wide">画廊</p>
    </div>

    <!-- 外层容器：桌面端旋转角度更大，手机端减小旋转角度以利用屏幕宽度 -->
    <div
      :class="[
        'flex', 'flex-col', 'gap-12', 'md:gap-16',
        'w-full', 'max-w-[140vw]', 'mx-auto',
        isMobile ? '-rotate-[5deg]' : '-rotate-[10deg] md:-rotate-[12deg]'
      ]"
    >
      <div
        v-for="(row, rIdx) in galleryRows"
        :key="rIdx"
        :ref="(el: any) => setRef(el, rIdx)"
        :class="[
          'flex', 'gap-4', 'md:gap-6',
          !isMobile
            ? `animate-scroll-${row.direction}`
            : 'will-change-transform'
        ]"
        :style="
          !isMobile
            ? { animationDuration: `${30 + rIdx * 10}s` }
            : { touchAction: 'pan-y' }
        "
        @touchstart="onTouchStart($event, rIdx)"
        @touchmove="onTouchMove($event, rIdx)"
        @touchend="onTouchEnd(rIdx)"
      >
        <!-- 原始图片组 -->
        <div
          v-for="(img, iIdx) in row.images"
          :key="`orig-${iIdx}`"
          class="gallery-item"
          @click="openLightbox(img.src)"
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
          @click="openLightbox(img.src)"
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

    <!-- ===== 大图弹窗 ===== -->
    <Teleport to="body">
      <div
        v-if="lightboxImg"
        class="lightbox-overlay"
        :class="{ 'lightbox-visible': lightboxVisible }"
        @click="closeLightbox"
      >
        <!-- 光晕背景层 -->
        <div class="lightbox-glow"></div>

        <!-- 图片容器 -->
        <div
          class="lightbox-img-wrap"
          :class="{ 'lightbox-img-in': lightboxVisible }"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button class="lightbox-close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <img
            :src="lightboxImg"
            alt="Gallery Work"
            class="lightbox-img"
            @click="closeLightbox"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-item {
  flex-shrink: 0;
  width: 350px;
  transform: rotate(10deg);
  transition: transform 0.3s;
  cursor: pointer;
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

/* 桌面端：CSS 动画（速度同步减慢） */
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

/* PC 端：鼠标悬停时暂停滚动，方便点击查看大图 */
@media (hover: hover) {
  .animate-scroll-left:hover,
  .animate-scroll-right:hover {
    animation-play-state: paused;
  }
}
</style>

<!-- 大图弹窗样式（非 scoped，因为内容 teleport 到 body） -->
<style>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: zoom-out;
}

.lightbox-overlay.lightbox-visible {
  opacity: 1;
}

.lightbox-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(168, 85, 247, 0.12) 0%,
    rgba(59, 130, 246, 0.08) 40%,
    transparent 70%
  );
  pointer-events: none;
  animation: lightbox-glow-pulse 4s ease-in-out infinite alternate;
}

.lightbox-img-wrap {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  opacity: 0;
  transform: scale(0.85);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox-img-wrap.lightbox-img-in {
  opacity: 1;
  transform: scale(1);
}

.lightbox-img {
  display: block;
  max-width: 90vw;
  max-height: 85vh;
  width: auto;
  height: auto;
  border-radius: 12px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 60px rgba(168, 85, 247, 0.15),
    0 0 120px rgba(59, 130, 246, 0.1),
    0 25px 50px rgba(0, 0, 0, 0.5);
  object-fit: contain;
  cursor: zoom-out;
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox-close {
  position: absolute;
  top: -44px;
  right: -8px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  transform: rotate(90deg);
}

@keyframes lightbox-glow-pulse {
  0% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
