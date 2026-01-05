#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

// Productos existentes para migrar (desde src/data/products.ts)
const productsToMigrate = [
  {
    name: "Buzo Gato Psycho",
    category: "buzo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 25000,
    images: [
      "Mock up buzo gato negro-Espalda Negro.jpg",
      "Mock up buzo gato negro-frente Negro.jpg"
    ],
    imagesByColor: {
      "Negro": [
        "Mock up buzo gato negro-Espalda Negro.jpg",
        "Mock up buzo gato negro-frente Negro.jpg"
      ]
    },
    description: "Buzo de algodón premium con diseño exclusivo de gato en color negro, marrón o beige. Ideal para quienes buscan comodidad y estilo en una prenda versátil para cualquier ocasión.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      "Mock up buzo gato negro-Espalda Negro.jpg",
      "Mock up buzo gato negro-frente Negro.jpg"
    ],
    sizeInfo: {
      "S": { available: true, stock: 5 },
      "M": { available: true, stock: 8 },
      "L": { available: true, stock: 12 },
      "XL": { available: true, stock: 6 },
      "XXL": { available: false, stock: 0 },
      "XXXL": { available: false, stock: 0 }
    },
    stock: 31, // Suma de todos los talles disponibles
    isActive: true
  },
  {
    name: "Buzo Gato Colores",
    category: "buzo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Marrón", "Beige"],
    price: 25000,
    images: [
      "Mock buzo gato lentes-Marron osc.jpg",
      "Mock buzo gato lentes-frente Marron osc.jpg"
    ],
    imagesByColor: {
      "Marrón": [
        "Mock buzo gato lentes-Marron osc.jpg",
        "Mock buzo gato lentes-frente Marron osc.jpg"
      ],
      "Beige": [
        "Mock buzo gato lentes-Beige.jpg",
        "Mock buzo gato lentes-Beige frente.jpg"
      ]
    },
    description: "Buzo de algodón premium con diseño exclusivo de gato en color negro, marrón o beige. Ideal para quienes buscan comodidad y estilo en una prenda versátil para cualquier ocasión.",
    featured: false,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      "Mock buzo gato lentes-Marron osc.jpg",
      "Mock buzo gato lentes-frente Marron osc.jpg"
    ],
    stock: 20,
    isActive: true
  },
  {
    name: "Buzo Serpiente Negro",
    category: "buzo",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 27000,
    images: [
      "Mock buzo serpiente-Espalda.jpg",
      "Mock buzo serpiente-frente.jpg"
    ],
    description: "Buzo negro con diseño de serpiente, confeccionado en algodón premium. Perfecto para quienes buscan un estilo audaz y cómodo.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      "Mock buzo serpiente-Espalda.jpg",
      "Mock buzo serpiente-frente.jpg"
    ],
    stock: 15,
    isActive: true
  },
  {
    name: "Remera Flor Negra",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 18000,
    images: [
      "Mock up remera negra frente-Flor.jpg",
      "Mock up remera negra espalda-Flor.jpg"
    ],
    description: "Remera negra con diseño de flor, confeccionada en algodón premium. Elegancia y comodidad en una sola prenda.",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      "Mock up remera negra frente-Flor.jpg",
      "Mock up remera negra espalda-Flor.jpg"
    ],
    stock: 12,
    isActive: true
  },
  {
    name: "Remera Araña Negra",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 18000,
    images: [
      "Mock up remera negra espalda-Araña.jpg",
      "Mock up remera negra frente-Araña.jpg"
    ],
    description: "Remera negra con diseño de araña, confeccionada en algodón premium. Un toque de originalidad para tu outfit diario.",
    featured: false,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      "Mock up remera negra espalda-Araña.jpg",
      "Mock up remera negra frente-Araña.jpg"
    ],
    stock: 8,
    isActive: true
  },
  {
    name: "Remera Gato Color",
    category: "remera",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Negro"],
    price: 18000,
    images: [
      "Mock remera gato color-Frente Negro.jpg",
      "Mock remera gato color-Negro.jpg"
    ],
    imagesByColor: {
      "Negro": [
        "Mock remera gato color-Frente Negro.jpg",
        "Mock remera gato color-Negro.jpg"
      ]
    },
    description: "Remera Gato Color",
    featured: true,
    material: "100% Algodón Premium",
    care: "Lavar a máquina con agua fría. No usar blanqueador.",
    carouselImages: [
      "Mock remera gato color-Negro.jpg",
      "Mock remera gato color-Frente Negro.jpg"
    ],
    stock: 10,
    isActive: true
  }
];

async function migrateProducts() {
  try {
    console.log('🔥 Iniciando migración de productos reales a Firebase...\n');
    console.log('📦 Productos a migrar:');
    productsToMigrate.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });
    console.log('');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase inicializado correctamente');

    // Migrar cada producto
    const productsRef = collection(db, 'products');
    let successCount = 0;
    let errorCount = 0;

    for (const product of productsToMigrate) {
      try {
        const productData = {
          ...product,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = await addDoc(productsRef, productData);
        console.log(`✅ Producto migrado: ${product.name} (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrando ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`✅ Productos migrados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Total procesados: ${productsToMigrate.length}`);

    if (successCount > 0) {
      console.log('\n🎉 ¡Migración completada!');
      console.log('📦 Productos migrados con todos sus datos:');
      console.log('   • Imágenes y carruseles');
      console.log('   • Información de talles y stock');
      console.log('   • Colores y variantes');
      console.log('   • Material y cuidados');
      console.log('   • Productos destacados');
      console.log('\n🌐 Ve a Firebase Console > Firestore Database para ver los productos');
      console.log('🔧 Ahora puedes usar el admin para gestionar los productos');
    }

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateProducts();
