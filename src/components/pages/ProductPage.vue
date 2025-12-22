<template>
  <main class="products-container">
    <div class="products-header">
      <h1 class="products-title">Vans Collections</h1>
      <div class="sort-wrapper">
        <select v-model="sortBy" class="sort-select">
          <option value="default">All Items</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="products-grid">
      <div v-for="n in 12" :key="n" class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-info">
          <div class="skeleton-text price"></div>
          <div class="skeleton-text title"></div>
          <div class="skeleton-footer">
            <div class="skeleton-text small"></div>
            <div class="skeleton-text small"></div>
          </div>
        </div>
      </div>
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
            <svg
              viewBox="0 0 24 24"
              :fill="product.isWishlisted ? 'currentColor' : 'none'"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
        </div>

        <div class="product-info">
          <p class="product-price">{{ formatPrice(product.price) }}</p>
          <p class="product-name">{{ product.name }}</p>
          <div class="product-meta">
            <span class="meta-item"
              ><i class="fa-regular fa-heart"></i>
              {{ product.likes || 0 }}</span
            >
            <span class="meta-item">{{ product.size }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="not-found-illustration">
        <div class="bag-icon">
          <div class="bag-handle"></div>
          <div class="bag-body">
            <div class="x-mark">
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
        </div>
      </div>
      <h2 class="empty-title">Product not found</h2>
      <p class="empty-description">
        We cannot find what you looking for, try to use other keywords or reset
        keyword.
      </p>
      <button class="reset-btn" @click="resetSearch">Reset Keyword</button>
    </div>
  </main>
</template>

<script>
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, child, set, push, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "ProductsPage",
  data() {
    return {
      sortBy: "default",
      products: [],
      isLoading: true,
      currentUser: null,
    };
  },
  computed: {
    searchQuery() {
      return (this.$route.query.search || "").trim().toLowerCase();
    },
    categoryFilter() {
      return (this.$route.query.category || "").toLowerCase();
    },
    filteredProducts() {
      let result = [...this.products];
      if (this.searchQuery) {
        result = result.filter((p) =>
          p.name.toLowerCase().includes(this.searchQuery)
        );
      }
      if (this.categoryFilter) {
        result = result.filter(
          (p) => p.category && p.category.toLowerCase() === this.categoryFilter
        );
      }

      if (this.sortBy === "price-low") {
        result.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === "price-high") {
        result.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === "newest") {
        result.reverse();
      }
      return result;
    },
  },
  methods: {
    async fetchProducts() {
      this.isLoading = true;
      try {
        let activeWishlists = {};
        if (this.currentUser) {
          const wishlistSnapshot = await get(
            child(dbRef(rtdb), `wishlists/${this.currentUser.uid}`)
          );
          activeWishlists = wishlistSnapshot.exists()
            ? wishlistSnapshot.val()
            : {};
        }

        const snapshot = await get(child(dbRef(rtdb), "products"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.products = Object.keys(data).map((key) => {
            const wishlistKey = Object.keys(activeWishlists).find(
              (wKey) => activeWishlists[wKey].productId === key
            );
            return {
              id: key,
              ...data[key],
              price: Number(data[key].price),
              isWishlisted: !!wishlistKey,
              wishlistKey: wishlistKey || null,
            };
          });
        }
      } catch (error) {
        console.error("Fetch products failed:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async toggleWishlist(id) {
      if (!this.currentUser) {
        alert("Please login to manage your wishlist");
        return;
      }
      const product = this.products.find((p) => p.id === id);
      if (!product) return;
      const userWishlistRef = dbRef(rtdb, `wishlists/${this.currentUser.uid}`);
      try {
        if (product.isWishlisted) {
          await remove(child(userWishlistRef, product.wishlistKey));
          product.isWishlisted = false;
          product.wishlistKey = null;
        } else {
          const newWishRef = push(userWishlistRef);
          await set(newWishRef, {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            addedAt: new Date().toISOString(),
          });
          product.isWishlisted = true;
          product.wishlistKey = newWishRef.key;
        }
      } catch (error) {
        console.error("Wishlist operation failed:", error);
      }
    },
    formatPrice(price) {
      return `Rp${Number(price).toLocaleString("id-ID")}`;
    },
    handleProductClick(id) {
      this.$router.push(`/products/${id}`);
    },
    resetSearch() {
      this.$router.push({ path: "/products", query: {} });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.fetchProducts();
    });
  },
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
.products-title {
  font-size: 24px;
  font-weight: 800;
  text-transform: uppercase;
  color: #000;
}
.sort-select {
  padding: 8px 12px;
  border: 2px solid #000;
  border-radius: 4px;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}
.sort-select:focus {
  border-color: #c41230;
}

/* Grid Layout */
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Product Card */
.product-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-8px);
}

.product-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1/1;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f5;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #ccc;
  transition: 0.2s;
}
.wishlist-btn.active {
  color: #c41230;
}
.wishlist-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
}

.product-info {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
/* Harga Produk: Vans Red */
.product-price {
  font-weight: 800;
  color: #c41230;
  margin-bottom: 4px;
  font-size: 15px;
}
.product-name {
  font-size: 14px;
  color: #000;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 34px;
}
.product-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* SKELETON ANIMATION STYLE */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.skeleton-image,
.skeleton-text {
  background: #eee;
  background: linear-gradient(90deg, #f0f0f0 25%, #fce8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 4px;
}

.skeleton-info {
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-text {
  height: 14px;
  border-radius: 4px;
}

.skeleton-text.price {
  width: 60%;
  height: 18px;
}
.skeleton-text.title {
  width: 90%;
  height: 14px;
}
.skeleton-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}
.skeleton-text.small {
  width: 30%;
  height: 10px;
}

/* EMPTY STATE DESIGN: Vans Red & Black */
.empty-state {
  text-align: center;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.not-found-illustration {
  margin-bottom: 30px;
}

.bag-icon {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bag-handle {
  width: 40px;
  height: 25px;
  border: 5px solid #000;
  border-bottom: none;
  border-radius: 20px 20px 0 0;
}

.bag-body {
  width: 80px;
  height: 70px;
  background-color: #c41230; /* Vans Red */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.x-mark {
  width: 35px;
  height: 35px;
  background-color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.empty-title {
  font-size: 24px;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.empty-description {
  font-size: 16px;
  color: #444;
  max-width: 420px;
  line-height: 1.5;
  margin-bottom: 30px;
}

.reset-btn {
  background-color: #000;
  color: white;
  padding: 12px 40px;
  border: none;
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.reset-btn:hover {
  background-color: #c41230;
  transform: translateY(-2px);
}
</style>
