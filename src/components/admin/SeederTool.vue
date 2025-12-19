<template>
  <div class="seeder-container">
    <div class="seeder-card">
      <h3 class="title">Database Seeder</h3>
      <p class="desc">Klik tombol di bawah untuk mengisi Firebase dengan 25 produk Vans terbaru.</p>
      
      <button 
        @click="runSeeder" 
        :disabled="isProcessing" 
        class="btn-seed"
      >
        <i class="fa-solid fa-database"></i>
        {{ isProcessing ? 'PROCESSING...' : 'PUSH 25 PRODUCTS TO FIREBASE' }}
      </button>

      <p v-if="statusMessage" :class="['status', { 'error': isError }]">
        {{ statusMessage }}
      </p>
    </div>
  </div>
</template>

<script>
// Import fungsi seedProducts yang telah kita buat sebelumnya
import { seedProducts } from '@/firebase/seeder'; 

export default {
  name: 'SeederTool',
  data() {
    return {
      isProcessing: false,
      statusMessage: '',
      isError: false
    }
  },
  methods: {
    async runSeeder() {
      if (!confirm("Ini akan menimpa data produk yang sudah ada. Lanjutkan?")) return;
      
      this.isProcessing = true;
      this.statusMessage = 'Starting synchronization...';
      this.isError = false;

      try {
        await seedProducts();
        this.statusMessage = 'Successfully pushed 25 Vans products to Firebase!';
        this.isError = false;
      } catch (error) {
        this.statusMessage = 'Seeding failed. Check console for details.';
        this.isError = true;
      } finally {
        this.isProcessing = false;
      }
    }
  }
}
</script>

<style scoped>
.seeder-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.seeder-card {
  background: white;
  padding: 30px;
  border: 2px solid #000;
  border-radius: 4px;
  max-width: 400px;
  text-align: center;
  box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
}

.title {
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 10px;
  color: #000;
}

.desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.5;
}

.btn-seed {
  width: 100%;
  background-color: #C41230; /* Vans Red */
  color: white;
  border: none;
  padding: 15px;
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.2s;
}

.btn-seed:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-2px);
}

.btn-seed:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.status {
  margin-top: 20px;
  font-size: 13px;
  font-weight: 700;
  color: #2e7d32;
}

.status.error {
  color: #C41230;
}
</style>