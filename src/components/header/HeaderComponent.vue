<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="@/assets/images/hero/logo.png" alt="Vans Off The Wall" class="logo-icon" />
      </router-link>

      <div class="search-wrapper">
        <input
          type="text"
          v-model="search"
          @keyup.enter="handleSearch"
          class="search-input"
          placeholder="SEARCH FOR CLASSICS"
        />
      </div>

      <div v-if="!isLoggedIn" class="actions">
        <router-link to="/login" class="btn btn-login">Login</router-link>
        <router-link to="/register" class="btn btn-signup">Sign up</router-link>
        <div class="lang">EN <span class="chevron">▾</span></div>
      </div>

      <div v-else class="actions">
        <router-link to="/cart" class="icon-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </router-link>

        <router-link to="/wishlist" class="icon-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span v-if="wishlistCount > 0" class="badge">{{ wishlistCount }}</span>
        </router-link>

        <div class="user-dropdown" ref="userDropdown">
          <div @click.stop="toggleDropdown" class="user-trigger">
            <img :src="userAvatar" class="avatar" alt="User" />
            <span class="chevron">▾</span>
          </div>

          <div :class="['dropdown-menu', { show: showDropdown }]">
            <router-link to="/settings/profile" class="dropdown-item" @click="showDropdown = false">
              <i class="fa-regular fa-user"></i> Profile Details
            </router-link>
            <router-link to="/settings/password" class="dropdown-item" @click="showDropdown = false">
              <i class="fa-solid fa-lock"></i> Change Password
            </router-link>
            <router-link to="/settings/history" class="dropdown-item" @click="showDropdown = false">
              <i class="fa-solid fa-clock-rotate-left"></i> Transaction History
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click.stop="openLogoutModal" class="dropdown-item logout-item">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>

        <div class="lang">EN <span class="chevron">▾</span></div>
      </div>
    </div>

    <LogoutModal :isOpen="showLogoutModal" @close="showLogoutModal = false" @logout="handleLogout" />
  </header>
</template>

<script>
import LogoutModal from "@/components/modals/LogoutModal.vue";
import authService from "@/services/authService";

export default {
  name: "HeaderComponent",
  components: { LogoutModal },
  data() {
    return {
      search: "",
      isLoggedIn: false,
      showDropdown: false,
      showLogoutModal: false,
      cartCount: 0,
      wishlistCount: 0,
      userAvatar: "",
    };
  },
  mounted() {
    this.checkAuthStatus();
    // Fitur sinkronisasi input dengan parameter URL query
    this.search = this.$route.query.search || "";

    window.addEventListener("profile-updated", this.loadUserData);
    window.addEventListener("storage", this.handleStorageChange);
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    window.removeEventListener("profile-updated", this.loadUserData);
    window.removeEventListener("storage", this.handleStorageChange);
    document.removeEventListener("click", this.handleClickOutside);
  },
  watch: {
    // Fitur memantau navigasi URL secara real-time
    "$route.query.search"(newVal) {
      this.search = newVal || "";
    },
    // Fitur reset pencarian saat input dihapus manual
    search(newVal) {
      if (!newVal.trim() && this.$route.query.search) {
        this.$router.replace({ path: "/products", query: {} });
      }
    }
  },
  methods: {
    checkAuthStatus() {
      this.isLoggedIn = authService.isAuthenticated();
      if (this.isLoggedIn) this.loadUserData();
    },
    loadUserData() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      // UI-Avatars juga menggunakan background Vans Red (#C41230)
      this.userAvatar = user.avatar || `https://ui-avatars.com/api/?name=${user.fullName || 'User'}&background=C41230&color=fff`;
    },
    handleStorageChange(e) {
      if (e.key === 'user') this.loadUserData();
    },
    toggleDropdown() { this.showDropdown = !this.showDropdown; },
    handleClickOutside(e) {
      // Fitur menutup dropdown saat mengklik di mana saja selain menu tersebut
      if (this.$refs.userDropdown && !this.$refs.userDropdown.contains(e.target)) {
        this.showDropdown = false;
      }
    },
    handleSearch() {
      const keyword = this.search.trim();
      if (!keyword) return;
      this.$router.push({ path: "/products", query: { search: keyword } });
    },
    openLogoutModal() { 
      this.showDropdown = false; 
      this.showLogoutModal = true; 
    },
    async handleLogout() {
      await authService.logout();
      this.isLoggedIn = false;
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
/* VANS VISUAL IDENTITY */

.header {
  background-color: #ffffff;
  border-bottom: 2px solid #000000;
  position: relative;
  z-index: 1000; /* Mencegah elemen lain menutupi dropdown */
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo-icon {
  width: 120px;
  height: auto;
}

/* Pencarian gaya industrial Vans */
.search-wrapper { flex: 1; position: relative; }
.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  outline: none;
}
.search-input:focus {
  border-color: #C41230; /* Vans Red Focus */
}

/* Tombol Aksi */
.actions { display: flex; align-items: center; gap: 14px; }
.btn {
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  transition: 0.2s;
  cursor: pointer;
}
.btn-login { color: #000; border: 1px solid #000; }
.btn-login:hover { background-color: #f3f4f6; }
.btn-signup { 
  background-color: #C41230; 
  color: #ffffff; 
  border: 1px solid #C41230; 
}
.btn-signup:hover { background-color: #a00e26; }

/* Badge warna Vans Red */
.icon-btn { position: relative; color: #000; text-decoration: none; display: flex; align-items: center; }
.icon { width: 24px; height: 24px; }
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: #C41230; 
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  border: 2px solid white;
}

/* User Dropdown diperbaiki agar berfungsi stabil */
.user-dropdown { position: relative; }
.user-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; }

.avatar { 
  width: 35px; 
  height: 35px; 
  border-radius: 50%; 
  border: 2px solid #e5e7eb; 
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: #ffffff;
  border: 2px solid #000000;
  border-radius: 4px;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  padding: 8px;
  z-index: 1001; /* Pastikan dropdown muncul di paling atas */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: all 0.2s ease;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #C41230; /* Hover Merah */
}

.dropdown-divider {
  height: 2px;
  background-color: #000;
  margin: 8px 0;
}

.logout-item { color: #C41230; }

.lang { font-size: 14px; font-weight: 700; color: #000; cursor: pointer; }
</style>