#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

async function testStorageSimple() {
  try {
    console.log('🧪 Probando Storage con configuración simple...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    console.log('✅ Firebase inicializado');
    console.log('📦 Storage bucket:', storage.app.options.storageBucket);

    // Crear un archivo de prueba simple
    const testContent = 'Hello Firebase Storage!';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    console.log('📤 Subiendo archivo de prueba...');
    
    const testRef = ref(storage, 'test/simple-test.txt');
    const snapshot = await uploadBytes(testRef, testBlob);
    
    console.log('✅ Archivo subido exitosamente');
    console.log('📊 Tamaño:', snapshot.metadata.size, 'bytes');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 URL de descarga:', downloadURL);
    
    console.log('\n🎉 ¡Firebase Storage funciona correctamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'storage/unauthorized') {
      console.log('\n💡 El problema es de permisos. Verifica:');
      console.log('1. Ve a Firebase Console > Storage > Rules');
      console.log('2. Asegúrate de que las reglas sean:');
      console.log('   match /{allPaths=**} { allow read, write: if true; }');
      console.log('3. Haz clic en "Publish"');
    }
  }
}

testStorageSimple();
