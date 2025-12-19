<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="icon-container">
        <div class="vans-red-circle">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
      </div>
      
      <h2 class="modal-title">SUCCESSFULLY ADDED TO CART</h2>
      <p class="modal-message">
        “{{ productName }}” successfully added to your cart. Check now or continue exploring our classics.
      </p>

      <div class="modal-actions">
        <button class="btn-continue" @click="$emit('close')">CONTINUE SHOPPING</button>
        <button class="btn-go-cart" @click="goToCart">GO TO CART</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddToCartModal',
  props: {
    show: Boolean,
    productName: String
  },
  methods: {
    goToCart() {
      this.$router.push('/cart');
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Overlay lebih gelap khas Vans */
  display: flex; justify-content: center; align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 4px; /* Sudut kotak */
  border: 2px solid #000; /* Border tegas industrial */
  text-align: center;
  max-width: 450px;
  width: 90%;
  box-shadow: 10px 10px 0px rgba(0,0,0,0.1); /* Bayangan streetwear tanpa blur */
}

.vans-red-circle {
  background: #C41230; /* Vans Red */
  width: 100px; height: 100px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  margin: 0 auto 30px;
  color: white; font-size: 40px;
  border: 4px solid #000; /* Aksen border hitam */
}

.modal-title {
  font-size: 22px; 
  font-weight: 900; /* Extra bold */
  text-transform: uppercase;
  margin-bottom: 15px; color: #000;
  letter-spacing: -0.5px;
}

.modal-message {
  color: #444; 
  line-height: 1.6;
  margin-bottom: 30px;
  font-weight: 500;
}

.modal-actions {
  display: flex; flex-direction: column; gap: 12px;
}

/* Tombol Outline Hitam */
.btn-continue {
  background: white; 
  color: #000;
  border: 2px solid #000;
  padding: 14px; 
  border-radius: 4px;
  font-weight: 800; 
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;
}

.btn-continue:hover {
  background: #f3f3f3;
}

/* Tombol Vans Red Utama */
.btn-go-cart {
  background: #C41230; 
  color: white;
  border: none;
  padding: 14px; 
  border-radius: 4px;
  font-weight: 800; 
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.2s;
}

.btn-go-cart:hover {
  background: #a00e26;
  transform: translateY(-2px);
}
</style>