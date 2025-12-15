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
      <div class="auth-header">
        <h1>Sign up</h1>
        <p>Enter your details below</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-alert">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-alert">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <BaseInput 
          id="fullname" 
          v-model="formData.fullname" 
          type="text" 
          label="Full name" 
          placeholder="Enter your fullname" 
          size="md" 
          required 
          :disabled="isLoading"
        />

        <BaseInput 
          id="username" 
          v-model="formData.username" 
          type="text" 
          label="Username" 
          placeholder="Enter your username" 
          size="md" 
          required 
          :disabled="isLoading"
        />

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
              <span v-else>👁️</span>
            </button>
          </template>
        </BaseInput>

        <BaseInput
          id="confirmPassword"
          v-model="formData.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirmation Password"
          placeholder="Confirm your password"
          size="md"
          required
          :disabled="isLoading"
        >
          <template #append>
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span v-if="showConfirmPassword">👁️</span>
              <span v-else>👁️</span>
            </button>
          </template>
        </BaseInput>

        <div class="terms-wrapper">
          <label class="terms-checkbox">
            <input type="checkbox" v-model="agreedToTerms" required :disabled="isLoading" />
            <span class="terms-text">
              By clicking sign up, I hereby agree and consent to
              <a href="#" class="terms-link">Term & Conditions</a>, I confirm that I have read
              <a href="#" class="terms-link">Privacy policy</a>.
            </span>
          </label>
        </div>

        <BaseButton 
          variant="primary" 
          size="md" 
          type="submit" 
          block
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing up...' : 'Sign up' }}
        </BaseButton>
      </form>

      <div class="divider">
        <span>Already have an account?</span>
      </div>

      <router-link to="/login" class="switch-link">
        Login to your account
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

export default {
  name: 'WebSignup',
  components: { BaseButton, BaseInput, SuccessModal },
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
      showModal: false,
      isLoading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async handleRegister() {
      // Reset messages
      this.errorMessage = '';
      this.successMessage = '';

      // Validasi sisi klien
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Password dan konfirmasi password tidak sama!';
        return;
      }

      if (this.formData.password.length < 6) {
        this.errorMessage = 'Password minimal 6 karakter!';
        return;
      }

      if (!this.agreedToTerms) {
        this.errorMessage = 'Anda harus menyetujui Syarat & Ketentuan dan Kebijakan Privasi.';
        return;
      }

      this.isLoading = true;

      try {
        // Call Firebase register
        const result = await authService.register({
          fullname: this.formData.fullname,
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password
        });

        if (result.success) {
          console.log('Register berhasil!', result.user);
          
          // Tampilkan modal success
          this.showModal = true;
          
          // Auto redirect ke login setelah 2 detik
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          // Tampilkan error
          this.errorMessage = result.error;
        }
      } catch (error) {
        console.error('Register error:', error);
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
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
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
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  padding: 20px;
  padding-top: 100px;
  background-color: white;
  box-sizing: border-box;
}

.auth-card {
  background: white; 
  border-radius: 12px; 
  padding: 40px;
  width: 100%; 
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.auth-header { margin-bottom: 32px; }

.auth-header h1 { 
  font-size: 28px; 
  font-weight: 600; 
  color: #1a1a1a; 
  margin-bottom: 8px; 
}

.auth-header p { font-size: 14px; color: #666; }

/* Alert Messages */
.error-alert {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.success-alert {
  background-color: #efe;
  border: 1px solid #cfc;
  color: #3c3;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
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
.terms-wrapper { margin: -8px 0 4px 0; }

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

.terms-text { font-size: 13px; color: #666; line-height: 1.5; }

.terms-link { color: #316b73; text-decoration: none; font-weight: 500; }

.terms-link:hover { text-decoration: underline; }

.divider { text-align: center; margin: 24px 0; color: #999; font-size: 14px; }

.switch-link {
  display: block; 
  text-align: center; 
  color: #316b73;
  text-decoration: none; 
  font-weight: 500; 
  font-size: 14px;
  transition: color 0.3s ease;
}

.switch-link:hover { color: #255560; }

@media (max-width: 480px) {
  .auth-card { padding: 24px; }
  .auth-header h1 { font-size: 24px; }
  .terms-text { font-size: 12px; }
}
</style>