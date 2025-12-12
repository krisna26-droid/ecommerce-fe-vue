<template>
  <div class="homepage">

    <main class="main-content">
      
      <!-- Hero Banner Section -->
      <section class="hero-section">
        <img src="@/assets/images/hero/banner.png" alt="Hero Banner" class="hero-image" />
        <div class="hero-overlay">
          <h1 class="hero-title">Ready to declutter your closet?</h1>
          <BaseButton variant="primary" size="lg" @click="handleShopNow">
            Shop Now
          </BaseButton>
        </div>
      </section>

      <!-- Popular Items Section -->
      <section class="product-section">
        <div class="section-header">
          <h5 class="section-title">Popular Items</h5>
          <a href="#" class="see-all-link">See all</a>
        </div>

        <div class="product-grid">
          <div v-for="product in popularProducts" :key="product.id" class="product-card">
            <div class="product-image-wrapper">
              <!-- <img :src="getProductImage(product.image)" :alt="product.name" class="product-img"> -->
               <img src="@/assets/images/hero/product1.png" alt="Product 1" class="product-img"></img>
            </div>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            <p class="product-description">{{ product.name }}</p>
            <p class="product-size">{{ product.size }}</p>
          </div>

          <div class="see-all-card-wrapper">
            <div class="see-all-card">
              <a href="#" class="see-all-btn">See All Popular Product</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Shop by Brand Section -->
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
      
      <!-- New Product Section -->
      <section class="product-section">
        <div class="section-header">
          <h5 class="section-title">New Product</h5>
          <a href="#" class="see-all-link">See all</a>
        </div>

        <div class="product-grid">
          <div v-for="product in newProducts" :key="product.id" class="product-card">
            <div class="product-image-wrapper">
              <img :src="getProductImage(product.image)" :alt="product.name" class="product-img">
            </div>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            <p class="product-description">{{ product.name }}</p>
            <p class="product-size">{{ product.size }}</p>
          </div>

          <div class="see-all-card-wrapper">
            <div class="see-all-card">
              <a href="#" class="see-all-btn">See All New Product</a>
            </div>
          </div>
        </div>
      </section>

    </main>

  </div>
</template>

<script>
import BaseButton from '../ui/BaseButton.vue';

export default {
  name: 'HomePage',
  components: {
    BaseButton
  },
  data() {
    return {
      popularProducts: [
        { id: 1, name: 'Vintage rib knit tube white', price: 200000, size: '12 / S / M', image: 'product1.jpg' },
        { id: 2, name: 'Red Crewneck', price: 200000, size: '12 / S / M', image: 'product2.jpg' },
        { id: 3, name: 'Necklace', price: 200000, size: '12 / S / M', image: 'product3.jpg' },
        { id: 4, name: 'Necklace', price: 200000, size: '12 / S / M', image: 'product4.jpg' },
        { id: 5, name: 'Yellow Graphic Tee', price: 200000, size: '12 / S / M', image: 'product5.jpg' }
      ],
      newProducts: [
        { id: 6, name: 'Vintage Chicago cubs white crewneck', price: 300000, size: '12 / S / M', image: 'product5.jpg' },
        { id: 7, name: 'Red Crewneck', price: 300000, size: '12 / S / M', image: 'product2.jpg' },
        { id: 8, name: 'Necklace', price: 300000, size: '12 / S / M', image: 'product3.jpg' },
        { id: 9, name: 'Necklace', price: 300000, size: '12 / S / M', image: 'product4.jpg' },
        { id: 10, name: 'Purple floral tank top', price: 300000, size: '12 / S / M', image: 'product6.jpg' }
      ],
      brands: ['Vans', 'Bohos', 'Mango', 'Reebok', 'Converse', 'Sandtro', 'Nike', 'Adidas', 'Dior', 'Puma', 'Zara', 'Bershka', 'American Eagle']
    }
  },
  methods: {
    getProductImage(imageName) {
      // Jika menggunakan folder assets
      try {
        return require(`@/assets/images/products/${imageName}`);
      } catch (e) {
        // Fallback ke placeholder jika gambar tidak ditemukan
        return `https://via.placeholder.com/300x350/f0f0f0/666?text=${imageName}`;
      }
    },
    formatPrice(price) {
      return `Rp${price.toLocaleString('id-ID')}`;
    },
    handleShopNow() {
      console.log('Shop Now clicked');
      // Redirect ke halaman shop atau scroll ke produk
    },
    filterByBrand(brand) {
      console.log('Filter by brand:', brand);
      // Implementasi filter brand
    }
  }
}
</script>

<style scoped>
/* Reset dan Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.homepage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.main-content {
  flex-grow: 1;
  width: 100%;
  padding: 0 0 60px;
}

/* Hero Section */
.hero-section {
  height: 500px;
  position: relative;
  margin: 0 0 60px;
  overflow: hidden;
  width: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(70%);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  text-align: center;
  padding: 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 30px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 40px;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: #1a1a1a;
}

.see-all-link {
  color: #316b73;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: color 0.3s ease;
}

.see-all-link:hover {
  color: #255560;
  text-decoration: underline;
}

/* Product Section */
.product-section {
  margin-bottom: 80px;
  padding: 0 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}

.product-card {
  text-align: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-8px);
}

.product-image-wrapper {
  background-color: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 10px 0 6px;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin: 6px 0;
  line-height: 1.4;
}

.product-size {
  font-size: 13px;
  color: #999;
  margin: 6px 0;
}

/* See All Card */
.see-all-card-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.see-all-card {
  height: 280px;
  width: 100%;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.see-all-card:hover {
  background-color: #f0f0f0;
  border-color: #316b73;
  border-style: solid;
}

.see-all-btn {
  color: #1a1a1a;
  font-weight: 600;
  text-decoration: none;
  padding: 20px;
  transition: color 0.3s ease;
  font-size: 15px;
}

.see-all-card:hover .see-all-btn {
  color: #316b73;
}

/* Brand Section */
.brand-section {
  margin-bottom: 80px;
  padding: 0 40px;
}

.brand-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  /* .product-section,
  .brand-section,
  .section-header {
    padding: 0 30px;
  } */

  .hero-title {
    font-size: 2.5rem;
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .product-image-wrapper {
    height: 240px;
  }

  .see-all-card {
    height: 240px;
  }
}

@media (max-width: 768px) {
  .product-section,
  .brand-section,
  .section-header {
    padding: 0 20px;
  }

  .hero-section {
    height: 400px;
    margin: 0 0 40px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 24px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .product-image-wrapper {
    height: 220px;
  }

  .see-all-card {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 300px;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 20px;
  }

  .product-grid {
    gap: 12px;
  }

  .product-image-wrapper {
    height: 180px;
  }

  .see-all-card {
    height: 180px;
  }
}
</style>