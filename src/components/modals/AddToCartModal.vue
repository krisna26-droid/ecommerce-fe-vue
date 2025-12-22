<template>
  <div v-if="show" class="vans-modal-overlay" @click="$emit('close')">
    <div class="vans-modal-card" @click.stop>
      <div style="padding: 40px">
        <div class="icon-container">
          <div class="vans-red-circle">
            <i class="fa-solid fa-cart-shopping"></i>
          </div>
        </div>

        <h2 class="vans-modal-title">SUCCESSFULLY ADDED TO CART</h2>
        <p class="vans-modal-desc">
          “{{ productName }}” successfully added to your cart. Check now or
          continue exploring our classics.
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px">
          <button class="btn-vans-outline" @click="$emit('close')">
            CONTINUE SHOPPING
          </button>
          <button class="btn-vans-primary" @click="goToCart">GO TO CART</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddToCartModal",
  props: {
    show: Boolean,
    productName: String,
  },
  methods: {
    goToCart() {
      this.$router.push("/cart");
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.vans-red-circle {
  background: var(--vans-red);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 30px;
  color: white;
  font-size: 40px;
  border: 4px solid var(--vans-black);
}
</style>
