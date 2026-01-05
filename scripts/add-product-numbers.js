#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
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

async function addProductNumbers() {
  try {
    console.log('📦 Agregando números identificadores a productos...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log('🔐 Autenticación requerida para actualizar productos\n');
    const { email, password } = await promptCredentials();

    console.log('\n🔓 Autenticando...');
    await signInWithEmailAndPassword(auth, email, password);

    console.log('✅ Firebase inicializado correctamente');

    // Obtener todos los productos
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);

    console.log(`📊 Encontrados ${querySnapshot.docs.length} productos\n`);

    let productNumber = 1001; // Empezar desde 1001 para dar un aspecto más profesional

    // Actualizar cada producto
    for (const productDoc of querySnapshot.docs) {
      const productData = productDoc.data();
      
      // Solo actualizar si no tiene productNumber
      if (!productData.productNumber) {
        await updateDoc(doc(db, 'products', productDoc.id), {
          productNumber: productNumber,
          updatedAt: new Date()
        });
        
        console.log(`✅ Producto "${productData.name}" actualizado con número: ${productNumber}`);
        productNumber++;
      } else {
        console.log(`⏭️  Producto "${productData.name}" ya tiene número: ${productData.productNumber}`);
      }
    }

    // Crear o actualizar el contador de productos
    const counterRef = doc(db, 'counters', 'productCounter');
    await setDoc(counterRef, { count: productNumber }, { merge: true });
    
    console.log(`\n📈 Contador de productos actualizado a: ${productNumber}`);
    
    // Inicializar contador de pedidos si no existe
    const orderCounterRef = doc(db, 'counters', 'orderCounter');
    await setDoc(orderCounterRef, { count: 0 }, { merge: true });
    
    console.log('📊 Contador de pedidos inicializado');

    console.log('\n🎉 ¡Proceso completado exitosamente!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addProductNumbers();

