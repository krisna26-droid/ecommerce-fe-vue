<template>
  <div class="cart-page">
    <div class="container">
      <header class="cart-header">
        <h1 class="page-title">Shopping Cart</h1>
        <span class="item-count" v-if="!isLoading">{{ cartItems.length }} Items</span>
        <div v-else class="skeleton skeleton-text" style="width: 60px;"></div>
      </header>

      <div v-if="isLoading" class="cart-main-layout">
        <div class="cart-content">
          <div class="skeleton skeleton-bar" style="margin-bottom: 20px;"></div>
          <div v-for="i in 3" :key="'skel-' + i" class="cart-item-row">
            <div class="item-main">
              <div class="skeleton skeleton-img"></div>
              <div class="item-info">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text" style="width: 40px;"></div>
                <div class="skeleton skeleton-title" style="width: 80px; margin-top: 10px;"></div>
              </div>
            </div>
          </div>
        </div>
        <aside class="cart-sidebar">
          <div class="skeleton skeleton-card"></div>
        </aside>
      </div>

      <div v-else class="cart-main-layout">
        <div class="cart-content">
          <div v-if="cartItems.length > 0">
            <div class="shipping-info-bar">
              <i class="fa-solid fa-location-dot"></i>
              <span>Shipping to <strong>Timedoor, Denpasar</strong></span>
            </div>

            <div class="cart-items-list">
              <div v-for="item in cartItems" :key="item.cartId" class="cart-item-row">
                <div class="item-main" @click="goToDetail(item.productId)">
                  <img :src="item.image" :alt="item.name" class="item-img" />
                  <div class="item-info">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <p class="item-meta">Size: {{ item.size }}</p>
                    <p class="item-price">{{ formatPrice(item.price) }}</p>
                    <button @click.stop="confirmRemove(item.cartId)" class="btn-remove-text">Remove</button>
                  </div>
                </div>
                
                <div class="quantity-control">
                  <button @click="updateQty(item, -1)" :disabled="item.qty <= 1">-</button>
                  <input type="number" :value="item.qty" readonly />
                  <button @click="updateQty(item, 1)">+</button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-cart-container">
            <div class="empty-cart-card">
              <div class="empty-illustration">
                <div class="cart-icon-bg"><i class="fa-solid fa-cart-shopping"></i></div>
              </div>
              <h2 class="empty-title">Your cart is empty</h2>
              <p class="empty-description">Find your favorite Vans and add to cart before checking out.</p>
              <router-link to="/products" class="btn-browse">Find Products</router-link>
            </div>
          </div>
        </div>

        <aside class="cart-sidebar">
          <div class="summary-card" :class="{ 'summary-disabled': cartItems.length === 0 }">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-details">
              <div class="summary-line">
                <span>Items ({{ cartItems.length }})</span>
                <span>{{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="summary-line">
                <span>Shipping Fee</span>
                <span>{{ cartItems.length > 0 ? formatPrice(20000) : 'Rp0' }}</span>
              </div>
              <div class="summary-total">
                <span class="total-label">Total Payment</span>
                <span class="total-value">{{ formatPrice(cartItems.length > 0 ? totalPrice + 20000 : 0) }}</span>
              </div>
            </div>
            <button 
              class="btn-checkout" 
              :disabled="cartItems.length === 0"
              @click="goToOrderConfirmation"
            >
              Checkout {{ cartItems.length > 0 ? `(${cartItems.length})` : '' }}
            </button>
          </div>
        </aside>
      </div>

      <section class="other-products-section">
        <h2 class="section-title">Other Classics</h2>
        <div v-if="isLoading" class="other-grid">
           <div v-for="i in 4" :key="'osk-' + i" class="skeleton skeleton-card" style="height: 250px;"></div>
        </div>
        <div v-else class="other-grid">
          <div v-for="product in otherProducts" :key="product.id" class="product-card" @click="goToDetail(product.id)">
            <div class="img-wrapper">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="card-body">
              <p class="p-price">{{ formatPrice(product.price) }}</p>
              <p class="p-name">{{ product.name }}</p>
              <div class="p-meta">
                <span>{{ product.size }}</span>
                <span class="p-likes"><i class="fa-regular fa-heart"></i> 12</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child, remove, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: 'CartPage',
  data() {
    return {
      cartItems: [],
      otherProducts: [],
      isLoading: true,
      currentUser: null
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);
    }
  },
  methods: {
    async fetchData(user) {
      this.isLoading = true;
      try {
        const cartSnapshot = await get(child(dbRef(rtdb), `carts/${user.uid}`));
        this.cartItems = cartSnapshot.exists() ? Object.keys(cartSnapshot.val()).map(key => ({ 
          cartId: key, 
          qty: cartSnapshot.val()[key].qty || 1, 
          ...cartSnapshot.val()[key] 
        })) : [];

        const productSnapshot = await get(child(dbRef(rtdb), 'products'));
        this.otherProducts = productSnapshot.exists() ? Object.keys(productSnapshot.val()).slice(0, 8).map(key => ({ 
          id: key, ...productSnapshot.val()[key] 
        })) : [];
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => { this.isLoading = false; }, 800);
      }
    },
    async updateQty(item, change) {
      if (!this.currentUser) return;
      const newQty = item.qty + change;
      if (newQty < 1) return;
      try {
        await update(dbRef(rtdb, `carts/${this.currentUser.uid}/${item.cartId}`), { qty: newQty });
        item.qty = newQty;
      } catch (e) { console.error(e); }
    },
    async confirmRemove(cartId) {
      if (!this.currentUser) return;
      if (confirm("Remove this item from your cart?")) {
        try {
          await remove(dbRef(rtdb, `carts/${this.currentUser.uid}/${cartId}`));
          this.cartItems = this.cartItems.filter(i => i.cartId !== cartId);
        } catch (e) { console.error(e); }
      }
    },
    goToOrderConfirmation() {
      if (!this.currentUser) {
        this.$router.push('/login');
        return;
      }
      this.$router.push('/checkout');
    },
    formatPrice(price) { return `Rp${Number(price).toLocaleString('id-ID')}`; },
    goToDetail(id) { this.$router.push(`/products/${id}`); }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.fetchData(user);
      } else {
        this.currentUser = null;
        this.cartItems = [];
        this.isLoading = false;
      }
    });
  }
};
</script>

<style scoped>
/* 1. LAYOUT & CONTAINER */
.cart-page { background: #fff; padding-top: 40px; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 2. HEADER */
.cart-header { display: flex; align-items: baseline; gap: 15px; margin-bottom: 25px; border-bottom: 2px solid #000; padding-bottom: 10px; }
.page-title { font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px; }
.item-count { color: #888; font-size: 14px; font-weight: 600; }

/* 3. MAIN LAYOUT GRID */
.cart-main-layout { display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: start; }
@media (max-width: 992px) { .cart-main-layout { grid-template-columns: 1fr; } }

/* 4. CART ITEMS */
.shipping-info-bar { background: #f5f5f5; padding: 12px 15px; border-radius: 4px; margin-bottom: 20px; font-size: 13px; color: #555; border-left: 4px solid #C41230; }
.cart-item-row { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; }
.item-main { display: flex; gap: 20px; cursor: pointer; }
.item-img { width: 90px; height: 110px; object-fit: cover; border-radius: 4px; }
.item-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
.item-price { font-weight: 800; font-size: 16px; color: #C41230; margin-bottom: 10px; }
.btn-remove-text { background: none; border: none; color: #C41230; font-size: 12px; cursor: pointer; text-decoration: underline; padding: 0; font-weight: 600; }

.quantity-control { display: flex; align-items: center; border: 2px solid #000; border-radius: 4px; overflow: hidden; height: 36px; }
.quantity-control button { width: 36px; height: 100%; border: none; background: #fff; cursor: pointer; font-weight: 800; font-size: 18px; transition: 0.2s; }
.quantity-control button:hover:not(:disabled) { background: #000; color: #fff; }
.quantity-control input { width: 45px; text-align: center; border: none; border-left: 2px solid #000; border-right: 2px solid #000; outline: none; font-size: 14px; font-weight: 700; }

/* 5. SUMMARY CARD */
.summary-card { border: 2px solid #000; border-radius: 4px; padding: 25px; position: sticky; top: 100px; box-shadow: 8px 8px 0px rgba(0,0,0,0.05); }
.summary-disabled { opacity: 0.6; }
.summary-title { font-size: 16px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; }
.summary-line { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; color: #555; margin-bottom: 15px; }
.summary-total { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #000; padding-top: 20px; margin-bottom: 25px; margin-top: 10px; }
.total-label { font-weight: 800; font-size: 16px; text-transform: uppercase; }
.total-value { font-weight: 900; font-size: 20px; color: #C41230; }

.btn-checkout { width: 100%; background: #000; color: #fff; border: none; padding: 15px; border-radius: 4px; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: 0.2s; letter-spacing: 1px; }
.btn-checkout:hover:not(:disabled) { background: #C41230; }
.btn-checkout:disabled { background-color: #ccc; cursor: not-allowed; }

/* 6. EMPTY STATE */
.empty-cart-container { display: flex; justify-content: center; align-items: center; padding: 60px 0; }
.empty-cart-card { text-align: center; max-width: 400px; }
.empty-illustration { margin-bottom: 24px; display: flex; justify-content: center; }
.cart-icon-bg { width: 100px; height: 80px; background-color: #C41230; border-radius: 4px; display: flex; justify-content: center; align-items: center; }
.cart-icon-bg i { color: #fff; font-size: 40px; }
.empty-title { font-size: 24px; font-weight: 800; color: #000; text-transform: uppercase; margin-bottom: 12px; }
.empty-description { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 30px; font-weight: 500; }
.btn-browse { display: inline-block; background-color: #000; color: white; padding: 12px 40px; border-radius: 4px; text-decoration: none; font-weight: 800; text-transform: uppercase; transition: 0.2s; }
.btn-browse:hover { background-color: #C41230; }

/* 7. OTHER PRODUCTS */
.other-products-section { margin-top: 80px; padding-bottom: 100px; }
.section-title { font-size: 20px; font-weight: 800; margin-bottom: 30px; text-transform: uppercase; }
.other-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 768px) { .other-grid { grid-template-columns: repeat(2, 1fr); } }
.product-card { cursor: pointer; transition: transform 0.2s; }
.product-card:hover { transform: translateY(-5px); }
.img-wrapper img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px; margin-bottom: 12px; }
.p-price { font-weight: 800; color: #C41230; margin-bottom: 4px; }
.p-name { font-size: 14px; font-weight: 700; color: #000; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-transform: uppercase; }
.p-meta { display: flex; justify-content: space-between; color: #888; font-size: 12px; font-weight: 600; }

/* 8. SKELETON ANIMATION */
.skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #fce8e8 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; border-radius: 4px; }
@keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
</style>