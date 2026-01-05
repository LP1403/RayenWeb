#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

async function cleanupDuplicateProducts() {
  try {
    console.log('🧹 Limpiando productos duplicados...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('✅ Firebase inicializado correctamente');

    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    console.log(`📦 Encontrados ${querySnapshot.docs.length} productos`);

    // Agrupar productos por nombre
    const productsByName = new Map();
    const duplicates = [];

    querySnapshot.docs.forEach(doc => {
      const product = doc.data();
      const name = product.name;
      
      if (!productsByName.has(name)) {
        productsByName.set(name, []);
      }
      
      productsByName.get(name).push({
        id: doc.id,
        data: product,
        createdAt: product.createdAt?.toDate() || new Date(0)
      });
    });

    // Identificar duplicados (mantener el más reciente)
    for (const [name, products] of productsByName) {
      if (products.length > 1) {
        console.log(`\n🔄 Producto duplicado encontrado: "${name}" (${products.length} copias)`);
        
        // Ordenar por fecha de creación (más reciente primero)
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        // Mantener el primero (más reciente) y marcar el resto para eliminar
        const toKeep = products[0];
        const toDelete = products.slice(1);
        
        console.log(`  ✅ Mantener: ${toKeep.id} (creado: ${toKeep.createdAt.toISOString()})`);
        
        toDelete.forEach(product => {
          console.log(`  ❌ Eliminar: ${product.id} (creado: ${product.createdAt.toISOString()})`);
          duplicates.push(product.id);
        });
      }
    }

    if (duplicates.length === 0) {
      console.log('\n🎉 ¡No se encontraron productos duplicados!');
      return;
    }

    console.log(`\n📊 Resumen:`);
    console.log(`🔄 Productos únicos: ${productsByName.size}`);
    console.log(`❌ Duplicados a eliminar: ${duplicates.length}`);

    // Confirmar eliminación
    console.log('\n⚠️  ¿Estás seguro de que quieres eliminar los productos duplicados?');
    console.log('   Esto eliminará permanentemente los productos marcados como duplicados.');
    console.log('   Presiona Ctrl+C para cancelar, o espera 5 segundos para continuar...');

    // Esperar 5 segundos
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Eliminar duplicados
    let deletedCount = 0;
    let errorCount = 0;

    for (const productId of duplicates) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        console.log(`✅ Eliminado: ${productId}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Error eliminando ${productId}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Resumen de limpieza:');
    console.log(`✅ Productos eliminados: ${deletedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📦 Total procesados: ${duplicates.length}`);

    if (deletedCount > 0) {
      console.log('\n🎉 ¡Limpieza completada!');
      console.log('🧹 Los productos duplicados han sido eliminados');
      console.log('📦 Ahora tienes solo productos únicos');
    }

  } catch (error) {
    console.error('❌ Error en la limpieza:', error);
    process.exit(1);
  }
}

// Ejecutar limpieza
cleanupDuplicateProducts();
