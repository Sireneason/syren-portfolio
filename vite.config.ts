import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// 应用部署在 /my 子路径，由 worker.js 做路由（根路径占位页 + /my/* 应用）
export default defineConfig({
  base: '/my/',
  build: { outDir: 'dist/my', emptyOutDir: false },
  plugins: [vue(), tailwindcss()],
  server: { host: true } // 允许手机扫码访问
})
