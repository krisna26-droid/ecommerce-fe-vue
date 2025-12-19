<template>
  <div class="settings-page container">
    <h1 class="page-title">Settings</h1>

    <div class="settings-container">
      <aside class="settings-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/settings/profile" class="nav-item" active-class="active">
            <i class="fa-regular fa-user"></i>
            <span>Profile Details</span>
          </router-link>
          
          <router-link to="/settings/password" class="nav-item" active-class="active">
            <i class="fa-solid fa-lock"></i>
            <span>Change Password</span>
          </router-link>

          <router-link to="/settings/history" class="nav-item" active-class="active">
            <i class="fa-solid fa-clock-rotate-left"></i>
            <span>Transaction History</span>
          </router-link>
        </nav>
      </aside>

      <main class="settings-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  padding-top: 40px;
  padding-bottom: 80px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.settings-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

.settings-sidebar {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: #4b5563;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item i {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* Style saat menu aktif */
.nav-item.active {
  background-color: #f0fdfa; /* Teal muda */
  color: #0d9488;           /* Teal utama */
}

.settings-content {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  min-height: 500px;
}

/* Responsive untuk mobile */
@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}
</style>