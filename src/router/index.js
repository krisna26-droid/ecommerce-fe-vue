import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

// Import komponen Anda (Tetap seperti sebelumnya)
import HomePage from '../components/pages/HomePage.vue'
import WebLogin from '../components/auth/WebLogin.vue' 
import WebSignup from '../components/auth/WebSignup.vue'
import ProductPage from '../components/pages/ProductPage.vue'
import ProductDetailPage from '../components/pages/ProductDetailPage.vue'
import CartPage from '../components/pages/CartPage.vue'
import WishlistPage from '../components/pages/WishlistPage.vue'
import SeederTool from '../components/admin/SeederTool.vue'
import CheckoutPage from '../components/pages/CheckoutPage.vue'
import OrderConfirmationPage from '../components/pages/OrderConfirmationPage.vue'
import SettingsLayout from '../components/pages/settings/SettingsLayout.vue'
import ProfileDetails from '../components/pages/settings/ProfileDetails.vue'
import ChangePassword from '../components/pages/settings/ChangePassword.vue'
import TransactionHistory from '../components/pages/settings/TransactionHistory.vue'

const routes = [
  { path: '/seeder', name: 'seeder', component: SeederTool },
  { path: '/', name: 'home', component: HomePage },
  { 
    path: '/login', 
    name: 'login', 
    component: WebLogin, 
    meta: { guestOnly: true } 
  },
  { 
    path: '/register', 
    name: 'register', 
    component: WebSignup, 
    meta: { guestOnly: true } 
  },
  { path: '/products', name: 'product', component: ProductPage },
  { path: '/products/:id', name: 'product-detail', component: ProductDetailPage },
  { path: '/cart', name: 'cart', component: CartPage, meta: { requiresAuth: true } },
  { path: '/wishlist', name: 'wishlist', component: WishlistPage, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'checkout', component: CheckoutPage, meta: { requiresAuth: true } },
  { path: '/checkout/confirm', name: 'order-confirmation', component: OrderConfirmationPage, meta: { requiresAuth: true } },
  {
    path: '/settings',
    component: SettingsLayout,
    redirect: '/settings/profile',
    meta: { requiresAuth: true },
    children: [
      { path: 'profile', name: 'profile-details', component: ProfileDetails },
      { path: 'password', name: 'change-password', component: ChangePassword },
      { path: 'history', name: 'transaction-history', component: TransactionHistory },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() { return { top: 0 } }
})

// --- PERBAIKAN LOGIKA AUTH ---
// Fungsi untuk menunggu status Firebase selesai dimuat
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  const user = await getCurrentUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  if (requiresAuth && !user) {
    next('/login');
  } else if (guestOnly && user) {
    next('/');
  } else {
    next();
  }
});

export default router