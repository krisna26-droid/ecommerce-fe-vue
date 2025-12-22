<template>
  <div class="homepage">
    <main class="main-content">
      <section class="hero-section">
        <img
          src="@/assets/images/hero/banner.jpg"
          alt="Vans Off The Wall"
          class="hero-image"
        />
        <div class="hero-overlay">
          <div class="vans-auth-card hero-card-content">
            <h1 class="hero-title">Ready to kick it "Off The Wall"?</h1>
            <BaseButton
              variant="primary"
              size="lg"
              @click="handleShopNow"
              block
            >
              Shop Now
            </BaseButton>
          </div>
        </div>
      </section>

      <section class="product-section container">
        <div class="vans-divider">
          <h5 class="modal-title-vans">Popular items</h5>
          <router-link to="/products" class="vans-switch-link"
            >See all</router-link
          >
        </div>

        <div v-if="isLoading" class="loading-state">Loading items...</div>

        <div v-else class="vans-product-grid">
          <div
            v-for="product in popularProducts"
            :key="product.id"
            class="vans-product-card"
            @click="goToDetail(product.id)"
          >
            <div class="vans-img-wrapper">
              <img
                :src="product.image"
                :alt="product.name"
                class="vans-img-zoom"
              />
            </div>
            <div class="product-info">
              <p class="vans-price-tag">{{ formatPrice(product.price) }}</p>
              <p class="vans-product-title">{{ product.name }}</p>
              <div class="product-meta">
                <span>{{ product.size }}</span>
                <span class="likes-count"
                  ><i class="fa-regular fa-heart"></i>
                  {{ product.likes || 0 }}</span
                >
              </div>
            </div>
          </div>

          <div class="see-all-card" @click="handleShopNow">
            <p class="see-all-text">See All Products</p>
          </div>
        </div>
      </section>

      <section class="brand-section container">
        <h5 class="modal-title-vans">Shop by Category</h5>
        <div class="category-buttons">
          <BaseButton
            v-for="category in categories"
            :key="category"
            variant="outline"
            size="sm"
            @click="filterByCategory(category)"
          >
            {{ category }}
          </BaseButton>
        </div>
      </section>

      <section class="product-section container">
        <div class="vans-divider">
          <h5 class="modal-title-vans">New Arrivals</h5>
          <router-link to="/products" class="vans-switch-link"
            >See all</router-link
          >
        </div>

        <div v-if="isLoading" class="loading-state">Loading items...</div>

        <div v-else class="vans-product-grid">
          <div
            v-for="product in newProducts"
            :key="product.id"
            class="vans-product-card"
            @click="goToDetail(product.id)"
          >
            <div class="vans-img-wrapper">
              <img
                :src="product.image"
                :alt="product.name"
                class="vans-img-zoom"
              />
            </div>
            <div class="product-info">
              <p class="vans-price-tag">{{ formatPrice(product.price) }}</p>
              <p class="vans-product-title">{{ product.name }}</p>
              <div class="product-meta">
                <span>{{ product.size }}</span>
                <span class="likes-count"
                  ><i class="fa-regular fa-heart"></i>
                  {{ product.likes || 0 }}</span
                >
              </div>
            </div>
          </div>

          <div class="see-all-card" @click="handleShopNow">
            <p class="see-all-text">See New Items</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import BaseButton from "../ui/BaseButton.vue";
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, child } from "firebase/database";

export default {
  name: "HomePage",
  components: { BaseButton },
  data() {
    return {
      allProducts: [],
      isLoading: true,
      categories: ["Shoes", "Apparel", "Accessories", "Classic", "Skate"],
    };
  },
  computed: {
    popularProducts() {
      return this.allProducts.slice(0, 5);
    },
    newProducts() {
      return [...this.allProducts].reverse().slice(0, 5);
    },
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        const snapshot = await get(child(dbRef(rtdb), "products"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.allProducts = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            price: Number(data[key].price),
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString("id-ID")}`;
    },
    handleShopNow() {
      this.$router.push("/products");
    },
    filterByCategory(category) {
      this.$router.push({ path: "/products", query: { category } });
    },
    goToDetail(id) {
      this.$router.push(`/products/${id}`);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.hero-section {
  height: 500px;
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 80px;
}

.hero-card-content {
  max-width: 380px;
}

.hero-title {
  font-size: 32px;
  font-weight: 900;
  color: var(--vans-black);
  margin-bottom: 25px;
  line-height: 1.1;
  text-transform: uppercase;
}

.product-section {
  margin-bottom: 80px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  font-weight: 700;
}

.likes-count i {
  color: var(--vans-red);
}

.see-all-card {
  background-color: #fce8e8;
  border: 2px dashed var(--vans-red);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.see-all-card:hover {
  background-color: #fbdada;
}

.see-all-text {
  color: var(--vans-red);
  font-weight: 800;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
}

.brand-section {
  margin-bottom: 80px;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.loading-state {
  text-align: center;
  padding: 40px;
  font-weight: 700;
  color: var(--vans-gray-border);
}

@media (max-width: 768px) {
  .hero-overlay {
    padding: 0 20px;
    justify-content: center;
  }
  .hero-card-content {
    text-align: center;
  }
}
</style>
