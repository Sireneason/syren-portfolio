import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
    { path: '/detail/:id', name: 'Detail', component: () => import('../views/DetailView.vue') },
    { path: '/video', name: 'Video', component: () => import('../views/VideoView.vue') },
    { path: '/gallery', name: 'Gallery', component: () => import('../views/GalleryView.vue') }, // 🎯 新增画廊页
    { path: '/cart', name: 'Cart', component: () => import('../views/CartView.vue') },
    { path: '/about', name: 'About', component: () => import('../views/AboutView.vue') }
  ],
  scrollBehavior() { return { top: 0 } }
})
export default router