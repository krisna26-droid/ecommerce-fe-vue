// Data produk Vans terinspirasi dari katalog resmi Vans
const vansProducts = {
  "v1": {
    "name": "Vans Old Skool Classic Black/White",
    "price": 1100000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1747942442/VN000D3HY28-HERO/Old-Skool-Shoe.png",
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
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714199/VN000EYEBPJ-HERO/Classic-SlipOn-Checkerboard-Shoe.png",
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
  },
  "v7": {
    "name": "Vans Half Cab 33 DX",
    "price": 1550000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713915/VN0A5KX6B63-HERO/Half-Cab-33-DX-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 670,
    "description": "The heritage skate shoe that defined a generation."
  },
  "v8": {
    "name": "Vans Sk8-Low Classic Black",
    "price": 1150000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713980/VN0A4UUKB8C-HERO/Sk8Low-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 8 - 13",
    "likes": 320,
    "description": "A lower-cut version of the legendary Sk8-Hi."
  },
  "v9": {
    "name": "Vans Warp Check Backpack",
    "price": 799000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1755187126/VN00062GBA5-HERO/Old-Skool-Backpack.png",
    "brand": "Vans",
    "category": "Accessories",
    "size": "One Size",
    "likes": 560,
    "description": "Durable polyester backpack featuring the iconic checkerboard print."
  },
  "v10": {
    "name": "Vans Era Classic Navy",
    "price": 990000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713876/VN000EWZNVY-HERO/Era-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 5 - 12",
    "likes": 410,
    "description": "Lace-up low top with padded collars and the signature waffle outsole."
  },
  "v11": {
    "name": "Vans Core Basic Beanie Black",
    "price": 299000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713824/VN0A34GVBLK-HERO/Core-Basics-Beanie.png",
    "brand": "Vans",
    "category": "Accessories",
    "size": "One Size",
    "likes": 120,
    "description": "Essential cuffed beanie for everyday warmth."
  },
  "v12": {
    "name": "Vans Range Loose Tapered Pant",
    "price": 1099000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713783/VN0A5FJQBLK-HERO/Range-Loose-Tapered-Elastic-Waist-Pant.png",
    "brand": "Vans",
    "category": "Apparel",
    "size": "S, M, L, XL",
    "likes": 230,
    "description": "Elastic waist pant for ultimate comfort and style."
  },
  "v13": {
    "name": "Vans Curved Bill Jockey Hat",
    "price": 349000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713754/VN0A36IUBLK-HERO/Curved-Bill-Jockey-Hat.png",
    "brand": "Vans",
    "category": "Accessories",
    "size": "Adjustable",
    "likes": 95,
    "description": "Classic 6-panel hat with curved bill and logo embroidery."
  },
  "v14": {
    "name": "Vans Old Skool Stackform Black",
    "price": 1350000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714151/VN0A7Q5MBLK-HERO/Old-Skool-Stackform-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 5 - 10",
    "likes": 1420,
    "description": "The Old Skool updated with a platform chunky sole."
  },
  "v15": {
    "name": "Vans Checkerboard Ankle Socks",
    "price": 149000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714120/VN0A3H3XHU0-HERO/Checkerboard-Ankle-Sock.png",
    "brand": "Vans",
    "category": "Accessories",
    "size": "One Size",
    "likes": 75,
    "description": "Cotton blend ankle socks with iconic checkerboard pattern."
  },
  "v16": {
    "name": "Vans Standard Mid MTE Snow Boot",
    "price": 2400000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714102/VN0A5JHZBA2-HERO/Standard-Mid-MTE-Snow-Boot.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 180,
    "description": "Water-resistant mid-top boot built for cold conditions."
  },
  "v17": {
    "name": "Vans EVDNT RW UltimateWaffle",
    "price": 1650000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714078/VN0A5DY7BLK-HERO/EVDNT-RW-UltimateWaffle-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 8 - 12",
    "likes": 920,
    "description": "Vans first-ever lifestyle shoe with skate-tech performance."
  },
  "v18": {
    "name": "Vans Ultrarange Exo SE",
    "price": 1599000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714035/VN0A4UWMB8C-HERO/UltraRange-EXO-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 1100,
    "description": "Designed for comfort on the go with UltraCush midsole."
  },
  "v19": {
    "name": "Vans MN Flying V Tee White",
    "price": 399000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740714012/VN000GGGWT0-HERO/Flying-V-TShirt.png",
    "brand": "Vans",
    "category": "Apparel",
    "size": "S, M, L",
    "likes": 440,
    "description": "Simple white tee with Flying V heritage logo."
  },
  "v20": {
    "name": "Vans Slip-On Mule Checkerboard",
    "price": 1050000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713944/VN0A4P3U5GU-HERO/Classic-SlipOn-Mule.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 5 - 10",
    "likes": 670,
    "description": "The convenience of a mule meets the style of a Slip-On."
  },
  "v21": {
    "name": "Vans Checkerboard Bucket Hat",
    "price": 499000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713803/VN0A3HZH705-HERO/Checkerboard-Bucket-Hat.png",
    "brand": "Vans",
    "category": "Accessories",
    "size": "S/M, L/XL",
    "likes": 310,
    "description": "Retro bucket hat with allover checkerboard print."
  },
  "v22": {
    "name": "Vans Drill Chore Coat MTE",
    "price": 1899000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713721/VN0A456SBLK-HERO/Drill-Chore-Coat-MTE.png",
    "brand": "Vans",
    "category": "Apparel",
    "size": "M, L, XL",
    "likes": 150,
    "description": "Water-repellent chore coat designed for the elements."
  },
  "v23": {
    "name": "Vans ComfyCush Old Skool Black",
    "price": 1250000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713695/VN0A3WMAVNE-HERO/ComfyCush-Old-Skool-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 840,
    "description": "Cloud-like comfort with ComfyCush co-molded construction."
  },
  "v24": {
    "name": "Vans Hi-Standard OG Snowboard Boot",
    "price": 3200000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713670/VN0A3TFSBA2-HERO/HiStandard-OG-Snowboard-Boot.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 8 - 11",
    "likes": 90,
    "description": "The best-selling Vans snowboard boot of all time."
  },
  "v25": {
    "name": "Vans Wayvee Skate Shoes",
    "price": 1499000,
    "image": "https://assets.vans.com/images/t_img/c_fill,g_center,f_auto,h_573,e_unsharp_mask:100,w_458/dpr_2.0/v1740713645/VN0A5JIA9DJ-HERO/Wayvee-Shoe.png",
    "brand": "Vans",
    "category": "Shoes",
    "size": "US 7 - 12",
    "likes": 530,
    "description": "Designed by skaters, for skaters to push the limits of style and performance."
  }
};

import { rtdb } from '@/firebase/config';
import { ref, set } from 'firebase/database';

export const seedProducts = async () => {
  try {
    const productRef = ref(rtdb, 'products');
    await set(productRef, vansProducts);
    console.log('Produk Vans Berhasil Di-seed dengan 25 item!');
  } catch (error) {
    console.error('Gagal seeding:', error);
  }
};