// Data produk Vans dengan link gambar stabil
const vansProducts = {
  "v1": {
    "name": "Vans Old Skool Classic Black/White",
    "price": 1100000,
    "image": "https://images.https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1747942442/VN000D3HY28-HERO/Old-Skool-Shoe.png.com/is/image/Vans/VN000D3HY28-HERO?$583x583$",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 1250,
    "description": "The iconic side stripe skate shoe that started it all."
  },
  "v2": {
    "name": "Vans Sk8-Hi Black White",
    "price": 1300000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1753917953/VN000D5IB8C-HERO/Sk8Hi-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 890,
    "description": "Legendary high top with padded collars for support."
  },
  "v3": {
    "name": "Vans Classic Slip-On Checkerboard",
    "price": 1050000,
    "image": "https://images.https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714199/VN000EYEBPJ-HERO/Classic-SlipOn-Checkerboard-Shoe.png.com/is/image/Vans/VN000EYEBWW-HERO?$583x583$",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 5 - 11",
    "likes": 2100,
    "description": "The original checkerboard slip-on since 1977."
  },
  "v4": {
    "name": "Vans Knu Skool Black White",
    "price": 1450000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1755187209/VN0009QC6BT-HERO/Knu-Skool-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 3400,
    "description": "A modern 90s inspired puffy interpretation of the Old Skool."
  },
  "v5": {
    "name": "Vans Authentic True White",
    "price": 950000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713845/VN000EE3W00-HERO/Authentic-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 6 - 12",
    "likes": 450,
    "description": "Simple low top, lace-up profile with sturdy canvas."
  },
  "v6": {
    "name": "Vans Off The Wall Tee Black",
    "price": 449000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1764705016/VN00126FBLK-HERO/Know-No-Bounds-TShirt.png",
    "brand": "Vans",
    "category": "Apparel",
    "size": "S, M, L, XL",
    "likes": 880,
    "description": "100% Cotton classic logo t-shirt."
  }
  // Tambahkan data v7 sampai v25 dengan format yang sama
};

import { rtdb } from '@/firebase/config';
import { ref, set } from 'firebase/database';

// Nama fungsi disamakan dengan import di HomePage.vue
export const seedProducts = async () => {
  try {
    const productRef = ref(rtdb, 'products');
    await set(productRef, vansProducts);
    console.log('Produk Vans Berhasil Di-seed!');
  } catch (error) {
    console.error('Gagal seeding:', error);
  }
};