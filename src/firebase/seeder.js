import { rtdb } from './config';
import { ref, push, set } from 'firebase/database';

const productsData = [
  { name: "Classic White Tee", price: "150000", category: "T-Shirt", size: "M", color: "White", shipping: "15000", description: "Cotton 100% comfortable for daily use.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
  { name: "Slim Fit Jeans", price: "450000", category: "Pants", size: "32", color: "Dark Blue", shipping: "20000", description: "Durable denim with a modern slim cut.", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" },
  { name: "Oversized Hoodie", price: "350000", category: "Hoodie", size: "L", color: "Black", shipping: "20000", description: "Warm fleece material, perfect for cold weather.", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" },
  { name: "Running Sneakers", price: "899000", category: "Shoes", size: "42", color: "Grey", shipping: "25000", description: "Lightweight and breathable for active runners.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { name: "Floral Summer Dress", price: "299000", category: "Dress", size: "S", color: "Yellow", shipping: "18000", description: "Lightweight fabric with beautiful floral patterns.", image: "https://images.unsplash.com/photo-1572804013307-59a8ffad5174?w=500" },
  { name: "Leather Jacket", price: "1200000", category: "Jacket", size: "L", color: "Brown", shipping: "30000", description: "Genuine leather jacket for a classic biker look.", image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=500" },
  { name: "Canvas Backpack", price: "250000", category: "Accessories", size: "One Size", color: "Olive", shipping: "15000", description: "Spacious backpack for school or travel.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
  { name: "Formal Blazer", price: "750000", category: "Outerwear", size: "XL", color: "Navy", shipping: "22000", description: "Professional blazer for office or formal events.", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500" },
  { name: "Beanie Hat", price: "85000", category: "Accessories", size: "One Size", color: "Red", shipping: "10000", description: "Soft knit beanie to keep you warm.", image: "https://images.unsplash.com/photo-1576871337622-98d48d890e49?w=500" },
  { name: "Chino Shorts", price: "199000", category: "Pants", size: "30", color: "Khaki", shipping: "15000", description: "Comfortable shorts for a casual weekend.", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500" },
  { name: "Polo Shirt", price: "225000", category: "T-Shirt", size: "L", color: "Green", shipping: "15000", description: "Classic polo with embroidered logo.", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500" },
  { name: "Leather Boots", price: "950000", category: "Shoes", size: "43", color: "Black", shipping: "28000", description: "Stylish and rugged boots for outdoors.", image: "https://images.unsplash.com/photo-1520639889410-d65c3b1df038?w=500" },
  { name: "Tote Bag", price: "120000", category: "Accessories", size: "One Size", color: "Beige", shipping: "12000", description: "Eco-friendly canvas tote bag.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500" },
  { name: "Denim Jacket", price: "400000", category: "Jacket", size: "M", color: "Light Blue", shipping: "20000", description: "Vintage wash denim jacket.", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500" },
  { name: "Sunglasses", price: "175000", category: "Accessories", size: "One Size", color: "Black", shipping: "10000", description: "UV protection stylish sunglasses.", image: "https://images.unsplash.com/photo-1511499767390-a7335958dad7?w=500" },
  { name: "Graphic Sweatshirt", price: "280000", category: "Hoodie", size: "L", color: "Purple", shipping: "18000", description: "Cool graphic print on soft cotton fabric.", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" },
  { name: "Cargo Pants", price: "320000", category: "Pants", size: "34", color: "Grey", shipping: "20000", description: "Utility pants with multiple pockets.", image: "https://images.unsplash.com/photo-1517438476312-10d79c67750d?w=500" },
  { name: "High Waisted Skirt", price: "240000", category: "Skirt", size: "S", color: "Pink", shipping: "15000", description: "Elegant skirt for casual outings.", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500" },
  { name: "Wool Scarf", price: "110000", category: "Accessories", size: "One Size", color: "Grey", shipping: "10000", description: "Soft wool scarf for winter seasons.", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500" },
  { name: "Leather Belt", price: "150000", category: "Accessories", size: "L", color: "Tan", shipping: "10000", description: "Genuine leather belt with silver buckle.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500" },
  { name: "Active Leggings", price: "210000", category: "Sportswear", size: "M", color: "Black", shipping: "15000", description: "Stretchable fabric for gym and yoga.", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500" },
  { name: "V-Neck Cardigan", price: "330000", category: "Outerwear", size: "S", color: "Cream", shipping: "18000", description: "Cozy knit cardigan with buttons.", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500" },
  { name: "Suede Loafers", price: "680000", category: "Shoes", size: "41", color: "Blue", shipping: "22000", description: "Comfortable loafers for semi-formal looks.", image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=500" },
  { name: "Striped Button Up", price: "260000", category: "Shirt", size: "L", color: "White/Blue", shipping: "15000", description: "Smart casual striped shirt.", image: "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=500" },
  { name: "Minimalist Watch", price: "1250000", category: "Accessories", size: "One Size", color: "Silver", shipping: "30000", description: "Elegant silver watch with leather strap.", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500" }
];

export const seedProducts = async () => {
  const productsRef = ref(rtdb, 'products');
  try {
    for (const item of productsData) {
      const newProductRef = push(productsRef);
      await set(newProductRef, item);
    }
    console.log("25 Data Berhasil Ditambahkan!");
  } catch (error) {
    console.error("Gagal menambahkan data:", error);
  }
};