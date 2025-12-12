import { createRouter, createWebHistory } from 'vue-router'
// 1. Ganti HomeView dengan HomePage dan arahkan ke path yang benar
import HomePage from '../components/pages/HomePage.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 2. Gunakan HomePage sebagai komponen untuk rute utama ('/')
      component: HomePage, 
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router