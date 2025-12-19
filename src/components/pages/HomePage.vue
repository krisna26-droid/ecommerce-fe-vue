<template>
  <div class="homepage">
    <main class="main-content">
      
      <section class="hero-section">
        <img src="@/assets/images/hero/banner.jpg" alt="Vans Off The Wall" class="hero-image" />
        <div class="hero-overlay">
          <div class="hero-card">
            <h1 class="hero-title">Ready to kick it "Off The Wall"?</h1>
            <BaseButton variant="primary" size="lg" @click="handleShopNow" class="btn-vans">
              Shop Now
            </BaseButton>
          </div>
        </div>
      </section>

      <section class="product-section">
        <div class="section-header">
          <h5 class="section-title">Popular items</h5>
          <router-link to="/products" class="see-all-link">See all</router-link>
        </div>

        <div v-if="isLoading" class="loading-placeholder">Loading items...</div>
        
        <div v-else class="product-grid">
          <div 
            v-for="product in popularProducts" 
            :key="product.id" 
            class="product-card"
            @click="goToDetail(product.id)"
          >
            <div class="product-image-wrapper">
              <img :src="product.image" :alt="product.name" class="product-img">
            </div>
            <div class="product-info">
              <p class="product-price">{{ formatPrice(product.price) }}</p>
              <p class="product-name">{{ product.name }}</p>
              <div class="product-meta">
                <span>{{ product.size }}</span>
                <span class="likes-count"><i class="fa-regular fa-heart"></i> {{ product.likes || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="see-all-card-wrapper">
            <div class="see-all-card" @click="handleShopNow">
              <p class="see-all-text">See All Product</p>
            </div>
          </div>
        </div>
      </section>

      <section class="brand-section">
        <h5 class="section-title">Shop by Category</h5>
        <div class="brand-buttons">
          <BaseButton 
            v-for="category in categories" 
            :key="category" 
            variant="outline" 
            size="sm"
            class="category-pill"
            @click="filterByCategory(category)"
          >
            {{ category }}
          </BaseButton>
        </div>
      </section>
      
      <section class="product-section">
        <div class="section-header">
          <h5 class="section-title">New Product</h5>
          <router-link to="/products" class="see-all-link">See all</router-link>
        </div>

        <div v-if="isLoading" class="loading-placeholder">Loading items...</div>

        <div v-else class="product-grid">
          <div 
            v-for="product in newProducts" 
            :key="product.id" 
            class="product-card"
            @click="goToDetail(product.id)"
          >
            <div class="product-image-wrapper">
              <img :src="product.image" :alt="product.name" class="product-img">
            </div>
            <div class="product-info">
              <p class="product-price">{{ formatPrice(product.price) }}</p>
              <p class="product-name">{{ product.name }}</p>
              <div class="product-meta">
                <span>{{ product.size }}</span>
                <span class="likes-count"><i class="fa-regular fa-heart"></i> {{ product.likes || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="see-all-card-wrapper">
            <div class="see-all-card" @click="handleShopNow">
              <p class="see-all-text">See All New Product</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
import BaseButton from '../ui/BaseButton.vue';
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child } from 'firebase/database';

export default {
  name: 'HomePage',
  components: { BaseButton },
  data() {
    return {
      allProducts: [],
      isLoading: true,
      categories: ['Shoes', 'Apparel', 'Accessories', 'Classic', 'Skate'],
    }
  },
  computed: {
    popularProducts() {
      return this.allProducts.slice(0, 5);
    },
    newProducts() {
      return [...this.allProducts].reverse().slice(0, 5);
    }
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        const snapshot = await get(child(dbRef(rtdb), 'products'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.allProducts = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            price: Number(data[key].price)
          }));
        }
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        this.isLoading = false;
      }
    },
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },
    handleShopNow() {
      this.$router.push('/products');
    },
    // Fungsi ini sekarang mengirimkan query category ke All Products
    filterByCategory(category) {
      this.$router.push({ 
        path: '/products', 
        query: { category: category } 
      });
    },
    goToDetail(id) {
      this.$router.push(`/products/${id}`);
    }
  },
  async mounted() {
    this.fetchProducts();
  }
}
</script>

<style scoped>
.homepage {
  background-color: #ffffff;
}

.hero-section {
  height: 450px;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 60px;
}

.hero-card {
  background: white;
  padding: 32px;
  border-radius: 4px;
  max-width: 350px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.hero-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  line-height: 1.2;
}

.btn-vans {
  background-color: #C41230 !important; /* Warna Merah Vans */
  color: white;
  border: none;
  width: 100%;
}

.product-section {
  margin-bottom: 60px;
  padding: 0 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
}

.see-all-link {
  color: #C41230; /* Link Merah Vans */
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.product-card {
  cursor: pointer;
}

.product-image-wrapper {
  background-color: #f8f9fa;
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  margin-bottom: 10px;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-price {
  font-weight: 700;
  color: #C41230; /* Harga Merah */
  font-size: 15px;
}

.product-name {
  font-size: 13px;
  color: #4b5563;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}

.likes-count i {
  font-size: 11px;
  color: #C41230;
}

.see-all-card-wrapper {
  display: flex;
}

.see-all-card {
  width: 100%;
  background-color: #fce8e8; /* Merah Muda Vans */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.see-all-card:hover {
  background-color: #f8d4d4;
}

.see-all-text {
  color: #C41230;
  font-weight: 600;
  font-size: 14px;
}

.brand-section {
  padding: 0 60px;
  margin-bottom: 60px;
}

.brand-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.category-pill {
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  background: white;
  padding: 6px 16px;
  font-size: 13px;
}

.category-pill:hover {
  border-color: #C41230 !important;
  color: #C41230 !important;
}

.loading-placeholder {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}

.product-card {
  cursor: pointer;
  /* Tambahkan transisi halus untuk bayangan */
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px;
}

/* Efek Hover pada Kartu Produk */
.product-card:hover {
  transform: translateY(-8px); /* Mengangkat kartu sedikit ke atas */
  box-shadow: 0 10px 20px rgba(196, 18, 48, 0.1); /* Bayangan merah tipis Vans */
}

.product-image-wrapper {
  background-color: #f8f9fa;
  border-radius: 8px;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  margin-bottom: 10px;
  /* Pastikan wrapper meng-clip gambar saat membesar */
  position: relative;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Transisi halus untuk perbesaran gambar */
  transition: transform 0.5s ease;
}

/* Efek Hover pada Gambar (Zoom In) */
.product-card:hover .product-img {
  transform: scale(1.1); /* Gambar membesar sedikit */
}

/* See All Link Hover */
.see-all-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}

/* Tombol Category Hover - Sudah ada di kode Anda, diperhalus sedikit */
.category-pill {
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  color: #4b5563;
  background: white;
  padding: 6px 16px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.category-pill:hover {
  border-color: #C41230 !important;
  color: #C41230 !important;
  background-color: #fce8e8; /* Background merah muda tipis saat hover */
}
</style>