<template>
  <div>
    <!-- Header & Footer hanya muncul jika BUKAN halaman auth -->
    <HeaderComponent v-if="!isAuthPage" />
    
    <router-view />
    
    <FooterComponent v-if="!isAuthPage" />
  </div>
</template>

<script>
import HeaderComponent from "./components/header/HeaderComponent.vue";
import FooterComponent from "./components/footer/FooterComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    FooterComponent,
  },
  computed: {
    isAuthPage() {
      // Cek apakah halaman saat ini adalah halaman auth
      const authRoutes = ['/login', '/register', '/signup'];
      return authRoutes.includes(this.$route.path);
    }
  }
};
</script>

<style></style>