<template>
  <div class="checkout-page">
    <div class="container" v-if="!isLoading">
      <header class="checkout-header">
        <h1 class="page-title">SHIPPING & PAYMENT</h1>
      </header>

      <div class="checkout-layout">
        <div class="checkout-main">
          <section class="info-card">
            <h2 class="card-title">
              <i class="fa-solid fa-location-dot"></i> SHIPPING ADDRESS
            </h2>
            <div class="form-body">
              <div class="form-group">
                <label>Receiver Name</label>
                <input
                  type="text"
                  v-model="shipping.name"
                  placeholder="Enter recipient name"
                  required
                />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  v-model="shipping.phone"
                  placeholder="0812XXXXXXXX"
                  required
                />
              </div>
              <div class="form-group">
                <label>Full Address</label>
                <textarea
                  v-model="shipping.address"
                  placeholder="Street name, House number, District, etc."
                  required
                ></textarea>
              </div>
            </div>
          </section>

          <section class="info-card">
            <h2 class="card-title">
              <i class="fa-solid fa-credit-card"></i> PAYMENT METHOD
            </h2>
            <div class="payment-grid">
              <label
                class="payment-option"
                :class="{ active: paymentMethod === 'Bank Transfer' }"
              >
                <input
                  type="radio"
                  v-model="paymentMethod"
                  value="Bank Transfer"
                />
                <span class="p-text">Bank Transfer</span>
              </label>
              <label
                class="payment-option"
                :class="{ active: paymentMethod === 'COD' }"
              >
                <input type="radio" v-model="paymentMethod" value="COD" />
                <span class="p-text">Cash on Delivery</span>
              </label>
            </div>
          </section>
        </div>

        <aside class="checkout-sidebar">
          <div class="summary-card">
            <h2 class="summary-title">ORDER SUMMARY</h2>

            <div class="items-list-mini">
              <div
                v-for="item in cartItems"
                :key="item.cartId || item.productId"
                class="mini-row"
              >
                <img :src="item.image" :alt="item.name" class="mini-img" />
                <div class="mini-info">
                  <p class="name">{{ item.name }}</p>
                  <p class="meta">{{ item.qty }}x · Size {{ item.size }}</p>
                  <p class="price">{{ formatPrice(item.price * item.qty) }}</p>
                </div>
              </div>
            </div>

            <div class="billing-section">
              <div class="bill-line total">
                <span>ESTIMATED TOTAL</span>
                <span>{{ formatPrice(subtotal + 35000) }}</span>
              </div>
            </div>

            <button class="btn-continue" @click="goToConfirmation">
              CONTINUE TO CONFIRMATION
            </button>
          </div>
        </aside>
      </div>
    </div>

    <div v-else class="loading-container">
      <div class="spinner"></div>
      <p>PREPARING CHECKOUT...</p>
    </div>
  </div>
</template>

<script>
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, child } from "firebase/database";
import { getAuth } from "firebase/auth";

export default {
  name: "CheckoutPage",
  data() {
    return {
      cartItems: [],
      isLoading: true,
      currentUser: null,
      paymentMethod: "Bank Transfer",
      shipping: { name: "", phone: "", address: "" },
    };
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
    },
  },
  methods: {
    formatPrice(p) {
      return `Rp${Number(p).toLocaleString("id-ID")}`;
    },

    goToConfirmation() {
      if (
        !this.shipping.name ||
        !this.shipping.address ||
        !this.shipping.phone
      ) {
        alert("Please complete your shipping address.");
        return;
      }

      const checkoutData = {
        shipping: this.shipping,
        paymentMethod: this.paymentMethod,
        items: this.cartItems, // Sertakan item agar konsisten di halaman konfirmasi
      };
      localStorage.setItem(
        "vans_pending_checkout",
        JSON.stringify(checkoutData)
      );
      this.$router.push("/checkout/confirm");
    },
  },
  mounted() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;

    if (!this.currentUser) return this.$router.push("/login");

    const mode = localStorage.getItem("vans_checkout_mode");

    if (mode === "direct") {
      // MODE BUY NOW: Ambil dari localStorage
      const directItem = localStorage.getItem("vans_direct_item");
      if (directItem) {
        this.cartItems = JSON.parse(directItem);
        this.isLoading = false;
      } else {
        this.$router.push("/products");
      }
    } else {
      // MODE CART: Ambil dari Firebase
      get(child(dbRef(rtdb), `carts/${this.currentUser.uid}`)).then((snap) => {
        if (snap.exists()) {
          this.cartItems = Object.keys(snap.val()).map((k) => ({
            cartId: k,
            ...snap.val()[k],
          }));
        } else {
          this.$router.push("/cart");
        }
        this.isLoading = false;
      });
    }
  },
};
</script>

<style scoped>
.btn-continue {
  width: 100%;
  background: #000;
  color: #fff;
  border: none;
  padding: 20px;
  border-radius: 4px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
}
.btn-continue:hover {
  background: #c41230;
}
.checkout-page {
  background: #fdfdfd;
  padding: 40px 0;
  min-height: 100vh;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
.checkout-header {
  border-bottom: 2px solid #000;
  margin-bottom: 30px;
  padding-bottom: 10px;
}
.page-title {
  font-size: 26px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -1px;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}
.info-card {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 25px;
  margin-bottom: 25px;
}
.card-title {
  font-size: 15px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 8px;
  color: #444;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 600;
}
textarea {
  height: 100px;
  resize: none;
}
.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.payment-option {
  border: 2px solid #eee;
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  font-weight: 800;
  font-size: 13px;
}
.payment-option.active {
  border-color: #000;
  background: #f9f9f9;
}
.payment-option input {
  display: none;
}
.summary-card {
  background: #fff;
  border: 2px solid #000;
  padding: 30px;
  border-radius: 4px;
  position: sticky;
  top: 20px;
}
.items-list-mini {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}
.mini-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}
.mini-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.mini-info .name {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}
.mini-info .price {
  font-size: 12px;
  font-weight: 800;
  color: #c41230;
}
.bill-line.total {
  border-top: 2px solid #000;
  padding-top: 15px;
  font-weight: 900;
  color: #c41230;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.spinner {
  width: 45px;
  height: 45px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #c41230;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
