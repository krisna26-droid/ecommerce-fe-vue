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
</style>
