<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="modal-icon">
          <img src="@/assets/images/hero/SucsessModal.png" alt="Success" />
        </div>

        <h2 class="modal-title">SUCCESSFULLY REGISTERED</h2>

        <p class="modal-description">
          Thank you for registering at Vans. Start finding your favorite footwear and apparel here.
        </p>

        <button class="modal-button" @click="goToHomePage">
          GO TO HOME PAGE
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    goToHomePage() {
      this.$emit('go-home');
      this.closeModal();
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Overlay lebih gelap agar dramatis */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; /* Pastikan di atas elemen apa pun */
}

.modal-container {
  background: white;
  border-radius: 4px; /* Sudut tajam/boxy sesuai gaya Vans */
  border: 2px solid #000; /* Border tegas industrial */
  max-width: 500px;
  width: 90%;
  padding: 40px 30px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1); /* Bayangan streetwear tanpa blur */
}

.modal-content {
  text-align: center;
}

.modal-icon {
  margin-bottom: 30px;
}

.modal-icon img {
  width: 150px;
  height: auto;
}

.modal-title {
  font-size: 26px;
  font-weight: 900; /* Extra bold ala Vans */
  color: #000;
  text-transform: uppercase;
  letter-spacing: -0.5px;
  margin-bottom: 16px;
}

.modal-description {
  font-size: 15px;
  color: #444;
  line-height: 1.6;
  margin-bottom: 30px;
  font-weight: 500;
}

.modal-button {
  width: 100%;
  padding: 16px 24px;
  background-color: #C41230; /* Vans Red Utama */
  color: white;
  border: none;
  border-radius: 4px; /* Sudut tajam konsisten */
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-button:hover {
  background-color: #000; /* Berubah jadi hitam saat hover */
  transform: translateY(-2px);
}

.modal-button:active {
  transform: scale(0.98);
}
</style>