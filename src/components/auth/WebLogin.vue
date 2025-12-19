<template>
  <div>
    <header class="topbar">
      <div class="topbar-container">
        <div class="logo">
          <img src="@/assets/images/hero/logo.png" alt="Vans Off The Wall" />
        </div>
        <div class="lang">EN <span>▾</span></div>
      </div>
    </header>
    
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Login to Vans</h1>
          <p>Enter your details below</p>
        </div>

        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <BaseInput
            id="email"
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            required
            :disabled="isLoading"
          />

          <BaseInput
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
          >
            <template #append>
              <button
                type="button"
                class="toggle-password-btn"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
              </button>
            </template>
          </BaseInput>

          <BaseButton
            variant="primary"
            type="submit"
            block
            :disabled="isLoading"
            class="btn-vans-login"
          >
            {{ isLoading ? 'Logging in...' : 'Continue' }}
          </BaseButton>
        </form>

        <div class="divider">
          <span>Don't have an account?</span>
        </div>

        <router-link to="/register" class="switch-link">
          Create an account
        </router-link>
      </div>

      <SuccessModal
        :isVisible="showModal"
        @close="showModal = false"
        @go-home="navigateToHome"
      />
    </div>
  </div>
</template>

<script>
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import SuccessModal from '@/components/modals/SuccsessModal.vue';
import authService from '@/services/authService';
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, child } from 'firebase/database';

export default {
  name: 'WebLogin',
  components: { BaseButton, BaseInput, SuccessModal },
  data() {
    return {
      formData: { email: '', password: '' },
      showPassword: false,
      showModal: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;
      try {
        const result = await authService.login(this.formData.email, this.formData.password);
        if (result.success) {
          const userSnap = await get(child(dbRef(rtdb), `users/${result.user.uid}`));
          if (userSnap.exists()) {
            localStorage.setItem("user", JSON.stringify(userSnap.val()));
          }
          window.dispatchEvent(new Event("profile-updated"));
          this.showModal = true;
          setTimeout(() => { this.navigateToHome(); }, 1500);
        } else {
          this.errorMessage = result.error;
        }
      } catch (error) {
        this.errorMessage = 'Terjadi kesalahan sistem.';
      } finally {
        this.isLoading = false;
      }
    },
    navigateToHome() { this.$router.push('/'); }
  }
}
</script>

<style scoped>
.topbar { width: 100%; padding: 20px 0; background: white; position: absolute; top: 0; left: 0; z-index: 10; border-bottom: 2px solid #000; }
.topbar-container { max-width: 1200px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
.topbar .logo img { width: 120px; }

.auth-page { min-height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f9f9f9; }

/* Gaya Kartu Auth */
.auth-card { 
  background: white; border-radius: 4px; padding: 40px; width: 100%; 
  max-width: 450px; border: 2px solid #000; box-shadow: 10px 10px 0px rgba(0,0,0,0.05);
}

.auth-header h1 { font-size: 26px; font-weight: 800; text-transform: uppercase; color: #1a1a1a; margin-bottom: 8px; }
.auth-header p { font-size: 14px; font-weight: 600; color: #666; margin-bottom: 32px; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.toggle-password-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  padding: 4px;
}

.divider { text-align: center; margin: 24px 0; color: #999; font-size: 14px; font-weight: 600; }

/* Link Switch menggunakan Vans Red */
.switch-link { 
  display: block; text-align: center; color: #C41230; 
  text-decoration: underline; font-weight: 800; font-size: 14px; 
  text-transform: uppercase;
}

/* Tombol Vans Red */
:deep(.btn-primary) {
  background-color: #C41230 !important;
  border: none !important;
  height: 52px;
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(.btn-primary:hover) {
  background-color: #000 !important;
}

.error-alert { background: #fee2e2; color: #b91c1c; padding: 12px; border: 1px solid #b91c1c; border-radius: 4px; margin-bottom: 20px; font-size: 14px; font-weight: 600; }

.lang { font-weight: 700; color: #000; cursor: pointer; }
</style>