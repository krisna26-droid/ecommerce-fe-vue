<template>
  <div class="homepage">

    <main class="main-content">
      
      <!-- Hero Banner Section -->
      <section class="hero-section">
        <img src="@/assets/images/hero/banner.png" alt="Hero Banner" class="hero-image" />
        <div class="hero-overlay">
          <div class="hero-card">
            <h1 class="hero-title">Ready to declutter your closet?</h1>
            <BaseButton variant="primary" size="lg" @click="handleShopNow">
              Shop Now
            </BaseButton>
          </div>
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
              <img :src="getProductImage(product.image)" :alt="product.name" class="product-img">
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

<style scoped></style>