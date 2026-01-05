#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

async function testStorageSetup() {
  try {
    console.log('🧪 Probando configuración de Firebase Storage...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    console.log('✅ Firebase inicializado correctamente');
    console.log('📦 Storage bucket:', storage.app.options.storageBucket);

    // Probar con una imagen pequeña (logo)
    const logoPath = path.join(process.cwd(), 'public', 'logoRayenBlanco.png');
    
    if (!fs.existsSync(logoPath)) {
      console.log('❌ Logo no encontrado en public/logoRayenBlanco.png');
      return;
    }

    console.log('📤 Subiendo logo de prueba...');
    
    const logoBuffer = fs.readFileSync(logoPath);
    const logoRef = ref(storage, 'test/logoRayenBlanco.png');
    
    const snapshot = await uploadBytes(logoRef, logoBuffer);
    console.log('✅ Logo subido exitosamente');
    console.log('📊 Tamaño:', snapshot.metadata.size, 'bytes');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 URL de descarga:', downloadURL);
    
    console.log('\n🎉 ¡Firebase Storage está configurado correctamente!');
    console.log('✅ Puedes proceder con la subida de imágenes');

  } catch (error) {
    console.error('❌ Error probando Storage:', error);
    
    if (error.code === 'storage/unauthorized') {
      console.log('\n💡 Solución:');
      console.log('1. Ve a Firebase Console > Storage > Rules');
      console.log('2. Asegúrate de que las reglas permitan escritura');
      console.log('3. O habilita "Start in test mode" temporalmente');
    } else if (error.code === 'storage/bucket-not-found') {
      console.log('\n💡 Solución:');
      console.log('1. Ve a Firebase Console > Storage');
      console.log('2. Haz clic en "Get started"');
      console.log('3. Configura Storage en tu proyecto');
    } else {
      console.log('\n💡 Verifica que:');
      console.log('1. Firebase Storage esté habilitado');
      console.log('2. Las reglas de Storage permitan escritura');
      console.log('3. El proyecto tenga permisos correctos');
    }
  }
}

testStorageSetup();
