#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

async function migrateImagesToStorage() {
  try {
    console.log('🖼️ Migrando imágenes a Firebase Storage...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const db = getFirestore(app);

    console.log('✅ Firebase inicializado correctamente');

    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    console.log(`📦 Encontrados ${querySnapshot.docs.length} productos`);

    let successCount = 0;
    let errorCount = 0;
    const imageUrlMap = new Map(); // Para evitar subir la misma imagen múltiples veces

    // Función para subir una imagen
    async function uploadImage(imageName) {
      if (imageUrlMap.has(imageName)) {
        return imageUrlMap.get(imageName);
      }

      try {
        const imagePath = path.join(process.cwd(), 'public', imageName);
        
        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️ Imagen no encontrada: ${imageName}`);
          return null;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const storageRef = ref(storage, `products/${imageName}`);
        
        const snapshot = await uploadBytes(storageRef, imageBuffer);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        imageUrlMap.set(imageName, downloadURL);
        console.log(`✅ Imagen subida: ${imageName}`);
        return downloadURL;
      } catch (error) {
        console.error(`❌ Error subiendo ${imageName}:`, error.message);
        return null;
      }
    }

    // Procesar cada producto
    for (const productDoc of querySnapshot.docs) {
      try {
        const productData = productDoc.data();
        const productId = productDoc.id;
        let needsUpdate = false;
        const updatedData = {};

        // Procesar imágenes principales
        if (productData.images && Array.isArray(productData.images)) {
          const imageUrls = [];
          for (const imageName of productData.images) {
            const url = await uploadImage(imageName);
            if (url) imageUrls.push(url);
          }
          if (imageUrls.length > 0) {
            updatedData.images = imageUrls;
            needsUpdate = true;
          }
        }

        // Procesar carouselImages
        if (productData.carouselImages && Array.isArray(productData.carouselImages)) {
          const carouselUrls = [];
          for (const imageName of productData.carouselImages) {
            const url = await uploadImage(imageName);
            if (url) carouselUrls.push(url);
          }
          if (carouselUrls.length > 0) {
            updatedData.carouselImages = carouselUrls;
            needsUpdate = true;
          }
        }

        // Procesar imagesByColor
        if (productData.imagesByColor && typeof productData.imagesByColor === 'object') {
          const updatedImagesByColor = {};
          let colorImagesChanged = false;
          
          for (const [color, images] of Object.entries(productData.imagesByColor)) {
            if (Array.isArray(images)) {
              const colorUrls = [];
              for (const imageName of images) {
                const url = await uploadImage(imageName);
                if (url) colorUrls.push(url);
              }
              if (colorUrls.length > 0) {
                updatedImagesByColor[color] = colorUrls;
                colorImagesChanged = true;
              }
            }
          }
          
          if (colorImagesChanged) {
            updatedData.imagesByColor = updatedImagesByColor;
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          const productRef = doc(db, 'products', productId);
          await updateDoc(productRef, {
            ...updatedData,
            updatedAt: new Date()
          });
          
          console.log(`✅ Producto actualizado: ${productData.name} (ID: ${productId})`);
          successCount++;
        } else {
          console.log(`⏭️ Sin cambios necesarios: ${productData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error procesando ${productDoc.data().name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`✅ Productos actualizados: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Total procesados: ${querySnapshot.docs.length}`);
    console.log(`🖼️ Imágenes únicas procesadas: ${imageUrlMap.size}`);

    if (successCount > 0) {
      console.log('\n🎉 ¡Migración completada!');
      console.log('🖼️ Las imágenes ahora están en Firebase Storage');
      console.log('🔗 Los productos ahora tienen URLs de Storage');
      console.log('🌐 El catálogo público ahora usará Storage');
    }

  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateImagesToStorage();
