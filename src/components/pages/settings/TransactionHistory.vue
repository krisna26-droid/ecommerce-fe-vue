<template>
  <div class="transaction-history">
    <h2 class="section-header">MY ORDER</h2>

    <div v-if="orders.length === 0 && !isLoading" class="empty-orders">
      <div class="empty-illustration">
        <div class="shopping-bag-vans">
          <div class="bag-eyes"></div>
        </div>
      </div>
      <h2 class="empty-title">No orders yet</h2>
      <p class="empty-description">
        When you buy Vans classics, your order details will appear here.
      </p>
      <router-link to="/products" class="btn-vans-primary btn-shop"
        >SHOP NOW</router-link
      >
    </div>

    <div v-else-if="orders.length > 0" class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card-vans">
        <div class="order-header">
          <div class="header-left">
            <i class="fa-solid fa-bag-shopping shopping-icon"></i>
            <span class="activity-label">SHOPPING</span>
            <span class="order-date">{{ order.date }}</span>
            <span class="status-badge status-done">DONE</span>
          </div>
          <span class="order-number">{{ order.orderId }}</span>
        </div>

        <div class="order-body">
          <div class="product-info">
            <img
              :src="order.displayItem.image"
              :alt="order.displayItem.name"
              class="product-thumb"
            />
            <div class="product-details">
              <h3 class="product-name">{{ order.displayItem.name }}</h3>
              <p class="product-qty">
                1 product x {{ formatPrice(order.displayItem.price) }}
              </p>
              <p class="product-meta">Size: {{ order.displayItem.size }}</p>
              <p v-if="order.moreItems > 0" class="more-products">
                + {{ order.moreItems }} more products
              </p>
            </div>
          </div>
          <div class="price-summary">
            <p class="total-label">Total price</p>
            <p class="total-value">{{ formatPrice(order.totalPrice) }}</p>
          </div>
        </div>

        <div class="order-actions">
          <button
            class="btn-vans-outline btn-buy-again"
            @click="$router.push('/products')"
          >
            BUY AGAIN
          </button>
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
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, child } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "TransactionHistory",
  data() {
    return { isLoading: true, orders: [] };
  },
  methods: {
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString("id-ID")}`;
    },
    async fetchTransactionHistory(user) {
      try {
        const snapshot = await get(child(dbRef(rtdb), `history/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.orders = Object.keys(data)
            .map((key) => {
              const orderData = data[key];
              return {
                id: key,
                ...orderData,
                displayItem: orderData.items[0],
                moreItems: orderData.items.length - 1,
              };
            })
            .reverse();
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) this.fetchTransactionHistory(user);
      else this.isLoading = false;
    });
  },
};
</script>

<style scoped>
.section-header {
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 24px;
  color: #666;
}

/* EMPTY STATE */
.empty-orders {
  text-align: center;
  padding: 60px 0;
}
.empty-illustration {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.shopping-bag-vans {
  width: 100px;
  height: 100px;
  background: var(--vans-red);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #000;
  position: relative;
}
.bag-eyes::before,
.bag-eyes::after {
  content: "";
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  display: inline-block;
  margin: 0 5px;
}
.empty-title {
  font-size: 24px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.empty-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  font-weight: 700;
}
.btn-shop {
  width: auto;
  padding: 14px 40px;
}

/* ORDER CARD */
.order-card-vans {
  border: 2px solid #000;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--vans-shadow);
}
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.activity-label {
  font-weight: 900;
  text-transform: uppercase;
  font-size: 12px;
}
.order-date {
  font-size: 12px;
  color: #666;
  font-weight: 700;
}
.product-info {
  display: flex;
  gap: 15px;
}
.product-thumb {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}
.product-name {
  font-size: 15px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.product-qty,
.product-meta {
  font-size: 12px;
  font-weight: 700;
  color: #666;
}
.more-products {
  color: var(--vans-red);
  font-weight: 900;
  font-size: 12px;
  margin-top: 4px;
}
.price-summary {
  text-align: right;
  border-left: 2px solid #eee;
  padding-left: 20px;
}
.total-label {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: #888;
}
.total-value {
  font-size: 18px;
  font-weight: 900;
  color: var(--vans-red);
}
.order-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}
.btn-buy-again {
  width: auto;
  font-size: 12px;
  padding: 10px 24px;
}
</style>
