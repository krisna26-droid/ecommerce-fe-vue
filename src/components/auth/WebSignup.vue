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
        <h1>Sign up</h1>
        <p>Enter your details below</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="auth-form">
        <!-- Full Name Input -->
        <BaseInput
          id="fullname"
          v-model="formData.fullname"
          type="text"
          label="Full name"
          placeholder="Enter your fullname"
          size="md"
          required
        />

        <!-- Username Input -->
        <BaseInput
          id="username"
          v-model="formData.username"
          type="text"
          label="Username"
          placeholder="Enter your fullname"
          size="md"
          required
        />

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

        <!-- Confirmation Password Input -->
        <BaseInput
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirmation Password"
          placeholder="Enter your password"
          size="md"
          required
        >
          <template #append>
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span v-if="showConfirmPassword">👁️</span>
              <span v-else>👁️‍🗨️</span>
            </button>
          </template>
        </BaseInput>

        <!-- Terms & Conditions Checkbox -->
        <div class="terms-wrapper">
          <label class="terms-checkbox">
            <input 
              type="checkbox" 
              v-model="agreedToTerms" 
              required
            />
            <span class="terms-text">
              By clicking sign up, I hereby agree and consent to 
              <a href="#" class="terms-link">Term & Conditions</a>, I confirm that I have read 
              <a href="#" class="terms-link">Privacy policy</a>.
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <BaseButton 
          variant="primary" 
          size="md"
          type="submit"
          block
        >
          Sign up
        </BaseButton>
      </form>

      <!-- Divider -->
      <div class="divider">
        <span>Already have an account?</span>
      </div>

      <!-- Login Link -->
      <router-link to="/login" class="switch-link">
        Login to your account
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
import SuccessModal from '@/components/modals/SuccsessModal.vue'

export default {
  name: 'WebSignup',
  components: {
    BaseButton,
    BaseInput,
    SuccessModal
  },
  data() {
    return {
      formData: {
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      agreedToTerms: false,
      showModal: false
    }
  },
  methods: {
    handleRegister() {
      // Validasi password match
      if (this.formData.password !== this.formData.confirmPassword) {
        alert('Password tidak cocok!');
        return;
      }

      // Validasi terms & conditions
      if (!this.agreedToTerms) {
        alert('Please agree to Terms & Conditions and Privacy Policy');
        return;
      }

      // TODO: Implement register logic & API call
      console.log('Register data:', this.formData);
      
      // Simulasi register berhasil - tampilkan modal
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

/* Terms & Conditions */
.terms-wrapper {
  margin: -8px 0 4px 0;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.terms-checkbox input[type="checkbox"] {
  margin-top: 3px;
  cursor: pointer;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: #4a9b9b;
}

.terms-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.terms-link {
  color: #316b73;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
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
  
  .terms-text {
    font-size: 12px;
  }
}
</style>