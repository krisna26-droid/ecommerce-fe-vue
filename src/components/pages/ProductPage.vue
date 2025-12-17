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
              <img :src="product.image" :alt="product.name" class="product-img">
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
              <img :src="product.image" :alt="product.name" class="product-img">
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
        { 
          id: 1, 
          name: 'Vintage rib knit tube white', 
          price: 200000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'
        },
        { 
          id: 2, 
          name: 'Red Crewneck', 
          price: 200000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop'
        },
        { 
          id: 3, 
          name: 'Necklace', 
          price: 200000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop'
        },
        { 
          id: 4, 
          name: 'Gold Chain Necklace', 
          price: 200000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop'
        },
        { 
          id: 5, 
          name: 'Yellow Graphic Tee', 
          price: 200000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop'
        }
      ],
      newProducts: [
        { 
          id: 6, 
          name: 'Vintage Chicago cubs white crewneck', 
          price: 300000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=500&fit=crop'
        },
        { 
          id: 7, 
          name: 'Red Crewneck', 
          price: 300000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop'
        },
        { 
          id: 8, 
          name: 'Silver Necklace', 
          price: 300000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop'
        },
        { 
          id: 9, 
          name: 'Pearl Necklace', 
          price: 300000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=500&fit=crop'
        },
        { 
          id: 10, 
          name: 'Purple floral tank top', 
          price: 300000, 
          size: '12 / S / M', 
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop'
        }
      ],
      brands: ['Vans', 'Bohos', 'Mango', 'Reebok', 'Converse', 'Sandtro', 'Nike', 'Adidas', 'Dior', 'Puma', 'Zara', 'Bershka', 'American Eagle']
    }
  },
  methods: {
    formatPrice(price) {
      return `Rp${price.toLocaleString('id-ID')}`;
    },
    handleShopNow() {
      console.log('Shop Now clicked');
      // Redirect ke halaman shop atau scroll ke produk
      this.$router.push('/products');
    },
    filterByBrand(brand) {
      console.log('Filter by brand:', brand);
      // Redirect ke halaman products dengan filter brand
      this.$router.push({ path: '/products', query: { brand: brand } });
    }
  }
}
</script>

<style scoped></style>