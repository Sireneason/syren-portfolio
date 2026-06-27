import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
    { path: '/detail/:id', name: 'Detail', component: () => import('../views/DetailView.vue') },
    { path: '/video', name: 'Video', component: () => import('../views/VideoView.vue') },
    { path: '/gallery', name: 'Gallery', component: () => import('../views/GalleryView.vue') }, // 🎯 新增画廊页
    { path: '/cart', name: 'Cart', component: () => import('../views/CartView.vue') },
    { path: '/about', name: 'About', component: () => import('../views/AboutView.vue') },
    // Fascinate 子页面
    { path: '/beauty', name: 'Beauty', component: () => import('../views/BeautyView.vue') },
    { path: '/fashion', name: 'Fashion', component: () => import('../views/FashionView.vue') },
    { path: '/furniture', name: 'Furniture', component: () => import('../views/FurnitureView.vue') },
    { path: '/crafts', name: 'Crafts', component: () => import('../views/CraftsView.vue') },
  ],
  scrollBehavior() { return { top: 0 } }
})
export default router