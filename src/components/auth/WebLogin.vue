<template>
  <div class="auth-page">
    <div class="auth-card">
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/images/hero/logo.png" alt="Vintage" />
        <span>Vintage</span>
      </div>

      <!-- Title -->
      <div class="auth-header">
        <h1>Login to vintage</h1>
        <p>Enter your details below</p>
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
        >
          Continue
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
</template>

<script>
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import SuccessModal from '@/components/modals//SuccsessModal.vue'

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
      showModal: false
    }
  },
  methods: {
    handleLogin() {
      // TODO: Implement login logic & API call
      console.log('Login data:', this.formData);
      
      // Simulasi login berhasil - tampilkan modal
      this.showModal = true;
    },
    navigateToHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo img {
  width: 32px;
  height: 32px;
}

.logo span {
  font-size: 24px;
  font-weight: 600;
  color: #4a9b9b;
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