<template>
  <header class="header">
    <div class="header-container">
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
        <div class="user-dropdown" ref="userDropdown">
          <div @click.stop="toggleDropdown" class="user-trigger">
            <img :src="userAvatar" class="avatar" />
            <span class="chevron">▾</span>
          </div>

          <!-- Dropdown Menu -->
          <div :class="['dropdown-menu', { 'show': showDropdown }]" @click.stop>

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
import authService from "@/services/authService";

export default {
  name: "HeaderComponent",
  components: { LogoutModal },

  data() {
    return {
      search: "",
      isLoggedIn: true,
      showDropdown: false,
      showLogoutModal: false,
      cartCount: 0,
      wishlistCount: 0,
      userAvatar: "https://i.pravatar.cc/150?img=12",
    };
  },

  mounted() {
    this.isLoggedIn = authService.isAuthenticated();
    if (this.isLoggedIn) this.loadUserData();
    // Delay untuk memastikan DOM sudah ready dan event tidak conflict
    setTimeout(() => {
      document.addEventListener("click", this.handleClickOutside);
    }, 100);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    handleSearch() {
      if (this.search.trim()) {
        this.$router.push({
          path: '/products',
          query: { search: this.search.trim() }
        });
      }
    },

    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    closeDropdown() {
      this.showDropdown = false;
    },

    handleClickOutside(e) {
      const dropdown = this.$refs.userDropdown;
      if (dropdown && !dropdown.contains(e.target)) {
        this.showDropdown = false;
      }
    },

    openLogoutModal() {
      this.showDropdown = false;
      this.showLogoutModal = true;
    },

    async handleLogout() {
      const res = await authService.logout();
      if (res.success) {
        this.isLoggedIn = false;
        this.cartCount = 0;
        this.wishlistCount = 0;
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
/* Override CSS conflicts dan perbaiki dropdown display */
.user-dropdown {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Dropdown menu - ALWAYS hidden by default */
.user-dropdown .dropdown-menu {
  position: absolute !important;
  top: calc(100% + 8px) !important;
  right: 0 !important;
  left: auto !important;
  background-color: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  min-width: 200px !important;
  padding: 8px !important;
  z-index: 9999 !important;
  /* Hidden by default */
  opacity: 0 !important;
  visibility: hidden !important;
  transform: translateY(-10px) !important;
  transition: all 0.2s ease !important;
  pointer-events: none !important;
}

/* Show dropdown when has .show class */
.user-dropdown .dropdown-menu.show {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateY(0) !important;
  pointer-events: auto !important;
}

/* Dropdown items */
.user-dropdown .dropdown-menu a.dropdown-item,
.user-dropdown .dropdown-menu button.dropdown-item {
  background: transparent !important;
  padding: 12px 16px !important;
  transition: background-color 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 14px !important;
  color: #1f2937 !important;
  width: 100%;
  text-align: left;
  font-family: inherit;
  font-size: 15px;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.user-dropdown .dropdown-menu a.dropdown-item:hover,
.user-dropdown .dropdown-menu button.dropdown-item:hover {
  background-color: #f3f4f6 !important;
}

.user-dropdown .dropdown-menu .logout-item {
  color: #ef4444 !important;
}

.user-dropdown .dropdown-menu .logout-item:hover {
  background-color: #fef2f2 !important;
}
</style>