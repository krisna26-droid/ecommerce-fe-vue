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
/* 1. LAYOUT & CONTAINER */
.settings-page {
  padding-top: 40px;
  padding-bottom: 80px;
}

.page-title {
  font-size: 24px;
  font-weight: 800; /* Extra bold ala Vans */
  text-transform: uppercase;
  color: #000;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.settings-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

/* 2. SIDEBAR - Mengadopsi desain boxy Vans */
.settings-sidebar {
  background: #ffffff;
  border: 2px solid #000; /* Border tegas industrial */
  border-radius: 4px; /* Sudut lebih tajam */
  padding: 16px;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.05); /* Bayangan streetwear */
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
  color: #444;
  font-size: 15px;
  font-weight: 700; /* Tipografi lebih tebal */
  border-radius: 4px;
  transition: all 0.2s ease;
  text-transform: uppercase; /* Gaya Off The Wall */
}

.nav-item i {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-item:hover {
  background-color: #f3f3f3;
  color: #C41230; /* Hover Vans Red */
}

/* Style saat menu aktif: Menggunakan Vans Red (#C41230) */
.nav-item.active {
  background-color: #C41230; 
  color: #ffffff; 
}

/* 3. CONTENT AREA */
.settings-content {
  background: #ffffff;
  border: 2px solid #000; /* Border tegas industrial */
  border-radius: 4px;
  padding: 32px;
  min-height: 500px;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.05);
}

/* 4. RESPONSIVE MOBILE */
@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}
</style>