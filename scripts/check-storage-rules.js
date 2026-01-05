#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
  authDomain: "rayenweb-b321c.firebaseapp.com",
  projectId: "rayenweb-b321c",
  storageBucket: "rayenweb-b321c.firebasestorage.app",
  messagingSenderId: "388723022983",
  appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

async function checkStorageRules() {
  try {
    console.log('🔍 Verificando reglas de Storage...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    console.log('✅ Firebase inicializado');
    console.log('📦 Storage bucket:', storage.app.options.storageBucket);

    // Intentar listar archivos (solo lectura)
    console.log('📋 Intentando listar archivos en Storage...');
    const listRef = ref(storage, '');
    const result = await listAll(listRef);
    
    console.log('✅ Lectura exitosa - las reglas de lectura funcionan');
    console.log('📁 Archivos encontrados:', result.items.length);
    
    if (result.items.length > 0) {
      console.log('📄 Primer archivo:', result.items[0].name);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'storage/unauthorized') {
      console.log('\n💡 Las reglas de Storage no permiten lectura. Verifica:');
      console.log('1. Ve a Firebase Console > Storage > Rules');
      console.log('2. Asegúrate de que las reglas sean:');
      console.log('   match /{allPaths=**} { allow read, write: if true; }');
      console.log('3. Haz clic en "Publish"');
      console.log('4. Espera unos segundos y vuelve a probar');
    }
  }
}

checkStorageRules();
