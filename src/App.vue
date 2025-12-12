<template>
  <div>
    <HeaderComponent />
    <router-view />
    <FooterComponent />
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
};
</script>

<style>
/* Tidak ada yang perlu diubah di sini */
</style>
