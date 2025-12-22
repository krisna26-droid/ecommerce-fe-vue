<template>
  <div class="auth-layout">
    <header class="auth-topbar">
      <div class="auth-topbar-container">
        <router-link to="/" class="auth-logo">
          <img src="@/assets/images/hero/logo.png" alt="Vans" />
        </router-link>
        <div class="auth-lang">EN <span>▾</span></div>
      </div>
    </header>

    <main class="auth-main">
      <div class="vans-auth-card">
        <div class="auth-header">
          <h1>Sign up</h1>
          <p>Join the Vans "Off The Wall" family</p>
        </div>

        <div v-if="errorMessage" class="vans-alert vans-alert-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <BaseInput
            v-model="formData.fullname"
            label="Full name"
            placeholder="Full name"
            required
          />
          <BaseInput
            v-model="formData.username"
            label="Username"
            placeholder="Username"
            required
          />
          <BaseInput
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="Email"
            required
          />

          <BaseInput
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            required
          >
            <template #append>
              <button
                type="button"
                class="toggle-password-btn"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="
                    showPassword
                      ? 'fa-regular fa-eye-slash'
                      : 'fa-regular fa-eye'
                  "
                ></i>
              </button>
            </template>
          </BaseInput>

          <BaseInput
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirm Password"
            required
          >
            <template #append>
              <button
                type="button"
                class="toggle-password-btn"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i
                  :class="
                    showConfirmPassword
                      ? 'fa-regular fa-eye-slash'
                      : 'fa-regular fa-eye'
                  "
                ></i>
              </button>
            </template>
          </BaseInput>

          <div class="terms-container">
            <label class="terms-label">
              <input type="checkbox" v-model="agreedToTerms" required />
              <span class="terms-text">
                I agree to the <a href="#">Terms</a> and
                <a href="#">Privacy Policy</a>.
              </span>
            </label>
          </div>

          <BaseButton
            variant="primary"
            type="submit"
            block
            :disabled="isLoading"
            class="btn-vans-primary auth-submit-btn"
          >
            {{ isLoading ? "Signing up..." : "Sign up" }}
          </BaseButton>
        </form>

        <div class="vans-divider"><span>Already have an account?</span></div>
        <router-link to="/login" class="vans-switch-link"
          >Login here</router-link
        >
      </div>
    </main>

    <SuccessModal
      :isVisible="showModal"
      @close="showModal = false"
      @go-home="navigateToHome"
    />
  </div>
</template>

<script>
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import SuccessModal from "@/components/modals/SuccsessModal.vue";
import authService from "@/services/authService";

export default {
  name: "WebSignup",
  components: { BaseButton, BaseInput, SuccessModal },
  data() {
    return {
      formData: {
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      showPassword: false,
      showConfirmPassword: false,
      agreedToTerms: false,
      showModal: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }
      this.isLoading = true;
      try {
        const result = await authService.register(this.formData);
        if (result.success) {
          this.showModal = true;
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        } else {
          this.errorMessage = result.error;
        }
      } catch (error) {
        this.errorMessage = "Sistem error.";
      } finally {
        this.isLoading = false;
      }
    },
    navigateToHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* REUSE STYLE DARI LOGIN AGAR KONSISTEN */
.auth-layout {
  min-height: 100vh;
  background-color: var(--vans-gray-light);
  display: flex;
  flex-direction: column;
}
.auth-topbar {
  background: var(--vans-white);
  border-bottom: 2px solid var(--vans-black);
  padding: 15px 0;
}
.auth-topbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.auth-logo img {
  width: 100px;
}
.auth-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}
.auth-header h1 {
  font-size: 24px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.auth-header p {
  font-size: 13px;
  color: #666;
  margin-bottom: 25px;
  font-weight: 600;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.toggle-password-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 5px;
}
.terms-container {
  margin: 5px 0;
}
.terms-label {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  cursor: pointer;
}
.terms-text {
  font-size: 12px;
  line-height: 1.4;
  color: #444;
}
.terms-text a {
  color: var(--vans-red);
  font-weight: 700;
  text-decoration: underline;
}
.auth-submit-btn {
  height: 50px;
  font-size: 14px;
}
.auth-lang {
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}
</style>
