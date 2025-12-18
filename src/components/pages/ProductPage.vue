<template>
  <main class="products-container">
    <div class="products-header">
      <h1 class="products-title">Items</h1>
      <div class="sort-wrapper">
        <select v-model="sortBy" class="sort-select">
          <option value="default">All Items</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Loading products...</p>
    </div>

    <div v-else-if="filteredProducts.length" class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        @click="handleProductClick(product.id)"
      >
        <div class="product-image-container">
          <img :src="product.image" :alt="product.name" class="product-image" />
          <button
            class="wishlist-btn"
            :class="{ active: product.isWishlisted }"
            @click.stop="toggleWishlist(product.id)"
          >
            <svg viewBox="0 0 24 24" :fill="product.isWishlisted ? 'currentColor' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <div class="product-info">
          <p class="product-price">{{ formatPrice(product.price) }}</p>
          <p class="product-name">{{ product.name }}</p>
          <div class="product-meta">
            <span>{{ product.likes || 0 }} likes</span>
            <span>{{ product.size }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h2>Product not found</h2>
      <button class="reset-btn" @click="resetSearch">Reset</button>
    </div>
  </main>
</template>

<script>
// PERBAIKAN IMPORT: Sesuaikan dengan struktur folder di VS Code Anda
import { rtdb } from '@/firebase/config'; 
import { ref as dbRef, get, child } from 'firebase/database';

export default {
  name: 'ProductsPage',
  data() {
    return {
      sortBy: 'default',
      products: [],
      isLoading: true
    };
  },
  computed: {
    searchQuery() {
      return (this.$route.query.search || '').trim().toLowerCase();
    },
    brandFilter() {
      return (this.$route.query.brand || '').toLowerCase();
    },
    filteredProducts() {
      let result = [...this.products];
      if (this.searchQuery) {
        result = result.filter(p => p.name.toLowerCase().includes(this.searchQuery));
      }
      if (this.brandFilter) {
        result = result.filter(p => p.brand && p.brand.toLowerCase() === this.brandFilter);
      }
      if (this.sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
      else if (this.sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
      else if (this.sortBy === 'newest') result.reverse();
      return result;
    }
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        const snapshot = await get(child(dbRef(rtdb), 'products'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.products = Object.keys(data).map(key => ({
            id: key,
            ...data[key],
            price: Number(data[key].price), // Paksa jadi number untuk sorting
            isWishlisted: false
          }));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },
    handleProductClick(id) {
      this.$router.push(`/products/${id}`);
    },
    toggleWishlist(id) {
      const product = this.products.find(p => p.id === id);
      if (product) product.isWishlisted = !product.isWishlisted;
    },
    resetSearch() {
      this.$router.push({ path: '/products', query: {} });
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
/* Tambahkan sedikit styling untuk loader agar user nyaman menunggu */
.loading-state {
  text-align: center;
  padding: 50px;
  color: #666;
}
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;
  margin: 0 auto 15px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Sisa CSS Anda tetap sama di bawah sini */
</style>