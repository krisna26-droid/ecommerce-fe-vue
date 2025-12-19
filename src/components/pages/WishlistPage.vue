<template>
  <div class="wishlist-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Favorite items</h1>
        <div v-if="!isLoading" class="item-badge">{{ wishlistItems.length }} Items</div>
        <div v-else class="skeleton skeleton-badge"></div>
      </header>

      <div v-if="isLoading" class="wishlist-grid">
        <div v-for="i in 6" :key="'skel-' + i" class="product-card">
          <div class="image-wrapper skeleton"></div>
          <div class="card-content">
            <div class="skeleton skeleton-price"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="meta-row">
              <div class="skeleton skeleton-text" style="width: 40px;"></div>
              <div class="skeleton skeleton-text" style="width: 30px;"></div>
            </div>
            <div class="skeleton skeleton-button"></div>
          </div>
        </div>
      </div>

      <div v-else-if="wishlistItems.length > 0" class="wishlist-grid">
        <div v-for="item in wishlistItems" :key="item.wishlistId" class="product-card">
          <div class="image-wrapper" @click="goToDetail(item.productId)">
            <img :src="item.image" :alt="item.name" class="product-img" />
            <button class="btn-remove-overlay" @click.stop="removeFromWishlist(item.wishlistId)">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div class="card-content">
            <div class="price-header">
              <span class="product-price">{{ formatPrice(item.price) }}</span>
            </div>
            
            <h3 class="product-title" @click="goToDetail(item.productId)">
              {{ item.name }}
            </h3>
            
            <div class="item-footer">
              <div class="meta-row">
                <span class="product-meta">{{ item.size || 'S / M' }}</span>
                <div class="wishlist-indicator">
                  <i class="fa-solid fa-heart active"></i>
                  <span class="count">12</span>
                </div>
              </div>

              <div class="action-buttons">
                <button class="btn-cart" @click="moveToCart(item)">
                  <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="info-card-empty">
          <div class="illustration">
            <div class="folder-icon">
              <i class="fa-solid fa-heart"></i>
            </div>
          </div>
          <h2 class="title">No favorite items yet</h2>
          <p class="description">
            When you add an item to favorites, it will appear on this list.
          </p>
          <router-link to="/products" class="btn-browse">
            Find Products
          </router-link>
        </div>
      </div>
    </div>

    <AddToCartModal 
      :show="showCartModal" 
      :productName="selectedProductName" 
      @close="showCartModal = false" 
    />
  </div>
</template>

<script>
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child, remove, push, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddToCartModal from '@/components/modals/AddToCartModal.vue';

export default {
  name: 'WishlistPage',
  components: { AddToCartModal },
  data() {
    return {
      wishlistItems: [],
      isLoading: true,
      showCartModal: false,
      selectedProductName: '',
      currentUser: null
    };
  },
  methods: {
    async fetchWishlist() {
      if (!this.currentUser) return; 
      
      this.isLoading = true;
      try {
        const snapshot = await get(child(dbRef(rtdb), `wishlists/${this.currentUser.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.wishlistItems = Object.keys(data).map(key => ({
            wishlistId: key,
            ...data[key]
          }));
        } else {
          this.wishlistItems = [];
        }
      } catch (error) {
        console.error("Fetch wishlist failed:", error);
      } finally {
        setTimeout(() => { this.isLoading = false; }, 800);
      }
    },

    async removeFromWishlist(id) {
      if (!this.currentUser) return;
      if (confirm("Remove this item from your favorites?")) {
        try {
          await remove(dbRef(rtdb, `wishlists/${this.currentUser.uid}/${id}`));
          this.wishlistItems = this.wishlistItems.filter(item => item.wishlistId !== id);
        } catch (error) {
          console.error("Remove failed:", error);
        }
      }
    },

    async moveToCart(item) {
      if (!this.currentUser) {
        alert("Please login first");
        return;
      }
      try {
        const cartRef = dbRef(rtdb, `carts/${this.currentUser.uid}`);
        const newCartItemRef = push(cartRef);
        await set(newCartItemRef, {
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size || 'M',
          qty: 1,
          addedAt: new Date().toISOString()
        });
        this.selectedProductName = item.name;
        this.showCartModal = true;
      } catch (error) {
        console.error("Add to cart failed:", error);
      }
    },

    formatPrice(price) {
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },

    goToDetail(productId) {
      this.$router.push(`/products/${productId}`);
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (user) {
        this.fetchWishlist();
      } else {
        this.isLoading = false;
        this.wishlistItems = [];
      }
    });
  }
};
</script>

<style scoped>
/* 1. LAYOUT & CONTAINER */
.wishlist-page { background: #fff; padding: 40px 0; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* 2. HEADER SECTION */
.page-header { 
  display: flex; justify-content: space-between; align-items: center; 
  margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; 
}
.page-title { 
  font-size: 24px; 
  font-weight: 800; 
  text-transform: uppercase; 
  color: #000; 
}
.item-badge { 
  border: 2px solid #000; 
  padding: 4px 12px; 
  border-radius: 4px; 
  font-size: 13px; 
  font-weight: 700;
  color: #000; 
}

/* 3. PRODUCT GRID */
.wishlist-grid { 
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; align-items: stretch; 
}
@media (max-width: 1200px) { .wishlist-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr); } }

/* 4. PRODUCT CARD & HOVER EFFECTS */
.product-card { 
  display: flex; 
  flex-direction: column; 
  height: 100%; 
  transition: transform 0.3s ease;
}
.product-card:hover { transform: translateY(-8px); }

.image-wrapper { 
  position: relative; cursor: pointer; aspect-ratio: 1/1; border-radius: 4px; 
  overflow: hidden; background: #f5f5f5; 
}
.product-img { 
  width: 100%; height: 100%; object-fit: cover; 
  transition: transform 0.5s ease;
}
.product-card:hover .product-img { transform: scale(1.1); }

.btn-remove-overlay { 
  position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; 
  background: #000; color: #fff; border: none; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; font-size: 14px;
  cursor: pointer; z-index: 2;
}
.btn-remove-overlay:hover { background: #C41230; }

/* 5. CARD CONTENT */
.card-content { padding: 12px 0; display: flex; flex-direction: column; flex-grow: 1; }

.product-price { 
  font-size: 15px; 
  font-weight: 800; 
  color: #C41230; /* Vans Red */
  margin-bottom: 4px; 
}

.product-title { 
  font-size: 14px; 
  font-weight: 700;
  color: #000; 
  margin-bottom: 10px; 
  min-height: 34px;
  display: -webkit-box; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  cursor: pointer;
}
.product-title:hover { color: #C41230; }

.item-footer { margin-top: auto; }

.meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.product-meta { font-size: 12px; font-weight: 500; color: #666; }

.wishlist-indicator { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666; }
.wishlist-indicator i.active { color: #C41230; }

/* 6. ACTION BUTTONS */
.btn-cart { 
  width: 100%; padding: 10px; background: transparent; border: 2px solid #000; 
  color: #000; border-radius: 4px; font-weight: 800; font-size: 12px; 
  text-transform: uppercase; cursor: pointer; transition: all 0.2s;
}
.btn-cart:hover { background: #000; color: white; }

/* 7. EMPTY STATE - Tema Vans Red */
.empty-state { display: flex; justify-content: center; align-items: center; padding: 100px 0; }
.info-card-empty { text-align: center; max-width: 400px; }

.illustration { margin-bottom: 25px; display: flex; justify-content: center; }
.folder-icon { 
  width: 100px; height: 75px; background-color: #C41230; border-radius: 8px; 
  position: relative; display: flex; justify-content: center; align-items: center; 
}
.folder-icon::before { 
  content: ''; position: absolute; top: -10px; left: 0; width: 35px; height: 10px; 
  background-color: #C41230; border-radius: 4px 4px 0 0; 
}
.folder-icon i { color: #fff; font-size: 30px; }

.title { font-size: 24px; font-weight: 800; color: #000; text-transform: uppercase; margin-bottom: 12px; }
.description { font-size: 14px; color: #444; line-height: 1.5; margin-bottom: 30px; font-weight: 500; }

.btn-browse { 
  display: inline-block; background-color: #000; color: white; padding: 14px 40px; 
  border-radius: 4px; text-decoration: none; font-weight: 800; font-size: 14px; 
  text-transform: uppercase; transition: background 0.2s;
}
.btn-browse:hover { background-color: #C41230; }

/* 8. SKELETON ANIMATION */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #fce8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite linear;
  border-radius: 4px;
}
@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.skeleton-badge { width: 60px; height: 25px; }
.skeleton-price { width: 80px; height: 18px; margin-bottom: 10px; }
.skeleton-title { width: 100%; height: 14px; margin-bottom: 8px; }
.skeleton-text { height: 12px; }
.skeleton-button { width: 100%; height: 32px; margin-top: 10px; }
</style>