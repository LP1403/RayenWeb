#!/usr/bin/env node

/**
 * Script seguro para agregar números de producto
 * Este script debe ser ejecutado manualmente en la consola de Firebase
 * o con credenciales de administrador.
 * 
 * Para ejecutar desde la consola de Firebase:
 * 1. Ir a https://console.firebase.google.com/project/rayenweb-b321c/firestore
 * 2. Abrir la consola del navegador (F12)
 * 3. Copiar y pegar este código adaptado para el navegador
 * 
 * O ejecutar este script con variables de entorno:
 * ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=tupassword npm run add:product-numbers:safe
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

async function addProductNumbers() {
  try {
    console.log('📦 Agregando números identificadores a productos...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    // Verificar si hay credenciales en variables de entorno
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: Credenciales no proporcionadas\n');
      console.log('Por favor ejecuta el script con las variables de entorno:');
      console.log('ADMIN_EMAIL=tu@email.com ADMIN_PASSWORD=tupassword npm run add:product-numbers:safe\n');
      console.log('O ejecuta manualmente desde el panel de administración web (instrucciones en ORDERS_SYSTEM.md)');
      process.exit(1);
    }

    console.log('🔓 Autenticando como administrador...');
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log('✅ Autenticación exitosa\n');

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
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      console.log('\n⚠️  Credenciales incorrectas. Verifica el email y contraseña.');
    }
    console.error(error);
    process.exit(1);
  }
}

addProductNumbers();

