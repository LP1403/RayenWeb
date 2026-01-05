#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import readline from 'readline';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

// Función para solicitar credenciales
async function promptCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Email de administrador: ', (email) => {
      rl.question('Contraseña: ', (password) => {
        rl.close();
        resolve({ email, password });
      });
    });
  });
}

async function addProductCost() {
  try {
    console.log('💰 Agregando campo "cost" a productos existentes...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log('🔐 Autenticación requerida\n');
    const { email, password } = await promptCredentials();

    console.log('\n🔓 Autenticando...');
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Autenticación exitosa\n');

    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    console.log(`📦 Encontrados ${querySnapshot.docs.length} productos\n`);

    let updated = 0;
    let skipped = 0;

    // Actualizar cada producto
    for (const productDoc of querySnapshot.docs) {
      const productData = productDoc.data();
      
      // Solo actualizar si no tiene el campo cost
      if (productData.cost === undefined || productData.cost === null) {
        // Por defecto, usar el 50% del precio de venta como costo
        // Esto es solo un valor inicial que luego podrás ajustar manualmente
        const estimatedCost = Math.round((productData.price || 0) * 0.5);
        
        await updateDoc(doc(db, 'products', productDoc.id), {
          cost: estimatedCost,
          updatedAt: new Date()
        });
        
        console.log(`✅ Producto "${productData.name}"`);
        console.log(`   Precio de venta: $${productData.price?.toLocaleString() || 0}`);
        console.log(`   Costo estimado: $${estimatedCost.toLocaleString()} (50% del precio)`);
        console.log(`   ⚠️  Ajusta manualmente el costo real en el panel de admin\n`);
        updated++;
      } else {
        console.log(`⏭️  Producto "${productData.name}" ya tiene costo: $${productData.cost.toLocaleString()}`);
        skipped++;
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   ✅ Actualizados: ${updated} productos`);
    console.log(`   ⏭️  Omitidos: ${skipped} productos`);
    
    if (updated > 0) {
      console.log('\n⚠️  IMPORTANTE:');
      console.log('   Los costos fueron calculados automáticamente como 50% del precio de venta.');
      console.log('   Debes revisar y ajustar cada producto manualmente en el panel de admin.');
      console.log('   Ve a Productos > Editar > Costo del Producto');
    }

    console.log('\n🎉 ¡Proceso completado!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      console.log('\n⚠️  Credenciales incorrectas. Verifica el email y contraseña.');
    }
    console.error(error);
    process.exit(1);
  }
}

addProductCost();

