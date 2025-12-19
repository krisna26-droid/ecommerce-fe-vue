import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Import Halaman Utama
import HomePage from '../components/pages/HomePage.vue'
import WebLogin from '../components/auth/WebLogin.vue' 
import WebSignup from '../components/auth/WebSignup.vue'
import ProductPage from '../components/pages/ProductPage.vue'
import ProductDetailPage from '../components/pages/ProductDetailPage.vue'
import CartPage from '../components/pages/CartPage.vue'
import WishlistPage from '../components/pages/WishlistPage.vue'

// Import Halaman Konfirmasi Pesanan
import OrderConfirmationPage from '../components/pages/OrderConfirmationPage.vue'

// Import Komponen Settings
import SettingsLayout from '../components/pages/settings/SettingsLayout.vue'
import ProfileDetails from '../components/pages/settings/ProfileDetails.vue'
import ChangePassword from '../components/pages/settings/ChangePassword.vue'
import TransactionHistory from '../components/pages/settings/TransactionHistory.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage, 
  },
  {
    path: '/login',
    name: 'login',
    component: WebLogin,
    meta: { layout: 'auth', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: WebSignup,
    meta: { layout: 'auth', guestOnly: true },
  },
  {
    path: '/products',
    name: 'product',
    component: ProductPage,
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: ProductDetailPage,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true } // Hanya untuk user login
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: WishlistPage,
    meta: { requiresAuth: true }
  },
  {
    // Alur baru sebelum modal sukses
    path: '/checkout', 
    name: 'order-confirmation',
    component: OrderConfirmationPage,
    meta: { requiresAuth: true }
  },
  
  // Rute Settings dengan Sidebar Terintegrasi
  {
    path: '/settings',
    component: SettingsLayout,
    redirect: '/settings/profile',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'profile',
        name: 'profile-details',
        component: ProfileDetails,
      },
      {
        path: 'password',
        name: 'change-password',
        component: ChangePassword,
      },
      {
        // Rute yang disarankan pada modal sukses checkout
        path: 'history',
        name: 'transaction-history',
        component: TransactionHistory,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // Selalu scroll ke atas saat pindah halaman
    return { top: 0 }
  }
})

/**
 * Navigation Guard untuk Keamanan
 * Memastikan user tidak bisa mengakses Cart/Settings tanpa login
 */
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  
  onAuthStateChanged(auth, (user) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)

    if (requiresAuth && !user) {
      // Jika butuh login tapi belum login
      next('/login')
    } else if (guestOnly && user) {
      // Jika sudah login tapi mencoba ke halaman Login/Register
      next('/')
    } else {
      next()
    }
  })
})

export default router