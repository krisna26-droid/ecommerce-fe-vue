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
        <p class="upload-text">Change your profile photo</p>
        <p class="upload-hint">Format: JPG, PNG. Max 2MB.</p>
      </div>
    </div>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-grid">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" v-model="form.fullName" placeholder="Enter your full name" required />
        </div>

        <div class="form-group">
          <label>Username</label>
          <input type="text" v-model="form.username" placeholder="Enter username" required />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="form.email" placeholder="Enter email address" disabled />
          <small class="disabled-hint">Email cannot be changed</small>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="form.phone" placeholder="Enter phone number" />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-update" :disabled="loading">
          {{ loading ? 'UPDATING...' : 'UPDATE PROFILE' }}
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
      // Avatar default menggunakan warna Vans Red (#C41230)
      userAvatar: "https://ui-avatars.com/api/?name=User&background=C41230&color=fff",
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
          this.previewImage = e.target.result;
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

        await set(dbRef(rtdb, `users/${this.currentUser.uid}`), updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData));
        
        alert("Profile successfully updated!");
        window.location.reload(); 
      } catch (error) {
        alert("Failed to update profile: " + error.message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.section-title { 
  font-size: 20px; 
  font-weight: 800; 
  color: #000; 
  text-transform: uppercase; 
  margin-bottom: 32px; 
}

.avatar-section { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; }
.avatar-wrapper { position: relative; width: 100px; height: 100px; }

.profile-img { 
  width: 100%; height: 100%; 
  border-radius: 4px; /* Boxy style */
  object-fit: cover; 
  border: 2px solid #000; 
}

.upload-btn { 
  position: absolute; bottom: -8px; right: -8px; 
  background: #C41230; /* Vans Red */
  color: white; 
  width: 32px; height: 32px; 
  border-radius: 4px; 
  display: flex; align-items: center; justify-content: center; 
  cursor: pointer; border: 2px solid #000; 
}

.upload-text { font-weight: 700; font-size: 15px; color: #000; }
.upload-hint { font-size: 13px; color: #666; font-weight: 500; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 13px; font-weight: 800; color: #000; text-transform: uppercase; }

.form-group input { 
  padding: 12px 16px; 
  border: 2px solid #000; /* Bold industrial border */
  border-radius: 4px; 
  font-size: 14px; 
  font-weight: 600;
  transition: all 0.2s; 
}

.form-group input:focus { 
  outline: none; 
  border-color: #C41230; /* Red focus */
  box-shadow: 4px 4px 0px rgba(196, 18, 48, 0.1); 
}

.form-group input:disabled {
  background-color: #f3f3f3;
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.disabled-hint { color: #9ca3af; font-weight: 600; font-size: 11px; }

.form-actions { margin-top: 40px; display: flex; justify-content: flex-end; }

.btn-update { 
  background-color: #C41230; /* Vans Red */
  color: white; 
  padding: 14px 28px; 
  border-radius: 4px; 
  font-weight: 800; 
  text-transform: uppercase;
  border: none; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.btn-update:hover:not(:disabled) { 
  background-color: #000; 
  transform: translateY(-2px);
}

.btn-update:disabled { background-color: #ccc; cursor: not-allowed; }

@media (max-width: 640px) { .form-grid { grid-template-columns: 1fr; } }
</style>