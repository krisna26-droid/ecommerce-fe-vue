<template>
  <div v-if="show" class="vans-modal-overlay">
    <div class="vans-modal-card">
      <div style="padding: 40px">
        <div class="illustration">
          <div class="edc-machine">
            <div class="screen"></div>
            <div class="keypad">
              <div class="key" v-for="i in 9" :key="i"></div>
            </div>
            <div class="card-slot">
              <div class="vans-card"></div>
            </div>
          </div>
        </div>

        <h2 class="vans-modal-title">
          Order #{{ orderId }} placed successfully
        </h2>
        <p class="vans-modal-desc">
          Thank you for doing online shopping at Vans. You can track and see
          your order on the transaction history menu.
        </p>

        <div style="display: flex; flex-direction: column; gap: 12px">
          <button class="btn-vans-outline" @click="$emit('continue')">
            CONTINUE SHOPPING
          </button>
          <button class="btn-vans-primary" @click="$emit('go-history')">
            GO TO HISTORY TRANSACTION
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckoutSuccessModal",
  props: {
    show: Boolean,
    orderId: {
      type: String,
      default: "ORD-89123-823",
    },
  },
};
</script>

<style scoped>
.illustration {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}
.edc-machine {
  width: 60px;
  height: 90px;
  background: var(--vans-black);
  border-radius: 4px;
  position: relative;
  padding: 8px;
}
.screen {
  width: 100%;
  height: 30px;
  background: #f3f3f3;
  margin-bottom: 10px;
  border-radius: 2px;
}
.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}
.key {
  width: 100%;
  height: 6px;
  background: #333;
  border-radius: 1px;
}
.card-slot {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 25px;
  background: var(--vans-red);
  border-radius: 2px;
  border: 1px solid var(--vans-black);
}
</style>
