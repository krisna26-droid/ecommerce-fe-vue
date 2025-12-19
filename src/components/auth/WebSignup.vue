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
          <h1>Sign up</h1>
          <p>Enter your details below to join Vans</p>
        </div>

        <div v-if="errorMessage" class="error-alert">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-alert">{{ successMessage }}</div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <BaseInput 
            id="fullname" 
            v-model="formData.fullname" 
            type="text" 
            label="Full name" 
            placeholder="Enter your fullname" 
            required 
            :disabled="isLoading"
          />

          <BaseInput 
            id="username" 
            v-model="formData.username" 
            type="text" 
            label="Username" 
            placeholder="Enter your username" 
            required 
            :disabled="isLoading"
          />

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
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
              </button>
            </template>
          </BaseInput>

          <BaseInput
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirmation Password"
            placeholder="Confirm your password"
            required
            :disabled="isLoading"
          >
            <template #append>
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
              </button>
            </template>
          </BaseInput>

          <div class="terms-wrapper">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="agreedToTerms" required :disabled="isLoading" />
              <span class="terms-text">
                By clicking sign up, I hereby agree and consent to
                <a href="#" class="terms-link">Term & Conditions</a>; I confirm that I have read
                <a href="#" class="terms-link">Privacy policy</a>.
              </span>
            </label>
          </div>

          <BaseButton 
            variant="primary" 
            type="submit" 
            block
            :disabled="isLoading"
            class="btn-vans-signup"
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
      formData: { fullname: '', username: '', email: '', password: '', confirmPassword: '' },
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
      this.errorMessage = '';
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Password tidak cocok!';
        return;
      }
      this.isLoading = true;
      try {
        const result = await authService.register(this.formData);
        if (result.success) {
          this.showModal = true;
          setTimeout(() => { this.$router.push('/login'); }, 2000);
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
/* NAVBAR & LOGO */
.topbar { width: 100%; padding: 20px 0; background: white; border-bottom: 2px solid #000; }
.topbar-container { max-width: 1200px; margin: 0 auto; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; }
.topbar .logo img { width: 120px; }
.lang { font-size: 14px; font-weight: 700; color: #000; display: flex; align-items: center; gap: 4px; cursor: pointer; }

/* AUTH PAGE & CARD */
.auth-page { min-height: 100vh; display: flex; justify-content: center; align-items: center; background-color: #f9f9f9; padding: 40px 20px; }
.auth-card { 
  background: white; border-radius: 4px; padding: 40px; width: 100%; 
  max-width: 450px; border: 2px solid #000; box-shadow: 10px 10px 0px rgba(0,0,0,0.05); 
}

.auth-header { margin-bottom: 32px; text-align: left; }
.auth-header h1 { font-size: 26px; font-weight: 800; text-transform: uppercase; color: #000; margin-bottom: 8px; }
.auth-header p { font-size: 14px; font-weight: 600; color: #666; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.toggle-password { background: none; border: none; cursor: pointer; color: #6b7280; font-size: 16px; padding: 0 10px; }

/* TERMS STYLING */
.terms-wrapper { margin-top: -10px; }
.terms-checkbox { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.terms-checkbox input[type="checkbox"] { 
  margin-top: 3px; cursor: pointer; width: 18px; height: 18px; accent-color: #C41230; 
}
.terms-text { font-size: 13px; color: #444; line-height: 1.5; font-weight: 500; }
.terms-link { color: #C41230; text-decoration: underline; font-weight: 700; }

.divider { text-align: center; margin: 24px 0; color: #999; font-size: 14px; font-weight: 600; }

/* SWITCH LINK */
.switch-link { 
  display: block; text-align: center; color: #C41230; 
  text-decoration: underline; font-weight: 800; font-size: 14px; 
  text-transform: uppercase;
}

/* VANS RED PRIMARY BUTTON */
:deep(.btn-primary) {
  background-color: #C41230 !important;
  border: none !important;
  border-radius: 4px;
  height: 52px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

:deep(.btn-primary:hover) {
  background-color: #000 !important;
}

.error-alert { background: #fef2f2; border: 1px solid #fee2e2; color: #b91c1c; padding: 12px; border-radius: 4px; font-size: 14px; margin-bottom: 20px; font-weight: 600; }
</style>