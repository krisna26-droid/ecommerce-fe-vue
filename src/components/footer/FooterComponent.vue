<template>
  <footer class="vans-footer">
    <div class="checkerboard-pattern"></div>

    <div class="footer-container">
      <div class="footer-column">
        <h4>Vans</h4>
        <ul>
          <li><a href="#">About Vans</a></li>
          <li><a href="#">Sustainability</a></li>
          <li><a href="#">News</a></li>
          <li><a href="#">Customs</a></li>
        </ul>
        <div class="social-icons">
          <a href="#" aria-label="WhatsApp"
            ><i class="fa-brands fa-whatsapp"></i
          ></a>
          <a href="#" aria-label="YouTube"
            ><i class="fa-brands fa-youtube"></i
          ></a>
          <a href="#" aria-label="LinkedIn"
            ><i class="fa-brands fa-linkedin-in"></i
          ></a>
          <a href="#" aria-label="Instagram"
            ><i class="fa-brands fa-instagram"></i
          ></a>
        </div>
      </div>

      <div class="footer-column">
        <h4>Discover</h4>
        <ul>
          <li><a href="#">Store Locator</a></li>
          <li><a href="#">Affiliate Program</a></li>
          <li><a href="#">Vans Family</a></li>
          <li><a href="#">Events</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Help</h4>
        <ul>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Order Status</a></li>
          <li><a href="#">Returns & Exchanges</a></li>
          <li><a href="#">Shipping Information</a></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Support</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Size Charts</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© Vans Off The Wall, 2023</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
};
</script>

<style scoped>
/* Pastikan FontAwesome sudah ter-import di main.js atau index.html */

.vans-footer {
  background-color: var(--vans-black);
  color: var(--vans-white);
  padding: 0 0 40px 0;
  width: 100%;
}

.checkerboard-pattern {
  height: 12px;
  width: 100%;
  margin-bottom: 40px;
  background-image: linear-gradient(45deg, #fff 25%, transparent 25%),
    linear-gradient(-45deg, #fff 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #fff 75%),
    linear-gradient(-45deg, transparent 75%, #fff 75%);
  background-size: 12px 12px;
  background-position: 0 0, 0 6px, 6px 6px, 6px 0;
  background-color: #000;
  opacity: 0.8;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 40px;
  padding: 0 80px;
}

.footer-column h4 {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin: 10px 0;
}

.footer-column ul li a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-column ul li a:hover {
  color: var(--vans-red);
}

.social-icons {
  margin-top: 25px;
  display: flex;
  gap: 20px;
}

.social-icons a {
  color: var(--vans-white);
  font-size: 20px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.social-icons a:hover {
  transform: scale(1.2);
  color: var(--vans-red);
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 40px 80px 0 80px;
  padding-top: 25px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .footer-container {
    padding: 0 24px;
    gap: 30px;
  }
  .footer-bottom {
    margin: 40px 24px 0 24px;
  }
}
</style>
