<template>
  <main class="products-container">
    <!-- Header Section -->
    <div class="products-header">
      <h1 class="products-title">Items</h1>
      <div class="sort-wrapper">
        <select v-model="sortBy" class="sort-select">
          <option value="sweater-cloth">Sweater Cloth</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        @click="handleProductClick(product.id)"
      >
        <div class="product-image-container">
          <img 
            :src="product.image" 
            :alt="product.name" 
            class="product-image"
          />
          <button 
            class="wishlist-btn" 
            @click.stop="toggleWishlist(product.id)"
            :class="{ 'active': product.isWishlisted }"
          >
            <svg 
              class="heart-icon" 
              viewBox="0 0 24 24" 
              :fill="product.isWishlisted ? 'currentColor' : 'none'"
              stroke="currentColor"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        
        <div class="product-info">
          <p class="product-price">{{ formatPrice(product.price) }}</p>
          <p class="product-name">{{ product.name }}</p>
          <div class="product-meta">
            <span class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {{ product.likes }}
            </span>
            <span class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {{ product.comments }}
            </span>
            <span class="meta-item">{{ product.size }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <p class="empty-text">No products found</p>
      <p v-if="searchQuery" class="empty-subtext">
        Try adjusting your search term "{{ searchQuery }}"
      </p>
    </div>
  </main>
</template>

<script>
export default {
  name: 'ProductsPage',
  
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    brandFilter: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      sortBy: 'sweater-cloth',
      products: [
        { 
          id: 1, 
          name: 'Vintage chicago cubs white crewneck', 
          price: 200000, 
          size: 'S / M',
          image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=500&fit=crop', 
          likes: 0, 
          comments: 0,
          isWishlisted: false,
          brand: 'Nike'
        },
        { 
          id: 2, 
          name: 'Red Crewneck', 
          price: 200000, 
          size: 'S / M',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Adidas'
        },
        { 
          id: 3, 
          name: 'Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 4, 
          name: 'Gold Chain Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 5, 
          name: 'Yellow Graphic Tee', 
          price: 200000, 
          size: 'S / M / L',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Vans'
        },
        { 
          id: 6, 
          name: 'Purple Tank Top', 
          price: 200000, 
          size: 'S / M',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop', 
          likes: 0, 
          comments: 0,
          isWishlisted: false,
          brand: 'Zara'
        },
        { 
          id: 7, 
          name: 'Red Crewneck', 
          price: 200000, 
          size: 'M / L',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Puma'
        },
        { 
          id: 8, 
          name: 'White Tube Top', 
          price: 200000, 
          size: 'S / M',
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop', 
          likes: 0, 
          comments: 0,
          isWishlisted: false,
          brand: 'Mango'
        },
        { 
          id: 9, 
          name: 'Pearl Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 10, 
          name: 'Silver Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 11, 
          name: 'Graphic Tee', 
          price: 200000, 
          size: 'M / L',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Nike'
        },
        { 
          id: 12, 
          name: 'Floral Tank Top', 
          price: 200000, 
          size: 'S / M',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop', 
          likes: 0, 
          comments: 0,
          isWishlisted: false,
          brand: 'Zara'
        },
        { 
          id: 13, 
          name: 'Designer Necklace', 
          price: 250000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop', 
          likes: 12, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 14, 
          name: 'Red Hoodie', 
          price: 200000, 
          size: 'L / XL',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Adidas'
        },
        { 
          id: 15, 
          name: 'Knit Top', 
          price: 200000, 
          size: 'S / M',
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop', 
          likes: 0, 
          comments: 0,
          isWishlisted: false,
          brand: 'Mango'
        },
        { 
          id: 16, 
          name: 'Chain Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop', 
          likes: 12, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 17, 
          name: 'Pendant Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop', 
          likes: 11, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        },
        { 
          id: 18, 
          name: 'Pearl String Necklace', 
          price: 200000, 
          size: 'One Size',
          image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop', 
          likes: 12, 
          comments: 0,
          isWishlisted: false,
          brand: 'Dior'
        }
      ]
    }
  },

  computed: {
    filteredProducts() {
      let filtered = [...this.products];

      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Filter by brand
      if (this.brandFilter) {
        filtered = filtered.filter(product =>
          product.brand.toLowerCase() === this.brandFilter.toLowerCase()
        );
      }

      // Sort products
      switch (this.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.reverse();
          break;
        default:
          break;
      }

      return filtered;
    }
  },

  methods: {
    formatPrice(price) {
      return `Rp${price.toLocaleString('id-ID')}`;
    },

    handleProductClick(productId) {
      this.$router.push(`/products/${productId}`);
    },

    toggleWishlist(productId) {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        product.isWishlisted = !product.isWishlisted;
        this.$emit('wishlist-toggle', { productId, isWishlisted: product.isWishlisted });
      }
    }
  }
}
</script>

<style scoped>
.products-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Header Section */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.products-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-select:hover {
  border-color: #0d9488;
}

.sort-select:focus {
  outline: none;
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Product Card */
.product-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image-container {
  position: relative;
  aspect-ratio: 3 / 4;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.wishlist-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.wishlist-btn:hover {
  background-color: #fef2f2;
  transform: scale(1.1);
}

.wishlist-btn.active {
  background-color: #fef2f2;
}

.heart-icon {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  stroke-width: 2;
}

.wishlist-btn.active .heart-icon {
  color: #ef4444;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-price {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.product-name {
  font-size: 0.875rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-icon {
  width: 0.75rem;
  height: 0.75rem;
  stroke-width: 2;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  stroke-width: 1.5;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #9ca3af;
}
</style>