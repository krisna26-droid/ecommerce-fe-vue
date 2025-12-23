<template>
  <div v-if="isVisible" class="vans-modal-overlay" @click="closeModal">
    <div class="vans-modal-card" @click.stop style="padding: 40px 30px">
      <div class="modal-icon">
        <img
          src="@/assets/images/hero/SucsessModal.png"
          alt="Success"
          style="width: 150px"
        />
      </div>

      <h2 class="vans-modal-title">SUCCESSFULLY REGISTERED</h2>

      <p class="vans-modal-desc">
        Thank you for registering at Vans. Start finding your favorite footwear
        and apparel here.
      </p>

      <button class="btn-vans-primary" @click="goToHomePage">
        GO TO HOME PAGE
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SuccessModal",
  props: {
    isVisible: { type: Boolean, default: false },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    goToHomePage() {
      this.$emit("go-home");
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.modal-icon {
  margin-bottom: 30px;
}
.vans-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  
  display: flex;
  justify-content: center; 
  align-items: center;     
  z-index: 9999;           
}

.vans-modal-card {
  background: white;
  max-width: 500px;
  width: 90%;             
  text-align: center;      
  border-radius: 8px;     
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-icon {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.vans-modal-title {
  margin-bottom: 15px;
  font-weight: bold;
}

.vans-modal-desc {
  margin-bottom: 30px;
  color: #555;
}

.btn-vans-primary {
  width: 100%;
  padding: 12px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
</style>

