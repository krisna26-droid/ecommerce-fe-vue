<template>
  <div class="change-password">
    <h2 class="section-title">Change Password</h2>

    <form @submit.prevent="handleSave" class="password-form">
      <div class="vans-input-group">
        <label>Old Password</label>
        <div class="input-wrapper">
          <input
            :type="showOld ? 'text' : 'password'"
            v-model="form.oldPassword"
            class="vans-input-field"
            required
          />
          <button type="button" class="toggle-eye" @click="showOld = !showOld">
            <i
              :class="showOld ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
            ></i>
          </button>
        </div>
      </div>

      <div class="vans-input-group">
        <label>New Password</label>
        <div class="input-wrapper">
          <input
            :type="showNew ? 'text' : 'password'"
            v-model="form.newPassword"
            class="vans-input-field"
            required
          />
          <button type="button" class="toggle-eye" @click="showNew = !showNew">
            <i
              :class="showNew ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"
            ></i>
          </button>
        </div>
      </div>

      <div class="vans-input-group">
        <label>Confirmation New Password</label>
        <div class="input-wrapper">
          <input
            :type="showConfirm ? 'text' : 'password'"
            v-model="form.confirmPassword"
            class="vans-input-field"
            required
          />
          <button
            type="button"
            class="toggle-eye"
            @click="showConfirm = !showConfirm"
          >
            <i
              :class="
                showConfirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'
              "
            ></i>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-vans-primary btn-save"
          :disabled="loading"
        >
          {{ loading ? "SAVING..." : "SAVE CHANGES" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default {
  name: "ChangePassword",
  data() {
    return {
      loading: false,
      showOld: false,
      showNew: false,
      showConfirm: false,
      form: { oldPassword: "", newPassword: "", confirmPassword: "" },
    };
  },
  methods: {
    async handleSave() {
      if (this.form.newPassword !== this.form.confirmPassword) {
        alert("Confirmation password does not match!");
        return;
      }
      if (this.form.newPassword.length < 6) {
        alert("New password must be at least 6 characters.");
        return;
      }
      this.loading = true;
      const auth = getAuth();
      const user = auth.currentUser;
      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          this.form.oldPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, this.form.newPassword);
        alert("Password successfully updated!");
        this.form = { oldPassword: "", newPassword: "", confirmPassword: "" };
      } catch (error) {
        if (error.code === "auth/wrong-password") {
          alert("Incorrect old password.");
        } else {
          alert("Error: " + error.message);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.section-title {
  font-size: 14px;
  font-weight: 900;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 24px;
  letter-spacing: 1px;
}
.password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-wrapper {
  position: relative;
  width: 100%;
}
.input-wrapper input {
  width: 100%;
  padding-right: 45px;
}
.toggle-eye {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  display: flex;
}
.form-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
.btn-save {
  width: auto;
}
</style>
