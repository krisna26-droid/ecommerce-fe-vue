<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-header">
        <h1 class="page-title">Cart</h1>
        <span class="item-count" v-if="!isLoading">{{ cartItems.length }} Items</span>
        <div v-else class="skeleton skeleton-text" style="width: 60px;"></div>
      </div>

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
              <span>Shiping to <strong>Timedoor, Denpasar</strong></span>
            </div>

            <div class="cart-items-list">
              <div v-for="item in cartItems" :key="item.cartId" class="cart-item-row">
                <div class="item-main">
                  <img :src="item.image" :alt="item.name" class="item-img" />
                  <div class="item-info">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <p class="item-meta">{{ item.size }}</p>
                    <p class="item-price">{{ formatPrice(item.price) }}</p>
                    <button @click="confirmRemove(item.cartId)" class="btn-remove-text">Remove</button>
                  </div>
                </div>
                
                <div class="quantity-control">
                  <button @click="updateQty(item, -1)" :disabled="item.qty <= 1">-</button>
                  <input type="number" v-model.number="item.qty" readonly />
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
              <h2 class="empty-title">Your cart still empty</h2>
              <p class="empty-description">Find your favorite items and add to cart before check out.</p>
              <router-link to="/products" class="btn-find-products-large">Find Products</router-link>
            </div>
          </div>
        </div>

        <aside class="cart-sidebar">
          <div class="summary-card" :class="{ 'summary-disabled': cartItems.length === 0 }">
            <h3 class="summary-title">Order Summary</h3>
            <div class="summary-details">
              <div class="summary-line">
                <span>{{ cartItems.length }} items</span>
                <span>Not include shipping fee</span>
              </div>
              <div class="summary-total">
                <span class="total-label">Order Summary</span>
                <span class="total-value">{{ formatPrice(totalPrice) }}</span>
              </div>
            </div>
            <button class="btn-checkout" :class="{ 'btn-disabled': cartItems.length === 0 }" :disabled="cartItems.length === 0">
              Checkout {{ cartItems.length > 0 ? `(${cartItems.length})` : '' }}
            </button>
          </div>
        </aside>
      </div>

      <section class="other-products-section">
        <h2 class="section-title">Other Product</h2>
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

export default {
  name: 'CartPage',
  data() {
    return {
      cartItems: [],
      otherProducts: [],
      isLoading: true
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);
    }
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        // Ambil data keranjang
        const cartSnapshot = await get(child(dbRef(rtdb), 'carts'));
        this.cartItems = cartSnapshot.exists() ? Object.keys(cartSnapshot.val()).map(key => ({ 
          cartId: key, 
          qty: cartSnapshot.val()[key].qty || 1, 
          ...cartSnapshot.val()[key] 
        })) : [];

        // Ambil data produk lainnya untuk rekomendasi
        const productSnapshot = await get(child(dbRef(rtdb), 'products'));
        this.otherProducts = productSnapshot.exists() ? Object.keys(productSnapshot.val()).slice(0, 8).map(key => ({ 
          id: key, 
          ...productSnapshot.val()[key] 
        })) : [];
      } finally {
        // Memberikan sedikit jeda agar transisi skeleton terasa halus
        setTimeout(() => { this.isLoading = false; }, 800);
      }
    },
    async updateQty(item, change) {
      const newQty = item.qty + change;
      if (newQty < 1) return;
      // Update qty langsung ke Firebase
      await update(dbRef(rtdb, `carts/${item.cartId}`), { qty: newQty });
      item.qty = newQty;
    },
    async confirmRemove(cartId) {
      if (confirm("Remove this item from your cart?")) {
        await remove(dbRef(rtdb, `carts/${cartId}`));
        this.cartItems = this.cartItems.filter(i => i.cartId !== cartId);
      }
    },
    formatPrice(price) { return `Rp${Number(price).toLocaleString('id-ID')}`; },
    goToDetail(id) { this.$router.push(`/products/${id}`); }
  },
  mounted() { this.fetchData(); }
};
</script>

<style scoped>
/* STYLE DASAR */
.cart-page { background: #fff; padding-top: 40px; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.cart-header { display: flex; align-items: baseline; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.page-title { font-size: 24px; font-weight: 600; }
.item-count { color: #888; font-size: 14px; }
.cart-main-layout { display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: start; }

/* ITEM ROWS */
.shipping-info-bar { background: #f5f5f5; padding: 12px 15px; border-radius: 4px; margin-bottom: 20px; font-size: 13px; color: #555; }
.cart-item-row { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; }
.item-main { display: flex; gap: 20px; }
.item-img { width: 90px; height: 110px; object-fit: cover; border-radius: 4px; }
.item-name { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
.item-price { font-weight: 600; font-size: 16px; margin-bottom: 10px; }
.btn-remove-text { background: none; border: none; color: #ff4d4d; font-size: 12px; cursor: pointer; text-decoration: underline; padding: 0; }

.quantity-control { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
.quantity-control button { width: 30px; height: 30px; border: none; background: #fff; cursor: pointer; }
.quantity-control input { width: 40px; text-align: center; border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd; outline: none; }

/* SUMMARY CARD */
.summary-card { border: 1px solid #eee; border-radius: 8px; padding: 25px; position: sticky; top: 100px; }
.summary-disabled { opacity: 0.6; }
.summary-title { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
.summary-line { display: flex; justify-content: space-between; font-size: 13px; color: #888; margin-bottom: 20px; }
.summary-total { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 20px; margin-bottom: 25px; }
.total-label { font-weight: 600; font-size: 16px; }
.total-value { font-weight: 700; font-size: 20px; color: #000; }
.btn-checkout { width: 100%; background: #008284; color: #fff; border: none; padding: 15px; border-radius: 4px; font-weight: 600; cursor: pointer; }
.btn-disabled { background-color: #ccc; cursor: not-allowed; }

/* EMPTY STATE */
.empty-cart-container { display: flex; justify-content: center; align-items: center; padding: 60px 0; }
.empty-cart-card { text-align: center; max-width: 400px; }
.empty-illustration { margin-bottom: 24px; display: flex; justify-content: center; }
.cart-icon-bg { width: 100px; height: 80px; background-color: #009999; border-radius: 12px; display: flex; justify-content: center; align-items: center; }
.cart-icon-bg i { color: #fff; font-size: 40px; }
.empty-title { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 12px; }
.empty-description { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 30px; }
.btn-find-products-large { display: inline-block; background-color: #009999; color: white; padding: 12px 40px; border-radius: 4px; text-decoration: none; font-weight: 600; }

/* OTHER PRODUCTS */
.other-products-section { margin-top: 80px; padding-bottom: 100px; }
.section-title { font-size: 20px; font-weight: 600; margin-bottom: 30px; }
.other-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.img-wrapper img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px; margin-bottom: 12px; }

/* SKELETON ANIMASI */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-bar { width: 100%; height: 40px; }
.skeleton-img { width: 90px; height: 110px; }
.skeleton-title { width: 150px; height: 20px; margin-bottom: 8px; }
.skeleton-text { height: 14px; margin-bottom: 5px; }
.skeleton-card { width: 100%; height: 300px; }
</style>