<template>
  <div>
    <header class="topbar">
      <div class="topbar-container">
        <div class="logo">
          <img src="@/assets/images/hero/logo.png" alt="Logo" />
        </div>
        <div class="lang">EN <span>▾</span></div>
      </div>
    </header>
    
    <div class="auth-page">
      <div class="auth-card">
        <!-- Title -->
        <div class="auth-header">
          <h1>Login to vintage</h1>
          <p>Enter your details below</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Email Input -->
          <BaseInput
            id="email"
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            size="md"
            required
            :disabled="isLoading"
          />

          <!-- Password Input -->
          <BaseInput
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            placeholder="Enter your password"
            size="md"
            required
            :disabled="isLoading"
          >
            <template #append>
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <span v-if="showPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </template>
          </BaseInput>

          <!-- Submit Button -->
          <BaseButton
            variant="primary"
            size="md"
            type="submit"
            block
            :disabled="isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Continue' }}
          </BaseButton>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>Don't have an account?</span>
        </div>

        <!-- Register Link -->
        <router-link to="/register" class="switch-link">
          Create an account
        </router-link>
      </div>

      <!-- Success Modal -->
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

export default {
  name: 'WebLogin',
  components: {
    BaseButton,
    BaseInput,
    SuccessModal
  },
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      showPassword: false,
      showModal: false,
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      // Reset error message
      this.errorMessage = '';
      this.isLoading = true;

      try {
        // Call Firebase login
        const result = await authService.login(
          this.formData.email,
          this.formData.password
        );

        if (result.success) {
          console.log('Login berhasil!', result.user);
          
          // Tampilkan modal success
          this.showModal = true;
          
          // Auto redirect setelah 2 detik
          setTimeout(() => {
            this.navigateToHome();
          }, 2000);
        } else {
          // Tampilkan error
          this.errorMessage = result.error;
        }
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      } finally {
        this.isLoading = false;
      }
    },
    navigateToHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.topbar {
  width: 100%;
  padding: 20px 0;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.topbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar .logo img { width: 150px; }

.lang {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.auth-header {
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.auth-header p {
  font-size: 14px;
  color: #666;
}

/* Error Alert */
.error-alert {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.divider {
  text-align: center;
  margin: 24px 0;
  color: #999;
  font-size: 14px;
}

.switch-link {
  display: block;
  text-align: center;
  color: #316b73;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.3s ease;
}

.switch-link:hover {
  color: #255560;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }

  .auth-header h1 {
    font-size: 24px;
  }
}
</style>