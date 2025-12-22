<template>
  <header class="header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img
          src="@/assets/images/hero/logo.png"
          alt="Vans Off The Wall"
          class="logo-icon"
        />
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

      <div class="actions">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="btn btn-login">Login</router-link>
          <router-link to="/register" class="btn btn-signup"
            >Sign up</router-link
          >
        </template>

        <template v-else>
          <router-link to="/cart" class="icon-btn">
            <svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
          </router-link>

          <router-link to="/wishlist" class="icon-btn">
            <svg
              class="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span v-if="wishlistCount > 0" class="badge">{{
              wishlistCount
            }}</span>
          </router-link>

          <div class="user-dropdown" ref="userDropdown">
            <div @click.stop="toggleDropdown" class="user-trigger">
              <img :src="userAvatar" class="avatar" alt="User" />
              <span class="chevron">▾</span>
            </div>

            <div :class="['dropdown-menu', { show: showDropdown }]">
              <router-link
                to="/settings/profile"
                class="dropdown-item"
                @click="showDropdown = false"
              >
                <i class="fa-regular fa-user"></i> Profile Details
              </router-link>
              <router-link
                to="/settings/password"
                class="dropdown-item"
                @click="showDropdown = false"
              >
                <i class="fa-solid fa-lock"></i> Change Password
              </router-link>
              <router-link
                to="/settings/history"
                class="dropdown-item"
                @click="showDropdown = false"
              >
                <i class="fa-solid fa-clock-rotate-left"></i> Transaction
                History
              </router-link>
              <div class="dropdown-divider"></div>
              <button
                @click.stop="openLogoutModal"
                class="dropdown-item logout-item"
              >
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>
        </template>

        <div class="lang">EN <span class="chevron">▾</span></div>
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
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.loadUserData(user);
      } else {
        this.isLoggedIn = false;
      }
    });
    this.search = this.$route.query.search || "";
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    loadUserData(firebaseUser) {
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      const displayName =
        localUser.fullName ||
        (firebaseUser ? firebaseUser.displayName : "User");
      this.userAvatar =
        localUser.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayName
        )}&background=C41230&color=fff`;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleClickOutside(e) {
      if (
        this.showDropdown &&
        this.$refs.userDropdown &&
        !this.$refs.userDropdown.contains(e.target)
      ) {
        this.showDropdown = false;
      }
    },
    handleSearch() {
      const keyword = this.search.trim();
      this.$router.push({
        path: "/products",
        query: keyword ? { search: keyword } : {},
      });
    },
    openLogoutModal() {
      this.showDropdown = false;
      this.showLogoutModal = true;
    },
    async handleLogout() {
      await authService.logout();
      this.isLoggedIn = false;
      localStorage.removeItem("user");
      this.showLogoutModal = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.header {
  background-color: var(--vans-white);
  border-bottom: 2px solid var(--vans-black);
  position: sticky;
  top: 0;
  z-index: 1000; /* Menjamin header di atas konten apapun */
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
  display: block;
}

.search-wrapper {
  flex: 1;
}
.search-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 4px;
  border: 1px solid var(--vans-gray-border);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  outline: none;
}
.search-input:focus {
  border-color: var(--vans-red);
}

.actions {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative; /* Penting untuk Z-Index */
  z-index: 1001;
}

.btn {
  padding: 8px 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  transition: 0.2s;
  cursor: pointer;
  display: inline-block;
}

.btn-login {
  color: var(--vans-black);
  border: 1px solid var(--vans-black);
}
.btn-signup {
  background-color: var(--vans-red);
  color: var(--vans-white);
  border: 1px solid var(--vans-red);
}

.icon-btn {
  position: relative;
  color: var(--vans-black);
  padding: 4px;
}
.icon {
  width: 24px;
  height: 24px;
}
.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--vans-red);
  color: var(--vans-white);
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  border: 2px solid var(--vans-white);
}

.user-dropdown {
  position: relative;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid var(--vans-gray-border);
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  background: var(--vans-white);
  border: 2px solid var(--vans-black);
  min-width: 220px;
  padding: 8px;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: 0.2s;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--vans-black);
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}
.dropdown-item:hover {
  background: var(--vans-gray-light);
  color: var(--vans-red);
}

.dropdown-divider {
  height: 2px;
  background: var(--vans-black);
  margin: 8px 0;
}
.logout-item {
  color: var(--vans-red);
}
.lang {
  font-weight: 700;
  cursor: pointer;
}
</style>
