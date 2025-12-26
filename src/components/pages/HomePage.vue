<template>
  <div class="homepage">
    <main class="main-content">
      <section class="hero-section">
        <div class="carousel-wrapper">
          <transition-group name="fade">
            <div
              v-for="(banner, index) in bannerProducts"
              :key="banner.id"
              v-show="currentSlide === index"
              class="carousel-slide"
            >
              <div class="bg-text">VANS</div>

              <div class="slide-grid container">
                <div class="hero-info">
                  <span class="hero-tag">CLASSIC REBORN 2025</span>
                  <h1 class="hero-title">{{ banner.name }}</h1>
                  <p class="hero-desc">
                    The original skate shoe since 1966. Redefined for the modern
                    street culture with upgraded comfort.
                  </p>
                  <div class="hero-price-row">
                    <span class="hero-price">{{ formatPrice(banner.price) }}</span>
                    <BaseButton
                      variant="primary"
                      size="lg"
                      @click="goToDetail(banner.id)"
                      class="btn-vans-hero"
                    >
                      SHOP NOW
                    </BaseButton>
                  </div>
                </div>

                <div class="hero-image-container">
                  <div class="image-bg-circle"></div>
                  <img
                    :src="banner.image"
                    :alt="banner.name"
                    class="hero-image"
                  />
                </div>
              </div>
            </div>
          </transition-group>

          <div class="carousel-controls container">
            <div class="slide-indicators">
              <div
                v-for="(_, i) in bannerProducts"
                :key="i"
                class="progress-bar"
                :class="{ active: currentSlide === i }"
                @click="currentSlide = i"
              >
                <div class="fill"></div>
              </div>
            </div>
            <div class="nav-arrows">
              <button @click="prevSlide" class="nav-btn">
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <button @click="nextSlide" class="nav-btn">
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="product-section container">
        <div class="vans-divider">
          <h5 class="modal-title-vans">Popular items</h5>
          <router-link to="/products" class="vans-switch-link">See all</router-link>
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
              <img :src="product.image" :alt="product.name" class="vans-img-zoom" />
            </div>
            <div class="product-info">
              <p class="vans-price-tag">{{ formatPrice(product.price) }}</p>
              <p class="vans-product-title">{{ product.name }}</p>
              <div class="product-meta">
                <span>{{ product.size }}</span>
                <span class="likes-count">
                  <i class="fa-regular fa-heart"></i> {{ product.likes || 0 }}
                </span>
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
          <router-link to="/products" class="vans-switch-link">See all</router-link>
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
              <img :src="product.image" :alt="product.name" class="vans-img-zoom" />
            </div>
            <div class="product-info">
              <p class="vans-price-tag">{{ formatPrice(product.price) }}</p>
              <p class="vans-product-title">{{ product.name }}</p>
              <div class="product-meta">
                <span>{{ product.size }}</span>
                <span class="likes-count">
                  <i class="fa-regular fa-heart"></i> {{ product.likes || 0 }}
                </span>
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
      // State untuk Carousel
      currentSlide: 0,
      slideInterval: null,
      categories: ["Shoes", "Apparel", "Accessories", "Classic", "Skate"],
    };
  },
  computed: {
    // Mengambil 3 produk pertama untuk banner
    bannerProducts() {
      return this.allProducts.slice(0, 3);
    },
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
    // Method navigasi Carousel
    nextSlide() {
      if (this.bannerProducts.length) {
        this.currentSlide = (this.currentSlide + 1) % this.bannerProducts.length;
      }
    },
    prevSlide() {
      if (this.bannerProducts.length) {
        this.currentSlide =
          (this.currentSlide - 1 + this.bannerProducts.length) %
          this.bannerProducts.length;
      }
    },
  },
  mounted() {
    this.fetchProducts();
    // Auto slide setiap 6 detik
    this.slideInterval = setInterval(this.nextSlide, 6000);
  },
  beforeUnmount() {
    // Bersihkan interval saat pindah halaman
    clearInterval(this.slideInterval);
  },
};
</script>

<style scoped>
/* HERO SECTION STYLES */
.hero-section {
  height: 550px;
  background: #f4f4f4; /* var(--vans-gray-light) */
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
}
.carousel-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}
.carousel-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}
.bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.03);
  z-index: 0;
  pointer-events: none;
}
.slide-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  position: relative;
  z-index: 2;
  gap: 40px;
}
.hero-tag {
  color: #c8102e; /* var(--vans-red) */
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 14px;
  margin-bottom: 10px;
  display: block;
}
.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 20px;
  text-transform: uppercase;
}
.hero-desc {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 450px;
}
.hero-price-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hero-price {
  font-size: 24px;
  font-weight: 900;
}
.btn-vans-hero {
  min-width: 200px;
}
.hero-image-container {
  position: relative;
  display: flex;
  justify-content: center;
}
.image-bg-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  background: #fff;
  border-radius: 50%;
  z-index: -1;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
.hero-image {
  width: 100%;
  transform: rotate(-15deg);
  filter: drop-shadow(20px 30px 20px rgba(0, 0, 0, 0.1));
}

/* CONTROLS */
.carousel-controls {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}
.slide-indicators {
  display: flex;
  gap: 10px;
}
.progress-bar {
  width: 40px;
  height: 4px;
  background: #ddd;
  cursor: pointer;
}
.progress-bar.active .fill {
  width: 100%;
  background: #c8102e;
  height: 100%;
  transition: width 6s linear;
}
.nav-arrows {
  display: flex;
  gap: 10px;
}
.nav-btn {
  background: #000;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.3s;
}
.nav-btn:hover {
  background: #c8102e;
}

/* TRANSITION FADE */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s, transform 0.8s;
}
.fade-enter-from { opacity: 0; transform: scale(1.05); }
.fade-leave-to { opacity: 0; }

/* KODE LAMA ANDA (TIDAK BERUBAH) */
.product-section { margin-bottom: 80px; }
.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  font-weight: 700;
}
.likes-count i { color: #c8102e; }
.see-all-card {
  background-color: #fce8e8;
  border: 2px dashed #c8102e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: pointer;
  transition: 0.3s;
}
.see-all-card:hover { background-color: #fbdada; }
.see-all-text {
  color: #c8102e;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
}
.brand-section { margin-bottom: 80px; }
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
  color: #ccc;
}

@media (max-width: 1024px) {
  .hero-image-container { display: none; }
  .slide-grid { grid-template-columns: 1fr; }
}
</style>