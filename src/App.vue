<template>
  <div id="app">
    <HeaderComponent v-if="!isAuthPage" />

    <main class="main-content">
      <router-view />
    </main>

    <FooterComponent v-if="!isAuthPage" />
  </div>
</template>

<script>
import HeaderComponent from "./components/header/HeaderComponent.vue";
import FooterComponent from "./components/footer/FooterComponent.vue";

export default {
  name: "App",
  components: { HeaderComponent, FooterComponent },
  computed: {
    isAuthPage() {
      // Menggunakan route name untuk keamanan
      return ["login", "register"].includes(this.$route.name);
    },
  },
};
</script>