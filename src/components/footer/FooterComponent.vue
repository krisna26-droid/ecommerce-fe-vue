<template>
  <footer>
    <div class="footer-container">
      
      <div class="footer-column">
        <h4>Vintage</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Sustainability</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Advertising</a></li>
        </ul>
        <div class="social-icons">
          <a href="#" aria-label="WhatsApp">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
          <a href="#" aria-label="YouTube">
            <i class="fa-brands fa-youtube"></i>
          </a>
          <a href="#" aria-label="LinkedIn">
            <i class="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i class="fa-brands fa-instagram"></i>
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
/* Memanggil library Font Awesome agar ikon muncul */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

footer {
  background-color: #316b73;
  color: white;
  padding: 40px 80px;
  font-family: Arial, sans-serif;
}

.footer-container {
  display: grid;
  /* Menggunakan auto-fit agar footer responsif di layar kecil */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
}

.footer-column h4 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin: 8px 0;
}

.footer-column ul li a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 14px;
}

.footer-column ul li a:hover {
  text-decoration: underline;
  color: white;
}

/* Perbaikan khusus Ikon agar terlihat */
.social-icons {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.social-icons a {
  color: white;
  font-size: 22px; /* Ukuran ikon */
  text-decoration: none;
  display: inline-block;
  transition: transform 0.2s ease, color 0.2s ease;
}

.social-icons a:hover {
  transform: translateY(-3px); /* Efek melayang */
}

/* Warna spesifik saat hover (opsional) */
.social-icons a:hover .fa-whatsapp { color: #25D366; }
.social-icons a:hover .fa-youtube { color: #FF0000; }
.social-icons a:hover .fa-linkedin-in { color: #0077B5; }
.social-icons a:hover .fa-instagram { color: #E4405F; }

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 40px;
  padding-top: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

/* Responsivitas untuk mobile */
@media (max-width: 768px) {
  footer {
    padding: 40px 20px;
  }
}
</style>