<template>
  <header class="header">
    <div class="header-container">
      <!-- ... (bagian logo dan search tidak berubah) ... -->
      <!-- Logo -->
      <a href="/" class="logo">
        <img
          src="@/assets/images/hero/logo.png"
          alt="Logo"
          class="logo-icon"
        />
      </a>

      <!-- Search -->
      <div class="search-wrapper">
        <input
          type="text"
          v-model="search"
          class="search-input"
          placeholder="Search for items"
        />
      </div>

      <!-- Actions - GUEST -->
      <div v-if="!isLoggedIn" class="actions">
        <a href="/login" class="btn btn-login">Login</a>
        <a href="/register" class="btn btn-signup">Sign up</a>

        <div class="lang">
          EN <span class="chevron">▾</span>
        </div>
      </div>

      <!-- Actions - AUTH -->
      <div v-else class="actions">

        <!-- Cart -->
        <a href="/cart" class="icon-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </a>

        <!-- Wishlist -->
        <a href="/wishlist" class="icon-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span v-if="wishlistCount > 0" class="badge">{{ wishlistCount }}</span>
        </a>

        <!-- User Dropdown -->
        <!-- Tambahkan @click untuk memicu fungsi toggleDropdown -->
        <div class="user-dropdown" @click="toggleDropdown">
          <img :src="userAvatar" class="avatar" />
          <span class="chevron">▾</span>

          <!-- Tampilkan/sembunyikan menu berdasarkan showDropdown -->
          <div v-if="showDropdown" class="dropdown-menu">

            <a href="/profile" class="dropdown-item">
              <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a>

            <a href="/orders" class="dropdown-item">
              <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Order
            </a>

            <!-- Mencegah event click menyebar ke elemen induk dropdown -->
            <button
              @click.stop="openLogoutModal"
              class="dropdown-item logout-item"
            >
              <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>

          </div>
        </div>

        <!-- Language -->
        <div class="lang">
          EN <span class="chevron">▾</span>
        </div>
      </div>
    </div>

    <LogoutModal
      :isOpen="showLogoutModal"
      @close="showLogoutModal = false"
      @logout="handleLogout"
    />
  </header>
</template>

<script>
import LogoutModal from "@/components/modals/LogoutModal.vue";
// Ganti dengan path service autentikasi Anda yang sebenarnya
import authService from "@/services/authService";

export default {
  name: "HeaderComponent",
  components: { LogoutModal },

  data() {
    return {
      search: "",
      // isLoggedIn disetel ke true secara default untuk pengujian dropdown,
      // Anda bisa mengubahnya kembali ke false jika diperlukan
      isLoggedIn: true,
      // Status untuk mengontrol visibilitas dropdown
      showDropdown: false,
      showLogoutModal: false,
      cartCount: 1,
      wishlistCount: 1,
      userAvatar: "https://i.pravatar.cc/150?img=12",
    };
  },

  mounted() {
    // Memeriksa status login saat komponen dimuat
    this.isLoggedIn = authService.isAuthenticated();
    if (this.isLoggedIn) this.loadUserData();
    // Menambahkan event listener global untuk menangani klik di luar dropdown
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    // Membersihkan event listener saat komponen dihancurkan
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    // Fungsi untuk mengubah status showDropdown
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    // Fungsi untuk menutup dropdown jika klik dilakukan di luar elemen dropdown
    handleClickOutside(e) {
      // Menggunakan ref atau cara lain yang sesuai untuk mendapatkan elemen dropdown
      // Jika Anda tidak menggunakan `ref`, `this.$el.querySelector(".user-dropdown")` bisa digunakan
      const dropdown = this.$el.querySelector(".user-dropdown");
      if (dropdown && !dropdown.contains(e.target)) {
        this.showDropdown = false;
      }
    },

    openLogoutModal() {
      this.showDropdown = false;
      this.showLogoutModal = true;
    },

    async handleLogout() {
      // Logika logout dari authService Anda
      const res = await authService.logout();
      if (res.success) {
        this.isLoggedIn = false;
        this.cartCount = 0;
        this.wishlistCount = 0;
        // Ganti dengan router push Anda
        this.$router.push("/login");
      }
    },

    loadUserData() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.avatar) this.userAvatar = user.avatar;
    },
  },
};
</script>

<style scoped>
/* ... (bagian style tidak berubah) ... */
/* Styles tetap sama dengan yang Anda berikan */

/* ===== Header ===== */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}

/* ===== Logo ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 120px;
  height: 36px;
}

/* ===== Search ===== */
.search-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #0d9488;
}

/* ===== Actions ===== */
.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* ===== Buttons ===== */
.btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-login {
  color: #0d9488;
  border: 1px solid #0d9488;
}

.btn-login:hover {
  background-color: #f0fdfa;
}

.btn-signup {
  background-color: #0d9488;
  color: #ffffff;
}

.btn-signup:hover {
  background-color: #0f766e;
}

/* ===== Icon Buttons (Cart & Wishlist) ===== */
.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: #f3f4f6;
}

.icon {
  width: 24px;
  height: 24px;
}

.badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* ===== User Dropdown ===== */
.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.user-dropdown:hover {
  background-color: #f3f4f6;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

/* ===== Dropdown Menu - Updated Design ===== */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 8px;
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  color: #1f2937;
  text-decoration: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 400;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  background-color: transparent; /* Pastikan button memiliki background transparan */
  width: 100%; /* Pastikan button mengisi lebar dropdown-item */
  text-align: left; /* Pastikan teks button rata kiri */
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.logout-item {
  color: #ef4444;
  border-top: 1px solid #f3f4f6;
  margin-top: 8px;
  padding-top: 12px;
}

.logout-item:hover {
  background-color: #fef2f2;
}

.logout-item .dropdown-icon {
  color: #ef4444;
}

/* ===== Language Selector (Lang) ===== */
.lang {
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.lang:hover {
  background-color: #f3f4f6;
}

.chevron {
  font-size: 12px;
  margin-left: 2px;
}
</style>
