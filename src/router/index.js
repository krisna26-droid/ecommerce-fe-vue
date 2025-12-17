import { createRouter, createWebHistory } from 'vue-router'
// 1. Ganti HomeView dengan HomePage dan arahkan ke path yang benar
import HomePage from '../components/pages/HomePage.vue'
import WebLogin from '../components/auth/WebLogin.vue' 
import WebSignup from '../components/auth/WebSignup.vue'
import ProductPage from '../components/pages/ProductPage.vue'

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
    {
      path: '/login',
      name: 'login',
      component: WebLogin,
      meta: {layout: 'auth'},
    },
    {
      path: '/register',
      name: 'register',
      component: WebSignup,
      meta: {layout: 'auth'},
    },
    {
      path: '/products',
      name: 'product',
      component: ProductPage,
    },
  ],
})

export default router