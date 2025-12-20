<template>
  <div class="change-password">
    <h2 class="section-title">Change Password</h2>

    <form @submit.prevent="handleSave" class="password-form">
      <div class="form-group">
        <label>Old Password</label>
        <div class="input-wrapper">
          <input 
            :type="showOld ? 'text' : 'password'" 
            v-model="form.oldPassword" 
            placeholder="Enter old password"
            required
          />
          <button type="button" class="toggle-eye" @click="showOld = !showOld" tabindex="-1">
            <i :class="showOld ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>New Password</label>
        <div class="input-wrapper">
          <input 
            :type="showNew ? 'text' : 'password'" 
            v-model="form.newPassword" 
            placeholder="Enter new password" 
            required
          />
          <button type="button" class="toggle-eye" @click="showNew = !showNew" tabindex="-1">
            <i :class="showNew ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Confirmation New Password</label>
        <div class="input-wrapper">
          <input 
            :type="showConfirm ? 'text' : 'password'" 
            v-model="form.confirmPassword" 
            placeholder="Confirm new password" 
            required
          />
          <button type="button" class="toggle-eye" @click="showConfirm = !showConfirm" tabindex="-1">
            <i :class="showConfirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? 'SAVING...' : 'SAVE CHANGES' }}
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
  reauthenticateWithCredential 
} from "firebase/auth";

export default {
  name: "ChangePassword",
  data() {
    return {
      loading: false,
      showOld: false,
      showNew: false,
      showConfirm: false,
      form: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }
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
        const credential = EmailAuthProvider.credential(user.email, this.form.oldPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, this.form.newPassword);

        alert("Password successfully updated!");
        this.form = { oldPassword: "", newPassword: "", confirmPassword: "" };
        
      } catch (error) {
        console.error("Update password error:", error);
        if (error.code === 'auth/wrong-password') {
          alert("The old password you entered is incorrect.");
        } else {
          alert("Failed to update password: " + error.message);
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 14px;
  font-weight: 800; /* Extra bold ala Vans */
  color: #666;
  text-transform: uppercase;
  margin-bottom: 24px;
  letter-spacing: 1px;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 45px;
  border: 2px solid #000; /* Bold industrial border */
  border-radius: 4px; /* Boxy style */
  font-size: 14px;
  font-weight: 600;
  color: #000;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #C41230; /* Vans Red focus */
  box-shadow: 4px 4px 0px rgba(196, 18, 48, 0.1); 
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
  padding: 0;
  display: flex;
  align-items: center;
  z-index: 2;
}

.form-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  background-color: #C41230; /* Vans Red Utama */
  color: white;
  padding: 12px 28px;
  border-radius: 4px;
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-2px);
}

.btn-save:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>