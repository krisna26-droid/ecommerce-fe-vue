<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <!-- Icon/Image -->
        <div class="modal-icon">
          <img src="@/assets/images/hero/modal-logo.png" alt="Success" />
        </div>

        <!-- Title -->
        <h2 class="modal-title">Successfully Register</h2>

        <!-- Description -->
        <p class="modal-description">
          Thank you for register at vintage. Start find your favorite pre-loved product here.
        </p>

        <!-- Button -->
        <button class="modal-button" @click="goToHomePage">
          Go to Home Page
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  padding: 40px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.modal-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.modal-button {
  width: 100%;
  padding: 16px 24px;
  background-color: #4a9b9b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-button:hover {
  background-color: #3d8585;
}

.modal-button:active {
  transform: scale(0.98);
}
</style>