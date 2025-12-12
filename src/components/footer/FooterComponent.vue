<template>
  <footer>
    <div class="footer-container">
      
      <div class="footer-column">
        <h4>Vintage</h4>
        <ul>
          <li><a href="#">about us</a></li>
          <li><a href="#">Sustainability</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Advertising</a></li>
        </ul>
        <div class="social-icons">
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.8 7.8 0 0 0 7.994 0C3.627 0 .068 3.513.068 7.822c0 1.258.38 2.498 1.076 3.498L.027 15.6l3.54-1.047a7.848 7.848 0 0 0 3.737.97 7.772 7.772 0 0 0 7.072-4.328 7.8 7.8 0 0 0-1.554-7.877zM7.994 14.43a6.57 6.57 0 0 1-3.332-.894l-.234-.143-2.14 1.085 1.155-2.09-.16-.253a6.564 6.564 0 0 1-1.02-3.86 6.57 6.57 0 0 1 6.572-6.572c1.784 0 3.483.702 4.745 1.964a6.545 6.545 0 0 1 1.964 4.745c0 3.635-2.95 6.585-6.585 6.585z"/>
            </svg>
          </a>
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
              <path d="M8.051 1.999h.082a.75.75 0 0 1 .625.5v11a.75.75 0 0 1-.625.5h-.082A7.988 7.988 0 0 1 0 7.999a7.988 7.988 0 0 1 8.051-6.00zm2.235 6.136-3.88 2.228A.5.5 0 0 1 6 10.372V5.627a.5.5 0 0 1 .715-.436l3.88 2.228a.5.5 0 0 1 0 .872z"/>
            </svg>
          </a>
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
              <path d="M0 1.146C0 .513.526 0 1.17 0h13.66C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.17 1.146H1.17C.526 16 0 15.487 0 14.854zm4.943 12.247V8.67h-2.1c-.05.155-.08.312-.08.472v4.885h2.1zm-1.056-8.995c.57 0 1.03-.46 1.03-1.03s-.46-1.03-1.03-1.03S2.85 2.59 2.85 3.16s.46 1.03 1.03 1.03zM14 13.393h-2.1l-.19-.48c-.04-.1-.08-.2-.11-.31a5.6 5.6 0 0 0-4.6-2.5c-.88 0-1.7.2-2.35.59L5.94 13.39h-2.1V7.17h2.1V7.65c.53-.4 1.1-.73 1.77-.92.67-.19 1.4-.28 2.1-.28 2.37 0 4.06 1.16 4.67 3.4v4.39z"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-column">
        <h4>Discover</h4>
        <ul>
          <li><a href="#">How it works</a></li>
          <li><a href="#">Help center</a></li>
          <li><a href="#">Infoboard</a></li>
          <li><a href="#">Mobile apps</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Help</h4>
        <ul>
          <li><a href="#">Help center</a></li>
          <li><a href="#">Buying</a></li>
          <li><a href="#">Trust and Safety</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Community</h4>
        <ul>
          <li><a href="#">Community</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© Vintage, 2023</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent'
}
</script>

<style scoped>
/* CSS Khusus untuk Footer */
footer {
  background-color: #316b73;
  color: white;
  padding: 40px 80px;
  font-family: Arial, sans-serif;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

.footer-column h4 {
  margin-bottom: 10px;
  font-size: 18px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin: 6px 0;
}

.footer-column ul li a {
  color: white;
  text-decoration: none;
  font-size: 14px;
}

.footer-column ul li a:hover {
  text-decoration: underline;
}

.social-icons a {
    color: white; /* Untuk mewarnai SVG */
    margin-right: 10px;
    margin-top: 10px;
    display: inline-block;
}

.social-icons svg {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  margin-top: 30px;
  padding-top: 10px;
  font-size: 14px;
}
</style>