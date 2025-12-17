<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Logout</h2>
          <button @click="closeModal" class="close-x-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p class="modal-description left-align">
          Are you sure want to logout from vintage?
        </p>

        <div class="modal-actions">
          <button class="btn-secondary" @click="closeModal">
            Close
          </button>
          <button class="btn-danger" @click="handleLogout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogoutModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'logout'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleLogout() {
      this.$emit('logout');
    }
  }
}
</script>

<style scoped>
/* Style Dasar dari SuccessModal */
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
  z-index: 10000; /* Ditingkatkan agar di atas navbar */
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden; /* Supaya bagian header/footer rapi */
}

.modal-content {
  text-align: left; /* Logout biasanya rata kiri */
  padding: 0; /* Padding diatur per bagian */
}

/* Header Section */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px 10px 30px;
}

.close-x-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
}

.close-x-btn:hover {
  color: #333;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  padding: 0 30px 30px 30px;
  margin: 0;
}

/* Actions Area */
.modal-actions {
  background-color: #f9fafb; /* Area abu-abu bawah sesuai desain */
  padding: 16px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Button Styles */
.btn-secondary, .btn-danger {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #4b5563;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger {
  background-color: #dc2626; /* Warna merah logout */
  color: white;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-danger:active, .btn-secondary:active {
  transform: scale(0.96);
}
</style>