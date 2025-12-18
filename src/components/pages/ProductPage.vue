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
      <div class="loader"></div>
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
            <svg viewBox="0 0 24 24" :fill="product.isWishlisted ? 'currentColor' : 'none'">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <div class="product-info">
          <p class="product-price">{{ formatPrice(product.price) }}</p>
          <p class="product-name">{{ product.name }}</p>
          <div class="product-meta">
            <span class="meta-item"><i class="fa-regular fa-heart"></i> {{ product.likes || 0 }}</span>
            <span class="meta-item">{{ product.size }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h2>Product not found</h2>
      <p>Try using another keyword or brand.</p>
      <button class="reset-btn" @click="resetSearch">Reset Search</button>
    </div>
  </main>
</template>

<script>
import { rtdb } from '@/firebase/config'; 
import { ref as dbRef, get, child, set, push, remove } from 'firebase/database';

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
      
      if (this.sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === 'newest') {
        result.reverse();
      }
      return result;
    }
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        // Ambil data wishlist dulu untuk sinkronisasi ikon hati
        const wishlistSnapshot = await get(child(dbRef(rtdb), 'wishlists'));
        const activeWishlists = wishlistSnapshot.exists() ? wishlistSnapshot.val() : {};

        // Ambil data produk
        const snapshot = await get(child(dbRef(rtdb), 'products'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.products = Object.keys(data).map(key => {
            // Cek apakah produk ini ada di wishlist
            const wishlistKey = Object.keys(activeWishlists).find(
              wKey => activeWishlists[wKey].productId === key
            );

            return {
              id: key,
              ...data[key],
              price: Number(data[key].price),
              isWishlisted: !!wishlistKey,
              wishlistKey: wishlistKey || null
            };
          });
        }
      } catch (error) {
        // Fail silently
      } finally {
        this.isLoading = false;
      }
    },

    async toggleWishlist(id) {
      const product = this.products.find(p => p.id === id);
      if (!product) return;

      const wishlistRef = dbRef(rtdb, 'wishlists');

      try {
        if (product.isWishlisted) {
          // Hapus dari Firebase
          await remove(child(wishlistRef, product.wishlistKey));
          product.isWishlisted = false;
          product.wishlistKey = null;
        } else {
          // Tambah ke Firebase
          const newWishRef = push(wishlistRef);
          await set(newWishRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            addedAt: new Date().toISOString()
          });
          product.isWishlisted = true;
          product.wishlistKey = newWishRef.key;
        }
      } catch (error) {
        // Fail silently
      }
    },

    formatPrice(price) {
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },
    handleProductClick(id) {
      this.$router.push(`/products/${id}`);
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
.products-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header & Sorting */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.products-title { font-size: 24px; font-weight: 600; }
.sort-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

/* Grid Layout seragam sesuai desain */
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 1200px) { .products-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }

/* Product Card */
.product-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
}
.product-card:hover { transform: translateY(-4px); }

/* Image Container dengan Aspect Ratio */
.product-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f5;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Wishlist Button */
.wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  color: #ccc;
  transition: 0.2s;
}
.wishlist-btn.active { color: #ff4d4d; }
.wishlist-btn svg { width: 18px; height: 18px; stroke: currentColor; stroke-width: 2; }

/* Product Info */
.product-info {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.product-price { font-weight: 700; color: #008284; margin-bottom: 4px; }
.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 34px;
}
.product-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

/* Loading & Empty State */
.loading-state, .empty-state { text-align: center; padding: 100px 0; }
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #008284;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.reset-btn {
  margin-top: 15px;
  padding: 10px 25px;
  background: #008284;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>