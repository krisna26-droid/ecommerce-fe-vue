<template>
  <div class="profile-details">
    <h2 class="section-title">Profile details</h2>

    <div class="avatar-section">
      <div class="avatar-wrapper">
        <img :src="previewImage || userAvatar" alt="Profile" class="profile-img" />
        <label for="avatar-upload" class="upload-btn">
          <i class="fa-solid fa-camera"></i>
        </label>
        <input 
          id="avatar-upload" 
          type="file" 
          hidden 
          @change="handleImageUpload" 
          accept="image/*" 
        />
      </div>
      <div class="avatar-info">
        <p class="upload-text">Ganti foto profil Anda</p>
        <p class="upload-hint">Format: JPG, PNG. Maksimal 2MB.</p>
      </div>
    </div>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-grid">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="form.fullName" placeholder="Masukkan nama lengkap" required />
        </div>

        <div class="form-group">
          <label>Username</label>
          <input type="text" v-model="form.username" placeholder="Masukkan username" required />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="form.email" placeholder="Masukkan alamat email" disabled />
          <small style="color: #6b7280;">Email tidak dapat diubah</small>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="form.phone" placeholder="Masukkan nomor telepon" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-update" :disabled="loading">
          {{ loading ? 'Updating...' : 'Update Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { rtdb } from '@/firebase/config';
import { ref as dbRef, get, set, child } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  name: "ProfileDetails",
  data() {
    return {
      loading: false,
      previewImage: null,
      currentUser: null,
      userAvatar: "https://ui-avatars.com/api/?name=User&background=0d9488&color=fff",
      form: {
        fullName: "",
        username: "",
        email: "",
        phone: ""
      }
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.fetchUserProfile();
      }
    });
  },
  methods: {
    async fetchUserProfile() {
      try {
        const snapshot = await get(child(dbRef(rtdb), `users/${this.currentUser.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.form = { ...data };
          if (data.avatar) this.userAvatar = data.avatar;
        } else {
          // Fallback jika data di DB belum ada
          this.form.email = this.currentUser.email;
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result; // Base64 string untuk demo
        };
        reader.readAsDataURL(file);
      }
    },

    async updateProfile() {
      if (!this.currentUser) return;
      this.loading = true;
      
      try {
        const updatedData = {
          ...this.form,
          avatar: this.previewImage || this.userAvatar,
          updatedAt: new Date().toISOString()
        };

        // 1. Simpan ke Firebase Realtime Database
        await set(dbRef(rtdb, `users/${this.currentUser.uid}`), updatedData);

        // 2. Simpan ke LocalStorage untuk Header
        localStorage.setItem("user", JSON.stringify(updatedData));
        
        alert("Profil berhasil diperbarui!");
        window.location.reload(); 
      } catch (error) {
        alert("Gagal memperbarui profil: " + error.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Style Anda tetap sama */
.section-title { font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 32px; }
.avatar-section { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
.avatar-wrapper { position: relative; width: 100px; height: 100px; }
.profile-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb; }
.upload-btn { position: absolute; bottom: 0; right: 0; background: #0d9488; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 3px solid white; }
.upload-text { font-weight: 600; font-size: 15px; color: #111827; }
.upload-hint { font-size: 13px; color: #6b7280; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 14px; font-weight: 500; color: #374151; }
.form-group input { padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; }
.form-group input:focus { outline: none; border-color: #0d9488; box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1); }
.form-actions { margin-top: 40px; display: flex; justify-content: flex-end; }
.btn-update { background-color: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; transition: background 0.2s; }
.btn-update:hover { background-color: #0f766e; }
.btn-update:disabled { background-color: #9ca3af; cursor: not-allowed; }
@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
</style>