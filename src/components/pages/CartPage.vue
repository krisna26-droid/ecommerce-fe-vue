<template>
  <div class="cart-page">
    <div class="container">
      <div class="cart-header">
        <h1 class="page-title">Cart</h1>
        <span class="item-count">{{ cartItems.length }} Items</span>
      </div>

      <div v-if="isLoading" class="loading-state">Loading cart...</div>

      <div v-else-if="cartItems.length > 0" class="cart-main-layout">
        <div class="cart-content">
          <div class="shipping-info-bar">
            <i class="fa-solid fa-location-dot"></i>
            <span>Shiping to <strong>Timedoor, Denpasar</strong></span>
          </div>

          <div class="cart-items-list">
            <div v-for="(item, index) in cartItems" :key="item.cartId" class="cart-item-row">
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

        <aside class="cart-sidebar">
          <div class="summary-card">
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
            <button class="btn-checkout">Checkout({{ cartItems.length }})</button>
          </div>
        </aside>
      </div>

      <section class="other-products-section">
        <h2 class="section-title">Other Product</h2>
        <div class="other-grid">
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
        // Fetch Cart Items
        const cartSnapshot = await get(child(dbRef(rtdb), 'carts'));
        if (cartSnapshot.exists()) {
          const data = cartSnapshot.val();
          this.cartItems = Object.keys(data).map(key => ({
            cartId: key,
            qty: data[key].qty || 1, // Default qty 1 jika belum ada
            ...data[key]
          }));
        }

        // Fetch Other Products untuk bagian bawah
        const productSnapshot = await get(child(dbRef(rtdb), 'products'));
        if (productSnapshot.exists()) {
          const pData = productSnapshot.val();
          this.otherProducts = Object.keys(pData).slice(0, 8).map(key => ({
            id: key, ...pData[key]
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateQty(item, change) {
      const newQty = item.qty + change;
      if (newQty < 1) return;
      
      try {
        await update(dbRef(rtdb, `carts/${item.cartId}`), { qty: newQty });
        item.qty = newQty;
      } catch (e) { console.error(e); }
    },
    async confirmRemove(cartId) {
      if (confirm("Remove this item from cart?")) {
        await remove(dbRef(rtdb, `carts/${cartId}`));
        this.cartItems = this.cartItems.filter(i => i.cartId !== cartId);
      }
    },
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },
    goToDetail(id) {
      this.$router.push(`/products/${id}`);
      window.scrollTo(0, 0);
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.cart-page { background: #fff; padding-top: 40px; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.cart-header { display: flex; align-items: baseline; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.page-title { font-size: 24px; font-weight: 600; }
.item-count { color: #888; font-size: 14px; }

.cart-main-layout { display: grid; grid-template-columns: 1fr 350px; gap: 40px; align-items: start; }

.shipping-info-bar { background: #f5f5f5; padding: 12px 15px; border-radius: 4px; margin-bottom: 20px; font-size: 13px; color: #555; }
.shipping-info-bar i { margin-right: 8px; color: #888; }

.cart-item-row { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #eee; }
.item-main { display: flex; gap: 20px; }
.item-img { width: 90px; height: 110px; object-fit: cover; border-radius: 4px; }
.item-name { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
.item-meta { font-size: 13px; color: #888; margin-bottom: 8px; }
.item-price { font-weight: 600; font-size: 16px; margin-bottom: 10px; }
.btn-remove-text { background: none; border: none; color: #ff4d4d; font-size: 12px; cursor: pointer; padding: 0; text-decoration: underline; }

.quantity-control { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
.quantity-control button { width: 30px; height: 30px; border: none; background: #fff; cursor: pointer; }
.quantity-control button:hover { background: #f9f9f9; }
.quantity-control input { width: 40px; text-align: center; border: none; border-left: 1px solid #ddd; border-right: 1px solid #ddd; font-size: 14px; outline: none; }

/* Summary Sidebar */
.summary-card { border: 1px solid #eee; border-radius: 8px; padding: 25px; position: sticky; top: 100px; }
.summary-title { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
.summary-line { display: flex; justify-content: space-between; font-size: 13px; color: #888; margin-bottom: 20px; }
.summary-total { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 20px; margin-bottom: 25px; }
.total-label { font-weight: 600; font-size: 16px; }
.total-value { font-weight: 700; font-size: 20px; color: #000; }
.btn-checkout { width: 100%; background: #008284; color: #fff; border: none; padding: 15px; border-radius: 4px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-checkout:hover { background: #006b6d; }

/* Other Products Section */
.other-products-section { margin-top: 80px; padding-bottom: 100px; }
.section-title { font-size: 20px; font-weight: 600; margin-bottom: 30px; }
.other-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.product-card { cursor: pointer; }
.img-wrapper img { width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 4px; margin-bottom: 12px; }
.p-price { font-weight: 700; color: #008284; margin-bottom: 4px; }
.p-name { font-size: 14px; color: #333; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.p-meta { display: flex; justify-content: space-between; color: #888; font-size: 12px; }
</style>