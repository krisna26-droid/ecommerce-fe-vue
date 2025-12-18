<template>
  <div class="wishlist-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Favorite items</h1>
        <div class="item-badge">{{ wishlistItems.length }} Items</div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
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
            <div class="price-row">
              <span class="product-price">{{ formatPrice(item.price) }}</span>
            </div>
            
            <h3 class="product-name" @click="goToDetail(item.productId)">
              {{ item.name }}
            </h3>
            
            <div class="bottom-info">
              <div class="meta-row">
                <span class="product-meta">{{ item.size || 'S / M' }}</span>
                <div class="wishlist-indicator">
                  <i class="fa-solid fa-heart heart-active"></i>
                  <span class="like-count">12</span>
                </div>
              </div>

              <div class="action-row">
                <button class="btn-add-cart" @click="moveToCart(item)">
                  <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-content-card">
          <div class="empty-illustration">
            <div class="folder-icon">
              <i class="fa-solid fa-heart"></i>
            </div>
          </div>
          <h2 class="empty-title">No favorite items yet</h2>
          <p class="empty-description">
            When add item to favorite, the item will appear on the favorite list.
          </p>
          <router-link to="/products" class="btn-find-products">
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
import AddToCartModal from '@/components/modals/AddToCartModal.vue';

export default {
  name: 'WishlistPage',
  components: { AddToCartModal },
  data() {
    return {
      wishlistItems: [],
      isLoading: true,
      showCartModal: false,
      selectedProductName: ''
    };
  },
  methods: {
    async fetchWishlist() {
      this.isLoading = true;
      try {
        const snapshot = await get(child(dbRef(rtdb), 'wishlists'));
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
        // Error handling silent
      } finally {
        this.isLoading = false;
      }
    },

    async removeFromWishlist(id) {
      if (confirm("Remove this item from your favorites?")) {
        try {
          await remove(dbRef(rtdb, `wishlists/${id}`));
          this.wishlistItems = this.wishlistItems.filter(item => item.wishlistId !== id);
        } catch (error) {
          // Error handling silent
        }
      }
    },

    async moveToCart(item) {
      try {
        const cartRef = dbRef(rtdb, 'carts');
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
        // Error handling silent
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
    this.fetchWishlist();
  }
};
</script>

<style scoped>
.wishlist-page { padding: 40px 0; background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Header Styling */
.page-header { 
  display: flex; justify-content: space-between; align-items: center; 
  margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px; 
}
.page-title { font-size: 22px; font-weight: 500; color: #333; }
.item-badge { border: 1px solid #ddd; padding: 4px 12px; border-radius: 4px; font-size: 13px; color: #666; }

/* Grid Layout */
.wishlist-grid { 
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 15px; align-items: stretch; 
}
@media (max-width: 1200px) { .wishlist-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr); } }

/* Card Styling */
.product-card { display: flex; flex-direction: column; height: 100%; }
.image-wrapper { 
  position: relative; cursor: pointer; aspect-ratio: 3/4; border-radius: 4px; 
  overflow: hidden; background: #f5f5f5; 
}
.product-img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove-overlay { 
  position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; 
  background: rgba(255,255,255,0.8); border: none; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; font-size: 12px;
}

.card-content { padding: 10px 0; display: flex; flex-direction: column; flex-grow: 1; }
.product-price { font-size: 14px; font-weight: 700; color: #008284; margin-bottom: 4px; }
.product-name { 
  font-size: 13px; color: #333; margin-bottom: 10px; min-height: 32px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.bottom-info { margin-top: auto; }
.meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.product-meta { font-size: 12px; color: #888; }
.heart-active { color: #ff4d4d; }

.btn-add-cart { 
  width: 100%; padding: 8px; background: transparent; border: 1px solid #008284; 
  color: #008284; border-radius: 4px; font-weight: 600; font-size: 12px; cursor: pointer;
}
.btn-add-cart:hover { background: #008284; color: white; }

/* --- Empty State Styling (Persis Gambar Referensi) --- */
.empty-state { display: flex; justify-content: center; align-items: center; padding: 100px 0; }
.empty-content-card { text-align: center; max-width: 400px; }

.empty-illustration { margin-bottom: 25px; display: flex; justify-content: center; }
.folder-icon { 
  width: 100px; height: 75px; background-color: #009999; border-radius: 8px; 
  position: relative; display: flex; justify-content: center; align-items: center; 
}
.folder-icon::before { 
  content: ''; position: absolute; top: -10px; left: 0; width: 35px; height: 10px; 
  background-color: #009999; border-radius: 4px 4px 0 0; 
}
.folder-icon i { color: #fff; font-size: 30px; }

.empty-title { font-size: 24px; font-weight: 600; color: #333; margin-bottom: 12px; }
.empty-description { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 30px; }
.btn-find-products { 
  display: inline-block; background-color: #009999; color: white; padding: 12px 35px; 
  border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 14px; 
}

/* Spinner */
.spinner { 
  width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #008284; 
  border-radius: 50%; animation: spin 1s linear infinite; margin: 100px auto; 
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>