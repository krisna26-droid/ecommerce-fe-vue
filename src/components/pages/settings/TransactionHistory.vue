<template>
  <div class="transaction-history">
    <h2 class="section-header">My Order</h2>

    <div v-if="orders.length === 0 && !isLoading" class="empty-orders">
      <div class="empty-illustration">
        <div class="shopping-bag-icon">
          <div class="bag-body">
            <div class="bag-eyes"></div>
          </div>
        </div>
      </div>
      <h2 class="empty-title">No orders yet</h2>
      <p class="empty-description">When you buy an item, your order about it will appear here.</p>
      <router-link to="/products" class="btn-shop">Shop now</router-link>
    </div>

    <div v-else-if="orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="header-left">
            <i class="fa-solid fa-bag-shopping shopping-icon"></i>
            <span class="activity-label">Shopping</span>
            <span class="order-date">{{ order.date }}</span>
            <span class="status-badge">Done</span>
          </div>
          <span class="order-number">{{ order.orderId }}</span>
        </div>

        <div class="order-body">
          <div class="product-info">
            <img :src="order.displayItem.image" :alt="order.displayItem.name" class="product-thumb" />
            <div class="product-details">
              <h3 class="product-name">{{ order.displayItem.name }}</h3>
              <p class="product-qty">1 product x {{ formatPrice(order.displayItem.price) }}</p>
              <p class="product-meta">{{ order.displayItem.size }}</p>
              <p v-if="order.moreItems > 0" class="more-products">+ {{ order.moreItems }} more products</p>
            </div>
          </div>
          <div class="price-summary">
            <p class="total-label">Total price</p>
            <p class="total-value">{{ formatPrice(order.totalPrice) }}</p>
          </div>
        </div>

        <div class="order-actions">
          <button class="btn-buy-again" @click="$router.push('/products')">Buy Again</button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your transactions...</p>
    </div>
  </div>
</template>

<script>
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: "TransactionHistory",
  data() {
    return {
      isLoading: true,
      orders: []
    };
  },
  methods: {
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },
    async fetchTransactionHistory(user) {
      try {
        const snapshot = await get(child(dbRef(rtdb), `history/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Mapping data dari Firebase object ke array
          this.orders = Object.keys(data).map(key => {
            const orderData = data[key];
            return {
              id: key,
              ...orderData,
              // Ambil item pertama untuk ditampilkan sebagai ringkasan
              displayItem: orderData.items[0],
              moreItems: orderData.items.length - 1
            };
          }).reverse(); // Agar pesanan terbaru muncul di paling atas
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.fetchTransactionHistory(user);
      } else {
        this.isLoading = false;
      }
    });
  }
};
</script>

<style scoped>
/* Style Anda tetap sama */
.transaction-history { padding-bottom: 20px; }
.section-header { font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 20px; }
.empty-orders { text-align: center; padding: 60px 0; }
.empty-illustration { display: flex; justify-content: center; margin-bottom: 24px; }
.shopping-bag-icon { width: 100px; height: 100px; background: #009999; border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; }
.bag-eyes { width: 40px; height: 10px; display: flex; justify-content: space-between; }
.bag-eyes::before, .bag-eyes::after { content: ''; width: 10px; height: 10px; background: white; border-radius: 50%; }
.empty-title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 12px; }
.empty-description { font-size: 14px; color: #6b7280; margin-bottom: 30px; }
.btn-shop { background: #009999; color: white; padding: 12px 40px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block; }
.order-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
.order-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6; margin-bottom: 15px; }
.header-left { display: flex; align-items: center; gap: 10px; font-size: 12px; }
.shopping-icon { color: #009999; }
.activity-label { font-weight: 700; color: #111827; }
.order-date { color: #6b7280; }
.status-badge { background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
.order-number { font-size: 12px; color: #6b7280; }
.order-body { display: flex; justify-content: space-between; align-items: flex-start; }
.product-info { display: flex; gap: 15px; }
.product-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; }
.product-name { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
.product-qty, .product-meta, .more-products { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
.price-summary { text-align: right; border-left: 1px solid #f3f4f6; padding-left: 20px; }
.total-label { font-size: 12px; color: #6b7280; }
.total-value { font-size: 16px; font-weight: 700; color: #111827; }
.order-actions { display: flex; justify-content: flex-end; margin-top: 15px; }
.btn-buy-again { background: #009999; color: white; border: none; padding: 8px 20px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; }
.spinner { width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #009999; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>