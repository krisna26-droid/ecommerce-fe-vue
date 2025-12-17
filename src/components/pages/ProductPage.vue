<template>
  <div class="product-page">
    <div class="product-page-container">
      
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Items</h1>
        <div v-if="searchQuery" class="search-filter-badge">
          {{ filteredProducts.length }} results for "{{ searchQuery }}"
          <button @click="clearSearch" class="clear-search-btn">×</button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="products-grid">
        <div 
          v-for="product in displayedProducts" 
          :key="product.id"
          class="product-item"
          @click="viewProduct(product.id)"
        >
          <div class="product-item-image">
            <img :src="getProductImage(product.image)" :alt="product.name">
            <button class="wishlist-btn">
              <svg class="wishlist-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <div class="product-item-info">
            <p class="product-item-price">{{ formatPrice(product.price) }}</p>
            <p class="product-item-name">{{ product.name }}</p>
            <p class="product-item-size">{{ product.size }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="displayedProducts.length === 0" class="empty-state">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="empty-title">No products found</h3>
        <p class="empty-description">Try adjusting your search to find what you're looking for.</p>
        <button @click="clearSearch" class="empty-clear-btn">Clear search</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductPage',
  
  data() {
    return {
      searchQuery: '',
      products: [
        { id: 1, name: 'Vintage chicago cubs white crewneck', price: 200000, size: 'S / M', image: 'product1.jpg' },
        { id: 2, name: 'Red Crewneck', price: 200000, size: 'S / M', image: 'product2.jpg' },
        { id: 3, name: 'Necklace', price: 200000, size: 'S / M', image: 'product3.jpg' },
        { id: 4, name: 'Necklace', price: 200000, size: 'S / M', image: 'product4.jpg' },
        { id: 5, name: 'Necklace', price: 200000, size: 'S / M', image: 'product5.jpg' },
        { id: 6, name: 'Necklace', price: 200000, size: 'S / M', image: 'product6.jpg' },
        { id: 7, name: 'Vintage chicago cubs white crewneck', price: 200000, size: 'S / M', image: 'product1.jpg' },
        { id: 8, name: 'Red Crewneck', price: 200000, size: 'S / M', image: 'product2.jpg' },
        { id: 9, name: 'Necklace', price: 200000, size: 'S / M', image: 'product3.jpg' },
        { id: 10, name: 'Necklace', price: 200000, size: 'S / M', image: 'product4.jpg' },
        { id: 11, name: 'Necklace', price: 200000, size: 'S / M', image: 'product5.jpg' },
        { id: 12, name: 'Necklace', price: 200000, size: 'S / M', image: 'product6.jpg' },
        { id: 13, name: 'Vintage chicago cubs white crewneck', price: 200000, size: 'S / M', image: 'product1.jpg' },
        { id: 14, name: 'Red Crewneck', price: 200000, size: 'S / M', image: 'product2.jpg' },
        { id: 15, name: 'Necklace', price: 200000, size: 'S / M', image: 'product3.jpg' },
        { id: 16, name: 'Necklace', price: 200000, size: 'S / M', image: 'product4.jpg' },
        { id: 17, name: 'Necklace', price: 200000, size: 'S / M', image: 'product5.jpg' },
        { id: 18, name: 'Necklace', price: 200000, size: 'S / M', image: 'product6.jpg' },
      ]
    }
  },

  computed: {
    filteredProducts() {
      if (!this.searchQuery) {
        return this.products;
      }
      
      const query = this.searchQuery.toLowerCase();
      return this.products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.size.toLowerCase().includes(query)
      );
    },

    displayedProducts() {
      return this.filteredProducts;
    }
  },

  mounted() {
    // Get search query from URL if exists
    this.searchQuery = this.$route.query.search || '';
  },

  watch: {
    '$route.query.search': {
      handler(newSearch) {
        this.searchQuery = newSearch || '';
      },
      immediate: true
    }
  },

  methods: {
    getProductImage(imageName) {
      try {
        return require(`@/assets/images/products/${imageName}`);
      } catch (e) {
        return `https://via.placeholder.com/300x350/f0f0f0/666?text=${imageName}`;
      }
    },

    formatPrice(price) {
      return `Rp${price.toLocaleString('id-ID')}`;
    },

    viewProduct(id) {
      this.$router.push(`/product/${id}`);
    },

    clearSearch() {
      this.searchQuery = '';
      this.$router.push('/products');
    }
  }
}
</script>

<style scoped>
/* Styles sudah dipindahkan ke main.css */
</style>