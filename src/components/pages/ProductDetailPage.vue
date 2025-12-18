<template>
  <div v-if="product" class="product-detail-page">
    <div class="container">
      <div class="product-main-layout">
        <div class="product-gallery">
          <div class="main-image-wrapper">
            <img :src="product.image" :alt="product.name" class="main-image" />
          </div>
        </div>

        <div class="product-sidebar">
          <div class="info-card">
            <div class="price-header">
              <h1 class="price">{{ formatPrice(product.price) }}</h1>
              <button class="wishlist-btn" @click="toggleWishlist">
                <i :class="isWishlisted ? 'fa-solid fa-heart active' : 'fa-regular fa-heart'"></i>
              </button>
            </div>
            
            <h2 class="product-title">{{ product.name }}</h2>
            <p class="product-subtitle">
              {{ product.size }} · {{ product.condition || 'Very Good' }} · {{ product.location || 'Denpasar' }}
            </p>
            
            <hr class="divider" />

            <div class="description-section">
              <h3>Item Description</h3>
              <p>{{ product.description || 'No description available for this item.' }}</p>
            </div>

            <table class="details-table">
              <tr>
                <td>Category</td>
                <td class="link-text">{{ product.category || 'General' }}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{{ product.size }}</td>
              </tr>
              <tr>
                <td>Condition</td>
                <td>{{ product.condition || 'Very Good' }}</td>
              </tr>
              <tr>
                <td>Color</td>
                <td>{{ product.color || 'Not specified' }}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>{{ formatPrice(product.shipping || 20000) }}</td>
              </tr>
            </table>

            <div class="action-buttons">
              <button class="btn-buy">Buy Now</button>
              <button class="btn-cart" :disabled="isAdding" @click="handleAddToCart">
                {{ isAdding ? 'Adding...' : 'Add to Cart' }}
              </button>
            </div>
          </div>

          <div class="seller-card">
            <div class="seller-avatar">
              <img src="https://i.pravatar.cc/150?u=jack" alt="Seller" />
            </div>
            <div class="seller-info">
              <p class="seller-name">Jack on the corner</p>
              <div class="seller-rating">
                <i class="fa-solid fa-star" v-for="i in 5" :key="i"></i>
                <span>(110)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="other-products">
        <h3 class="section-title">Other Product</h3>
        <div class="other-grid">
          <div v-for="item in otherProducts" :key="item.id" class="mini-card" @click="goToProduct(item.id)">
            <img :src="item.image" :alt="item.name" />
            <div class="mini-info">
              <p class="mini-price">{{ formatPrice(item.price) }}</p>
              <p class="mini-name">{{ item.name }}</p>
              <p class="mini-meta">{{ item.size }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <AddToCartModal 
      :show="showCartModal" 
      :productName="product.name" 
      @close="showCartModal = false" 
    />
  </div>
  
  <div v-else-if="isLoading" class="loading-state">
    <p>Loading product details...</p>
  </div>
</template>

<script>
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child, push, set, remove } from 'firebase/database';
import AddToCartModal from '@/components/modals/AddToCartModal.vue';

export default {
  name: 'ProductDetailPage',
  components: {
    AddToCartModal
  },
  data() {
    return {
      product: null,
      allProducts: [],
      isLoading: true,
      isAdding: false,
      isWishlisted: false,
      wishlistKey: null,
      showCartModal: false
    }
  },
  computed: {
    otherProducts() {
      return this.allProducts
        .filter(p => p.id !== this.$route.params.id)
        .slice(0, 4);
    }
  },
  async mounted() {
    await this.fetchAllData();
  },
  watch: {
    '$route.params.id': {
      handler: 'fetchSingleProduct',
      immediate: true
    }
  },
  methods: {
    async fetchAllData() {
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
          await this.fetchSingleProduct();
        }
      } catch (error) {
        // Handle error quietly
      } finally {
        this.isLoading = false;
      }
    },

    async fetchSingleProduct() {
      const id = this.$route.params.id;
      const found = this.allProducts.find(p => p.id === id);
      if (found) {
        this.product = found;
        await this.checkWishlistStatus(id);
      }
    },

    async checkWishlistStatus(productId) {
      try {
        const wishlistSnapshot = await get(child(dbRef(rtdb), 'wishlists'));
        if (wishlistSnapshot.exists()) {
          const data = wishlistSnapshot.val();
          const itemKey = Object.keys(data).find(key => data[key].productId === productId);
          
          if (itemKey) {
            this.isWishlisted = true;
            this.wishlistKey = itemKey;
          } else {
            this.isWishlisted = false;
            this.wishlistKey = null;
          }
        }
      } catch (error) {
        // Handle error silently
      }
    },

    async toggleWishlist() {
      if (!this.product) return;
      const wishlistRef = dbRef(rtdb, 'wishlists');

      try {
        if (this.isWishlisted) {
          await remove(child(wishlistRef, this.wishlistKey));
          this.isWishlisted = false;
          this.wishlistKey = null;
        } else {
          const newWishlistRef = push(wishlistRef);
          await set(newWishlistRef, {
            productId: this.product.id,
            name: this.product.name,
            price: this.product.price,
            image: this.product.image,
            addedAt: new Date().toISOString()
          });
          this.isWishlisted = true;
          this.wishlistKey = newWishlistRef.key;
        }
      } catch (error) {
        // Fail silently
      }
    },

    async handleAddToCart() {
      if (!this.product) return;
      this.isAdding = true;
      try {
        const cartRef = dbRef(rtdb, 'carts');
        const newCartItemRef = push(cartRef);
        await set(newCartItemRef, {
          productId: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.product.image,
          size: this.product.size,
          qty: 1,
          addedAt: new Date().toISOString()
        });
        this.showCartModal = true;
      } catch (error) {
        alert("Failed to add item to cart.");
      } finally {
        this.isAdding = false;
      }
    },

    formatPrice(price) {
      if (!price) return 'Rp0';
      return `Rp${Number(price).toLocaleString('id-ID')}`;
    },

    goToProduct(id) {
      this.$router.push(`/products/${id}`);
      window.scrollTo(0, 0);
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

.wishlist-btn i.active {
  color: #ff4d4d;
}

.btn-cart:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
}

.product-detail-page {
  background-color: #f9f9f9;
  padding: 40px 0;
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.product-main-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  align-items: start;
}

.main-image-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.main-image {
  width: 100%;
  display: block;
}

.info-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.price-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.wishlist-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #999;
}

.product-title {
  font-size: 18px;
  margin: 10px 0 5px;
  color: #444;
}

.product-subtitle {
  font-size: 14px;
  color: #888;
  margin-bottom: 20px;
}

.divider {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

.description-section h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.description-section p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.details-table {
  width: 100%;
  margin-top: 20px;
  font-size: 14px;
  border-collapse: collapse;
}

.details-table td {
  padding: 8px 0;
  color: #777;
}

.details-table td:last-child {
  text-align: right;
  color: #333;
  font-weight: 500;
}

.link-text {
  color: #316b73 !important;
  text-decoration: underline;
  cursor: pointer;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-buy {
  background-color: #009999;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cart {
  background: white;
  color: #009999;
  border: 1px solid #009999;
  padding: 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.seller-card {
  background: white;
  margin-top: 20px;
  padding: 15px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.seller-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.seller-name {
  font-weight: bold;
  font-size: 14px;
}

.seller-rating {
  font-size: 12px;
  color: #f1c40f;
}

.seller-rating span {
  color: #888;
  margin-left: 5px;
}

.other-products {
  margin-top: 60px;
}

.section-title {
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.mini-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
}

.mini-card img {
  width: 100%;
  height: 100%;
  max-height: 200px;
  object-fit: cover;
}

.mini-info {
  padding: 12px;
}

.mini-price {
  font-weight: bold;
  font-size: 16px;
}

.mini-name {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-meta {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

@media (max-width: 768px) {
  .product-main-layout {
    grid-template-columns: 1fr;
  }
  .other-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>