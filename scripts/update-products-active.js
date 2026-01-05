#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

async function updateProductsActive() {
  try {
    console.log('🔥 Actualizando productos para que estén activos...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase inicializado correctamente');

    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    console.log(`📦 Encontrados ${querySnapshot.docs.length} productos`);

    let successCount = 0;
    let errorCount = 0;

    // Actualizar cada producto
    for (const productDoc of querySnapshot.docs) {
      try {
        const productRef = doc(db, 'products', productDoc.id);
        await updateDoc(productRef, {
          isActive: true,
          updatedAt: new Date()
        });
        
        console.log(`✅ Producto actualizado: ${productDoc.data().name} (ID: ${productDoc.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error actualizando ${productDoc.data().name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de actualización:');
    console.log(`✅ Productos actualizados exitosamente: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Total procesados: ${querySnapshot.docs.length}`);

    if (successCount > 0) {
      console.log('\n🎉 ¡Actualización completada!');
      console.log('📦 Todos los productos ahora están activos');
      console.log('🌐 El catálogo público ahora mostrará todos los productos');
    }

  } catch (error) {
    console.error('❌ Error en la actualización:', error);
    process.exit(1);
  }
}

// Ejecutar actualización
updateProductsActive();
