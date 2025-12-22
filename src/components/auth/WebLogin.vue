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
          <h1>Login to Vans</h1>
          <p>Enter your details below</p>
        </div>

        <div v-if="errorMessage" class="vans-alert vans-alert-error">
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

          <BaseButton
            variant="primary"
            type="submit"
            block
            :disabled="isLoading"
            class="btn-vans-primary auth-submit-btn"
          >
            {{ isLoading ? "Logging in..." : "Continue" }}
          </BaseButton>
        </form>

        <div class="vans-divider">
          <span>Don't have an account?</span>
        </div>

        <router-link to="/register" class="vans-switch-link">
          Create an account
        </router-link>
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
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, child } from "firebase/database";

export default {
  name: "WebLogin",
  components: { BaseButton, BaseInput, SuccessModal },
  data() {
    return {
      formData: { email: "", password: "" },
      showPassword: false,
      showModal: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.isLoading = true;
      try {
        const result = await authService.login(
          this.formData.email,
          this.formData.password
        );
        if (result.success) {
          const userSnap = await get(
            child(dbRef(rtdb), `users/${result.user.uid}`)
          );
          if (userSnap.exists()) {
            localStorage.setItem("user", JSON.stringify(userSnap.val()));
          }
          window.dispatchEvent(new Event("profile-updated"));
          this.showModal = true;
          setTimeout(() => {
            this.navigateToHome();
          }, 1500);
        } else {
          this.errorMessage = result.error;
        }
      } catch (error) {
        this.errorMessage = "Terjadi kesalahan sistem.";
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
  width: 100%;
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
  margin-bottom: 30px;
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

.auth-submit-btn {
  height: 50px;
  margin-top: 10px;
  font-size: 14px;
}

.auth-lang {
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}
</style>
