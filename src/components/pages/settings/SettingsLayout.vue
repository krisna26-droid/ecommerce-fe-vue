<template>
  <div class="settings-page container">
    <h1 class="page-title">Settings</h1>

    <div class="settings-container">
      <aside class="settings-sidebar">
        <nav class="vans-settings-nav">
          <router-link
            to="/settings/profile"
            class="vans-nav-item"
            active-class="active"
          >
            <i class="fa-regular fa-user"></i>
            <span>Profile Details</span>
          </router-link>

          <router-link
            to="/settings/password"
            class="vans-nav-item"
            active-class="active"
          >
            <i class="fa-solid fa-lock"></i>
            <span>Change Password</span>
          </router-link>

          <router-link
            to="/settings/history"
            class="vans-nav-item"
            active-class="active"
          >
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
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.settings-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

.settings-sidebar {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 16px;
  box-shadow: var(--vans-shadow);
}

.settings-content {
  background: #fff;
  border: 2px solid #000;
  border-radius: 4px;
  padding: 32px;
  min-height: 500px;
  box-shadow: var(--vans-shadow);
}

@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}
</style>
