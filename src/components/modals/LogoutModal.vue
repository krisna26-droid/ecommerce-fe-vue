<template>
  <div v-if="isOpen" class="vans-modal-overlay" @click="closeModal">
    <div class="vans-modal-card" @click.stop style="text-align: left">
      <div class="modal-header">
        <h2 class="vans-modal-title" style="margin-bottom: 0">LOGOUT</h2>
        <button @click="closeModal" class="close-x-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div style="padding: 0 30px 30px">
        <p class="vans-modal-desc" style="margin-bottom: 0">
          Are you sure you want to logout from Vans?
        </p>
      </div>

      <div class="modal-actions-footer">
        <button
          class="btn-vans-outline"
          style="width: auto"
          @click="closeModal"
        >
          CLOSE
        </button>
        <button
          class="btn-vans-primary"
          style="width: auto"
          @click="handleLogout"
        >
          LOGOUT
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogoutModal",
  props: {
    isOpen: { type: Boolean, default: false },
  },
  emits: ["close", "logout"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
    handleLogout() {
      this.$emit("logout");
    },
  },
};
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px 10px 30px;
}
.close-x-btn {
  background: none;
  border: none;
  color: var(--vans-black);
  cursor: pointer;
  padding: 0;
}
.close-x-btn:hover {
  color: var(--vans-red);
}
.modal-actions-footer {
  background-color: var(--vans-gray-light);
  padding: 16px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}
</style>
