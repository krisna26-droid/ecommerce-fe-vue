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
            placeholder="Old password"
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
            placeholder="New password" 
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
            placeholder="Confirmation password" 
            required
          />
          <button type="button" class="toggle-eye" @click="showConfirm = !showConfirm" tabindex="-1">
            <i :class="showConfirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="loading">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// Menggunakan library resmi Firebase Auth
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
      // 1. Validasi kecocokan password baru
      if (this.form.newPassword !== this.form.confirmPassword) {
        alert("Konfirmasi password baru tidak cocok!");
        return;
      }

      // 2. Validasi panjang password
      if (this.form.newPassword.length < 6) {
        alert("Password baru minimal harus 6 karakter.");
        return;
      }

      this.loading = true;
      const auth = getAuth();
      const user = auth.currentUser;

      try {
        // 3. Re-autentikasi (WAJIB di Firebase sebelum ganti password sensitif)
        // Ini membuktikan ke server bahwa user saat ini tahu password lamanya
        const credential = EmailAuthProvider.credential(user.email, this.form.oldPassword);
        
        await reauthenticateWithCredential(user, credential);

        // 4. Update password di server Firebase
        await updatePassword(user, this.form.newPassword);

        alert("Password berhasil diperbarui! Silahkan gunakan password baru untuk login berikutnya.");
        
        // Reset form setelah berhasil
        this.form = { oldPassword: "", newPassword: "", confirmPassword: "" };
        
      } catch (error) {
        console.error("Update password error:", error);
        
        // Handling error spesifik Firebase
        if (error.code === 'auth/wrong-password') {
          alert("Password lama yang Anda masukkan salah.");
        } else if (error.code === 'auth/too-many-requests') {
          alert("Terlalu banyak percobaan gagal. Akun sementara terkunci, coba lagi nanti.");
        } else {
          alert("Gagal memperbarui password: " + error.message);
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
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 24px;
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
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 45px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #0d9488; /* Warna Teal sesuai desain profile & login */
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

.toggle-eye {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
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
  background-color: #0d9488; /* Konsisten dengan skema warna Vintage */
  color: white;
  padding: 10px 24px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background-color: #0f766e;
}

.btn-save:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>