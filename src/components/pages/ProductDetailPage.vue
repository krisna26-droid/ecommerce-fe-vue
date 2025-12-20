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
              {{ product.size }} · {{ product.location || 'Denpasar' }}
            </p>
            
            <hr class="divider" />

            <div class="description-section">
              <h3>Item Description</h3>
              <p>{{ product.description || 'No description available for this item.' }}</p>
            </div>

            <table class="details-table">
              <tr>
                <td>Category</td>
                <td class="link-text">{{ product.category || 'Shoes' }}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{{ product.size }}</td>
              </tr>
              <tr>
                <td>Color</td>
                <td>{{ product.color || 'White' }}</td>
              </tr>
              <tr>
                <td>Uploaded</td>
                <td>5 hours ago</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>{{ formatPrice(product.shipping || 20000) }}</td>
              </tr>
            </table>

            <div class="action-buttons">
              <button class="btn-buy" :disabled="isAdding" @click="handleBuyNow">
                {{ isAdding ? 'Processing...' : 'Buy Now' }}
              </button>
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
            <div class="mini-img-wrapper">
              <img :src="item.image" :alt="item.name" class="mini-img" />
            </div>
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
      v-if="product"
      :show="showCartModal" 
      :productName="product.name" 
      @close="showCartModal = false" 
    />
  </div>
  
  <div v-else-if="isLoading" class="loading-state">
    <div class="spinner"></div>
    <p>Loading details...</p>
  </div>
</template>

<script>
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child, push, set, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AddToCartModal from '@/components/modals/AddToCartModal.vue';

export default {
  name: 'ProductDetailPage',
  components: { AddToCartModal },
  data() {
    return {
      product: null,
      allProducts: [],
      isLoading: true,
      isAdding: false,
      isWishlisted: false,
      wishlistKey: null,
      showCartModal: false,
      currentUser: null
    }
  },
  computed: {
    otherProducts() {
      const currentId = this.$route.params.id;
      return this.allProducts
        .filter(p => p.id !== currentId)
        .slice(0, 4);
    }
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadProductData(newId);
          window.scrollTo(0, 0);
        }
      },
      immediate: true
    }
  },
  methods: {
    formatPrice(price) { return `Rp${Number(price).toLocaleString('id-ID')}`; },
    goToProduct(id) { this.$router.push(`/products/${id}`); },

    async loadProductData(productId) {
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
          this.product = this.allProducts.find(p => p.id === productId);
          if (this.currentUser && this.product) await this.checkWishlistStatus(productId);
        }
      } catch (error) { console.error(error); }
      finally { this.isLoading = false; }
    },

    async checkWishlistStatus(productId) {
      try {
        const wishlistRef = child(dbRef(rtdb), `wishlists/${this.currentUser.uid}`);
        const snapshot = await get(wishlistRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const itemKey = Object.keys(data).find(key => data[key].productId === productId);
          this.isWishlisted = !!itemKey;
          this.wishlistKey = itemKey || null;
        }
      } catch (error) { console.error(error); }
    },

    async toggleWishlist() {
      if (!this.currentUser) return alert("Please login first");
      const userWishlistRef = dbRef(rtdb, `wishlists/${this.currentUser.uid}`);
      try {
        if (this.isWishlisted) {
          await remove(child(userWishlistRef, this.wishlistKey));
          this.isWishlisted = false;
          this.wishlistKey = null;
        } else {
          const newWishRef = push(userWishlistRef);
          await set(newWishRef, {
            productId: this.product.id,
            name: this.product.name,
            price: this.product.price,
            image: this.product.image,
            addedAt: new Date().toISOString()
          });
          this.isWishlisted = true;
          this.wishlistKey = newWishRef.key;
        }
      } catch (error) { console.error(error); }
    },

    // Fungsi Internal untuk Push data ke Cart Firebase
    async addToFirebaseCart() {
      const userCartRef = dbRef(rtdb, `carts/${this.currentUser.uid}`);
      await push(userCartRef, {
        productId: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.image,
        size: this.product.size,
        qty: 1,
        addedAt: new Date().toISOString()
      });
    },

    async handleAddToCart() {
      if (!this.currentUser) return alert("Please login first");
      this.isAdding = true;
      try {
        await this.addToFirebaseCart();
        this.showCartModal = true;
      } catch (error) { 
        alert("Error adding to cart"); 
      } finally { 
        this.isAdding = false; 
      }
    },

    async handleBuyNow() {
      if (!this.currentUser) {
        alert("Please login to proceed with purchase");
        return this.$router.push('/login');
      }
      this.isAdding = true;
      try {
        // Masukkan ke keranjang Firebase terlebih dahulu
        await this.addToFirebaseCart();
        // Langsung arahkan ke halaman checkout
        this.$router.push('/checkout');
      } catch (error) { 
        alert("Failed to process Buy Now"); 
      } finally { 
        this.isAdding = false; 
      }
    }
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (this.$route.params.id) this.loadProductData(this.$route.params.id);
    });
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

.product-detail-page { background-color: #f9f9f9; padding: 40px 0; min-height: 100vh; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* LAYOUT GRID */
.product-main-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }

/* GALLERY & HOVER ZOOM */
.main-image-wrapper { 
  background: white; border-radius: 8px; overflow: hidden; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.05); cursor: zoom-in;
}
.main-image { width: 100%; display: block; transition: transform 0.5s ease; }
.main-image-wrapper:hover .main-image { transform: scale(1.08); }

/* INFO CARD */
.info-card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.price-header { display: flex; justify-content: space-between; align-items: center; }
.price { font-size: 28px; font-weight: bold; color: #333; }
.wishlist-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: #999; transition: transform 0.2s; }
.wishlist-btn:hover { transform: scale(1.2); }
.wishlist-btn i.active { color: #C41230; } /* Vans Red */

.product-title { font-size: 18px; margin: 10px 0 5px; color: #444; font-weight: 700; }
.product-subtitle { font-size: 14px; color: #888; margin-bottom: 20px; }
.divider { border: 0; border-top: 1px solid #eee; margin: 20px 0; }

.details-table { width: 100%; margin-top: 20px; font-size: 14px; }
.details-table td { padding: 8px 0; color: #777; }
.details-table td:last-child { text-align: right; color: #333; font-weight: 500; }
.link-text { color: #C41230 !important; text-decoration: underline; cursor: pointer; }

/* ACTION BUTTONS: Vans Style */
.action-buttons { margin-top: 30px; display: flex; flex-direction: column; gap: 12px; }
.btn-buy { 
  background-color: #C41230; color: white; border: none; padding: 14px; 
  border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.btn-buy:hover:not(:disabled) { background-color: #000; transform: translateY(-2px); }
.btn-buy:disabled { background-color: #ccc; cursor: not-allowed; }

.btn-cart { 
  background: white; color: #C41230; border: 1px solid #C41230; padding: 14px; 
  border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.btn-cart:hover:not(:disabled) { background: #fce8e8; transform: translateY(-2px); }
.btn-cart:disabled { border-color: #ccc; color: #ccc; cursor: not-allowed; }

/* SELLER CARD */
.seller-card { 
  background: white; margin-top: 20px; padding: 15px 24px; border-radius: 8px; 
  display: flex; align-items: center; gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
}
.seller-avatar img { width: 50px; height: 50px; border-radius: 50%; }

/* MINI CARD & HOVER ELEVASI */
.other-products { margin-top: 60px; }
.other-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.mini-card { 
  background: white; border-radius: 8px; overflow: hidden; cursor: pointer; 
  transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.mini-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.mini-img-wrapper { aspect-ratio: 1/1; background: #f5f5f5; overflow: hidden; }
.mini-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.mini-card:hover .mini-img { transform: scale(1.1); }

.mini-info { padding: 12px; }
.mini-price { font-weight: bold; color: #C41230; font-size: 16px; }

/* SPINNER */
.loading-state { text-align: center; padding-top: 100px; }
.spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #C41230; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 768px) { .product-main-layout { grid-template-columns: 1fr; } .other-grid { grid-template-columns: repeat(2, 1fr); } }
</style>