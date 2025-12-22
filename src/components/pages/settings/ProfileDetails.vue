<template>
  <div class="profile-details">
    <h2 class="section-title">Profile details</h2>

    <div class="avatar-section">
      <div class="avatar-wrapper">
        <img
          :src="previewImage || userAvatar"
          alt="Profile"
          class="profile-img"
        />
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

    <form @submit.prevent="updateProfile">
      <div class="vans-form-grid">
        <div class="vans-input-group">
          <label>Full Name</label>
          <input
            type="text"
            v-model="form.fullName"
            class="vans-input-field"
            required
          />
        </div>
        <div class="vans-input-group">
          <label>Username</label>
          <input
            type="text"
            v-model="form.username"
            class="vans-input-field"
            required
          />
        </div>
        <div class="vans-input-group">
          <label>Email Address</label>
          <input
            type="email"
            v-model="form.email"
            class="vans-input-field"
            disabled
          />
          <small class="disabled-hint">Email cannot be changed</small>
        </div>
        <div class="vans-input-group">
          <label>Phone Number</label>
          <input type="text" v-model="form.phone" class="vans-input-field" />
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-vans-primary btn-update"
          :disabled="loading"
        >
          {{ loading ? "UPDATING..." : "UPDATE PROFILE" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { rtdb } from "@/firebase/config";
import { ref as dbRef, get, set, child } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "ProfileDetails",
  data() {
    return {
      loading: false,
      previewImage: null,
      currentUser: null,
      userAvatar:
        "https://ui-avatars.com/api/?name=User&background=C41230&color=fff",
      form: { fullName: "", username: "", email: "", phone: "" },
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
        const snapshot = await get(
          child(dbRef(rtdb), `users/${this.currentUser.uid}`)
        );
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.form = { ...data };
          if (data.avatar) this.userAvatar = data.avatar;
        } else {
          this.form.email = this.currentUser.email;
        }
      } catch (error) {
        console.error(error);
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
          updatedAt: new Date().toISOString(),
        };
        await set(dbRef(rtdb, `users/${this.currentUser.uid}`), updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData));
        alert("Profile successfully updated!");
        window.location.reload();
      } catch (error) {
        alert("Error: " + error.message);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.section-title {
  font-size: 20px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 32px;
}
.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}
.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
}
.profile-img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
  border: 2px solid #000;
}
.upload-btn {
  position: absolute;
  bottom: -8px;
  right: -8px;
  background: var(--vans-red);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #000;
}
.upload-text {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 14px;
}
.upload-hint {
  font-size: 12px;
  color: #666;
}
.form-actions {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}
.btn-update {
  width: auto;
  padding-left: 40px;
  padding-right: 40px;
}
.disabled-hint {
  color: #999;
  font-weight: 700;
  font-size: 11px;
  margin-top: 4px;
}
</style>
