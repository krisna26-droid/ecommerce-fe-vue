<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-body-tertiary px-4 py-2">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="@/assets/images/hero/logo.png" alt="Logo" class="me-2" style="width: 35px; height: 35px; object-fit: contain;">
          <span class="fw-bold">Sanshit</span>
        </a>

        <form class="d-flex mx-auto my-2 my-lg-0" role="search" style="width: 50%;">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>

        <div class="d-flex">
          <button class="btn btn-outline-success me-2" type="button">
            <a href="#" class="buttonlogin">LOG IN</a>
          </button>
          <button class="btn btn-outline-secondary" type="button">
            <a href="#" class="buttonlogin">SIGN UP</a>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent'
}
</script>

<style scoped>
/* CSS Khusus untuk Header */
.buttonlogin {
  text-decoration: none;
  color: black;
}
</style>