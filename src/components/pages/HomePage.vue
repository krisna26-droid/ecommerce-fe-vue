<template>
  <div class="homepage">
    <main class="main-content">
      
      <section class="hero-section">
        <img src="@/assets/images/hero/banner.png" alt="Hero Banner" class="hero-image" />
        <div class="hero-overlay">
          <div class="hero-card">
            <h1 class="hero-title">Ready to declutter your closet?</h1>
            <BaseButton variant="primary" size="lg" @click="handleShopNow">
              Shop Now
            </BaseButton>
          </div>
        </div>
      </section>

      <section class="product-section">
        <div class="section-header">
          <h5 class="section-title">Popular Items</h5>
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
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            <p class="product-description">{{ product.name }}</p>
            <p class="product-size">{{ product.size }}</p>
          </div>

          <div class="see-all-card-wrapper">
            <div class="see-all-card">
              <router-link to="/products" class="see-all-btn">See All Popular Product</router-link>
            </div>
          </div>
        </div>
      </section>

      <section class="brand-section">
        <h5 class="section-title">Shop by Brand</h5>
        <div class="brand-buttons">
          <BaseButton 
            v-for="brand in brands" 
            :key="brand" 
            variant="outline" 
            size="sm"
            @click="filterByBrand(brand)"
          >
            {{ brand }}
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
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            <p class="product-description">{{ product.name }}</p>
            <p class="product-size">{{ product.size }}</p>
          </div>

          <div class="see-all-card-wrapper">
            <div class="see-all-card">
              <router-link to="/products" class="see-all-btn">See All New Product</router-link>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script>
// Gabungkan semua import di bagian paling atas
import BaseButton from '../ui/BaseButton.vue';
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child } from 'firebase/database';
import { seedProducts } from '@/firebase/seeder'; // Import seeder

export default {
  name: 'HomePage',
  components: {
    BaseButton
  },
  data() {
    return {
      allProducts: [],
      isLoading: true,
      brands: ['Vans', 'Bohos', 'Mango', 'Reebok', 'Converse', 'Sandtro', 'Nike', 'Adidas', 'Dior', 'Puma', 'Zara', 'Bershka', 'American Eagle']
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
      if (!price) return 'Rp0';
      return `Rp${price.toLocaleString('id-ID')}`;
    },
    handleShopNow() {
      this.$router.push('/products');
    },
    filterByBrand(brand) {
      this.$router.push({ path: '/products', query: { brand: brand } });
    },
    goToDetail(id) {
      this.$router.push(`/products/${id}`);
    }
  },
  async mounted() {
    // 1. Jalankan seeder (HANYA SEKALI SAAT PERTAMA KALI)
    // await seedProducts(); 
    
    // 2. Ambil data untuk ditampilkan
    this.fetchProducts();
  }
}
</script>

<style scoped>
.loading-placeholder {
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
}
</style>