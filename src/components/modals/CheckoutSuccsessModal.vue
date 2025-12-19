<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-content">
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

      <h2 class="order-id">Order #{{ orderId }} placed successfully</h2>
      <p class="thank-you-text">
        Thank you for doing online shopping at Vans. You can track and see your order on the transaction history menu.
      </p>

      <div class="modal-actions">
        <button class="btn-continue" @click="$emit('continue')">CONTINUE SHOPPING</button>
        <button class="btn-history" @click="$emit('go-history')">GO TO HISTORY TRANSACTION</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutSuccessModal',
  props: {
    show: Boolean,
    orderId: {
      type: String,
      default: 'ORD-89123-823'
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7); display: flex; align-items: center;
  justify-content: center; z-index: 10000; padding: 20px;
}

.modal-content {
  background: white; padding: 40px; border-radius: 4px; /* Sudut tajam */
  max-width: 450px; width: 100%; text-align: center;
  border: 2px solid #000; /* Border tegas industrial */
  box-shadow: 10px 10px 0px rgba(0,0,0,0.1); /* Bayangan streetwear */
}

/* Ilustrasi EDC dengan palet warna Vans */
.illustration { margin-bottom: 30px; display: flex; justify-content: center; }
.edc-machine {
  width: 60px; height: 90px; background: #000; border-radius: 4px;
  position: relative; padding: 8px;
}
.screen { width: 100%; height: 30px; background: #f3f3f3; margin-bottom: 10px; border-radius: 2px; }
.keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
.key { width: 100%; height: 6px; background: #333; border-radius: 1px; }
.card-slot {
  position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%);
  width: 30px; height: 25px; background: #C41230; /* Vans Red */
  border-radius: 2px; border: 1px solid #000;
}

.order-id { 
  font-size: 22px; font-weight: 800; color: #000; 
  text-transform: uppercase; margin-bottom: 15px; line-height: 1.2; 
}
.thank-you-text { font-size: 14px; color: #444; line-height: 1.6; margin-bottom: 35px; font-weight: 500; }

.modal-actions { display: flex; flex-direction: column; gap: 12px; }

/* Tombol Outline Hitam */
.btn-continue {
  padding: 14px; background: transparent; border: 2px solid #000;
  color: #000; border-radius: 4px; font-weight: 800; cursor: pointer;
  text-transform: uppercase; transition: background 0.2s;
}
.btn-continue:hover { background: #f3f3f3; }

/* Tombol Vans Red Utama */
.btn-history {
  padding: 14px; background: #C41230; border: none;
  color: white; border-radius: 4px; font-weight: 800; cursor: pointer;
  text-transform: uppercase; transition: transform 0.2s;
}
.btn-history:hover {
  background: #a00e26;
  transform: translateY(-2px);
}
</style>