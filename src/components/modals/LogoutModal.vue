<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">LOGOUT</h2>
          <button @click="closeModal" class="close-x-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <p class="modal-description left-align">
          Are you sure you want to logout from Vans?
        </p>

        <div class="modal-actions">
          <button class="btn-secondary" @click="closeModal">
            CLOSE
          </button>
          <button class="btn-danger" @click="handleLogout">
            LOGOUT
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
  z-index: 10000;
}

.modal-container {
  background: white;
  border-radius: 4px; /* Sudut lebih kotak sesuai gaya Vans */
  border: 2px solid #000; /* Border tegas industrial */
  max-width: 450px;
  width: 90%;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1); /* Bayangan streetwear tanpa blur */
  overflow: hidden;
}

.modal-content {
  text-align: left;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px 10px 30px;
}

.close-x-btn {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.close-x-btn:hover {
  color: #C41230; /* Hover ke Vans Red */
}

.modal-title {
  font-size: 22px;
  font-weight: 900; /* Extra bold ala "Off The Wall" */
  color: #000;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.modal-description {
  font-size: 15px;
  color: #444;
  line-height: 1.5;
  padding: 0 30px 30px 30px;
  margin: 0;
  font-weight: 500;
}

.modal-actions {
  background-color: #f3f3f3;
  padding: 16px 30px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}

/* Button Styles: Boxy & Bold */
.btn-secondary, .btn-danger {
  padding: 10px 24px;
  border: 2px solid #000;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background-color: #fff;
  color: #000;
}

.btn-secondary:hover {
  background-color: #000;
  color: #fff;
}

.btn-danger {
  background-color: #C41230; /* Vans Red */
  color: white;
  border-color: #C41230;
}

.btn-danger:hover {
  background-color: #a00e26;
  border-color: #a00e26;
}

.btn-danger:active, .btn-secondary:active {
  transform: scale(0.96);
}
</style>