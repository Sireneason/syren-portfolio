import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'

// 项目部署在 /my 子路径下，根域名展示占位页
export default defineConfig({
  base: '/my/',
  build: { outDir: 'dist/my' },
  plugins: [
    vue(),
    tailwindcss(),
    {
      name: 'copy-root-files',
      closeBundle() {
        // 清理 dist 根目录的旧构建残留（保留 my/ 应用目录）
        // 本地环境可能有 safe-delete shim 拦截，失败不阻断构建
        try {
          for (const entry of readdirSync('dist')) {
            if (entry !== 'my') rmSync(`dist/${entry}`, { recursive: true, force: true })
          }
        } catch (e) {
          console.warn('[copy-root-files] 清理 dist 旧文件失败（可忽略）:', (e as Error).message)
        }
        // 部署根 = dist/：占位首页 + SPA 路由规则
        mkdirSync('dist', { recursive: true })
        copyFileSync('placeholder.html', 'dist/index.html')
        copyFileSync('_redirects', 'dist/_redirects')
      },
    },
  ],
  server: { host: true } // 允许手机扫码访问
})
