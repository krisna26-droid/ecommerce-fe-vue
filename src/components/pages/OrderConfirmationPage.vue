<template>
  <div class="order-confirmation-page">
    <div class="container main-layout" v-if="!isLoading">
      <div class="confirmation-content">
        <section class="info-card">
          <h2 class="card-title">Order</h2>
          <div class="order-items-list">
            <p v-if="orderItems.length === 0" class="sub-text">
              No items found.
            </p>

            <div
              v-for="item in orderItems"
              :key="item.cartId || item.productId"
              class="product-row"
            >
              <img :src="item.image" :alt="item.name" class="product-img" />
              <div class="product-info">
                <h3 class="product-name">{{ item.name }}</h3>
                <p class="product-meta">Size: {{ item.size }}</p>
                <p class="product-price">{{ formatPrice(item.price) }}</p>
              </div>
              <span class="product-qty">x{{ item.qty }}</span>
            </div>
          </div>
        </section>

        <section class="info-card">
          <h2 class="card-title">Address</h2>
          <div class="detail-box">
            <div class="icon-circle">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <div class="detail-text">
              <p class="highlight">{{ shippingData.name }}</p>
              <p class="sub-text">{{ shippingData.address }}</p>
              <p class="sub-text">Phone: {{ shippingData.phone }}</p>
            </div>
          </div>
        </section>

        <section class="info-card">
          <h2 class="card-title">Delivery details</h2>
          <div class="detail-box">
            <div class="icon-circle">
              <i class="fa-solid fa-truck-fast"></i>
            </div>
            <div class="detail-text">
              <p class="highlight">Fedex Express Shipping</p>
              <p class="price-text">Rp20.000</p>
              <p class="sub-text">
                <i class="fa-regular fa-clock"></i> Home delivery in 1-3 working
                days
              </p>
            </div>
          </div>
        </section>

        <section class="info-card">
          <h2 class="card-title">Payment Method</h2>
          <div class="detail-box">
            <div class="payment-brand">{{ paymentMethod }}</div>
            <div class="detail-text">
              <p class="highlight" v-if="paymentMethod === 'Bank Transfer'">
                Manual Verification
              </p>
              <p class="highlight" v-else>Pay on Delivery</p>
              <p class="sub-text">Recipient: {{ shippingData.name }}</p>
            </div>
          </div>
        </section>
      </div>

      <aside class="order-summary-sidebar">
        <div class="summary-card">
          <h2 class="summary-title">Order summary</h2>
          <div class="summary-details">
            <div class="summary-line">
              <span>Order</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-line">
              <span>Protection fee</span>
              <span>Rp15.000</span>
            </div>
            <div class="summary-line">
              <span>Shipping</span>
              <span>Rp20.000</span>
            </div>
            <div class="divider"></div>
            <div class="summary-total">
              <span class="total-label">Total to pay</span>
              <span class="total-value">{{
                formatPrice(subtotal + 35000)
              }}</span>
            </div>
          </div>
          <button
            class="btn-order-now"
            @click="handleOrderNow"
            :disabled="isProcessing || orderItems.length === 0"
          >
            {{ isProcessing ? "PROCESSING..." : "ORDER NOW" }}
          </button>
        </div>
      </aside>
    </div>

    <div v-else class="loading-state">
      <div class="spinner"></div>
      <p>Loading Vans order confirmation...</p>
    </div>

    <CheckoutSuccessModal
      :show="showSuccessModal"
      :orderId="generatedOrderId"
      @continue="finishProcess('/products')"
      @go-history="finishProcess('/settings/history')"
    />
  </div>
</template>

<script>
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, child, remove, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import CheckoutSuccessModal from "@/components/modals/CheckoutSuccsessModal.vue";

export default {
  name: "OrderConfirmationPage",
  components: { CheckoutSuccessModal },
  data() {
    return {
      orderItems: [],
      shippingData: {},
      paymentMethod: "",
      isLoading: true,
      isProcessing: false,
      showSuccessModal: false,
      generatedOrderId: "",
      currentUser: null,
      checkoutMode: "cart", // Default mode
    };
  },
  computed: {
    subtotal() {
      return this.orderItems.reduce(
        (acc, item) => acc + Number(item.price) * item.qty,
        0
      );
    },
  },
  methods: {
    formatPrice(p) {
      return `Rp${Number(p).toLocaleString("id-ID")}`;
    },
    async handleOrderNow() {
      this.isProcessing = true;
      const orderId = `VNS-${Math.floor(Math.random() * 90000)}-1966`;

      try {
        const historyRef = dbRef(rtdb, `history/${this.currentUser.uid}`);
        await push(historyRef, {
          orderId,
          items: this.orderItems,
          shipping: this.shippingData,
          payment: this.paymentMethod,
          totalPrice: this.subtotal + 35000,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "Done",
        });

        // Hapus keranjang Firebase HANYA jika checkout dari Cart
        if (this.checkoutMode === "cart") {
          await remove(dbRef(rtdb, `carts/${this.currentUser.uid}`));
        }

        // Bersihkan data temporary
        localStorage.removeItem("vans_pending_checkout");
        localStorage.removeItem("vans_checkout_mode");
        localStorage.removeItem("vans_direct_item");

        this.generatedOrderId = orderId;
        this.showSuccessModal = true;
      } catch (e) {
        alert("Transaction failed.");
      } finally {
        this.isProcessing = false;
      }
    },
    finishProcess(route) {
      this.showSuccessModal = false;
      this.$router.push(route);
    },
  },
  async mounted() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;

    if (!this.currentUser) {
      this.$router.push("/login");
      return;
    }

    // 1. Ambil info Alamat & Payment dari LocalStorage (disimpan di CheckoutPage)
    const savedCheckout = localStorage.getItem("vans_pending_checkout");
    if (savedCheckout) {
      const parsed = JSON.parse(savedCheckout);
      this.shippingData = parsed.shipping;
      this.paymentMethod = parsed.paymentMethod;
    } else {
      this.$router.push("/checkout");
      return;
    }

    // 2. TENTUKAN SUMBER DATA PRODUK (Buy Now vs Cart)
    const mode = localStorage.getItem("vans_checkout_mode");
    this.checkoutMode = mode || "cart";

    if (this.checkoutMode === "direct") {
      // MODE BUY NOW: Ambil produk tunggal dari LocalStorage
      const directItem = localStorage.getItem("vans_direct_item");
      if (directItem) {
        this.orderItems = JSON.parse(directItem);
        this.isLoading = false;
      } else {
        this.$router.push("/products");
      }
    } else {
      // MODE CART: Ambil semua produk dari Firebase
      try {
        const snap = await get(
          child(dbRef(rtdb), `carts/${this.currentUser.uid}`)
        );
        if (snap.exists()) {
          this.orderItems = Object.keys(snap.val()).map((k) => ({
            cartId: k,
            ...snap.val()[k],
          }));
        } else {
          this.$router.push("/cart");
        }
      } catch (error) {
        console.error("Firebase error:", error);
      } finally {
        this.isLoading = false;
      }
    }
  },
};
</script>

<style scoped>
/* CSS tetap sama dengan milik Anda, sudah sangat bagus dan konsisten */

.order-confirmation-page {
  background: #fdfdfd;
  padding: 40px 0;
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
  align-items: start;
}

.info-card {
  background: #fff;
  padding: 25px;
  border-radius: 4px;
  border: 2px solid #eee;
  margin-bottom: 25px;
}

.card-title {
  font-size: 14px;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  font-weight: 800;
}

.product-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.product-row:last-child {
  border-bottom: none;
}

.product-img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #000;
  text-transform: uppercase;
}

.product-meta {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.product-price {
  font-size: 15px;
  font-weight: 800;
  color: #c41230;
  margin-top: 4px;
}

.product-qty {
  font-size: 14px;
  color: #000;
  font-weight: 800;
}

.detail-box {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.icon-circle {
  width: 40px;
  height: 40px;
  background: #000;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.highlight {
  font-weight: 800;
  font-size: 15px;
  color: #000;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.sub-text {
  font-size: 13px;
  color: #444;
  line-height: 1.5;
  font-weight: 500;
}

.price-text {
  color: #c41230;
  font-weight: 800;
  font-size: 14px;
  margin-bottom: 4px;
}

.payment-brand {
  background: #000;
  color: #fff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 900;
  font-style: italic;
  border: 2px solid #000;
}

.summary-card {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
  border: 2px solid #000;
  position: sticky;
  top: 20px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 18px;
  font-weight: 900;
  margin-bottom: 25px;
  color: #000;
  text-transform: uppercase;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 14px;
  color: #444;
  font-weight: 600;
}

.divider {
  height: 2px;
  background: #000;
  margin: 20px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.total-label {
  font-weight: 900;
  font-size: 16px;
  color: #000;
  text-transform: uppercase;
}

.total-value {
  font-weight: 900;
  font-size: 22px;
  color: #c41230;
}

.btn-order-now {
  width: 100%;
  background: #c41230;
  color: #fff;
  border: none;
  padding: 18px;
  border-radius: 4px;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-order-now:hover:not(:disabled) {
  background: #000;
  transform: translateY(-2px);
}

.btn-order-now:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 100px 0;
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
