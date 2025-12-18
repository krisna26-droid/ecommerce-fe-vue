<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
      <div class="icon-container">
        <div class="yellow-circle">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
      </div>
      
      <h2 class="modal-title">Product successfully added to cart</h2>
      <p class="modal-message">
        “{{ productName }}” successfully added to cart. Check now on the cart or continue shopping.
      </p>

      <div class="modal-actions">
        <button class="btn-continue" @click="$emit('close')">Continue shopping</button>
        <button class="btn-go-cart" @click="goToCart">Go to cart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.yellow-circle {
  background: #FFB800;
  width: 100px; height: 100px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  margin: 0 auto 30px;
  color: white; font-size: 40px;
}
.modal-title {
  font-size: 24px; font-weight: bold;
  margin-bottom: 15px; color: #333;
}
.modal-message {
  color: #666; line-height: 1.6;
  margin-bottom: 30px;
}
.modal-actions {
  display: flex; flex-direction: column; gap: 12px;
}
.btn-continue {
  background: white; color: #009999;
  border: 2px solid #009999;
  padding: 12px; border-radius: 8px;
  font-weight: bold; cursor: pointer;
}
.btn-go-cart {
  background: #009999; color: white;
  border: none;
  padding: 12px; border-radius: 8px;
  font-weight: bold; cursor: pointer;
}
</style>