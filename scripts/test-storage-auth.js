#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
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

async function testStorageWithAuth() {
  try {
    console.log('🧪 Probando Storage con autenticación...\n');

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);

    console.log('✅ Firebase inicializado');

    // Autenticarse como usuario anónimo
    console.log('🔐 Autenticándose como usuario anónimo...');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Autenticado como:', userCredential.user.uid);

    // Crear un archivo de prueba
    const testContent = 'Hello Firebase Storage with Auth!';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    console.log('📤 Subiendo archivo de prueba...');
    
    const testRef = ref(storage, 'test/auth-test.txt');
    const snapshot = await uploadBytes(testRef, testBlob);
    
    console.log('✅ Archivo subido exitosamente');
    console.log('📊 Tamaño:', snapshot.metadata.size, 'bytes');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 URL de descarga:', downloadURL);
    
    console.log('\n🎉 ¡Firebase Storage funciona con autenticación!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'storage/unauthorized') {
      console.log('\n💡 Aún hay problemas de permisos. Verifica:');
      console.log('1. Ve a Firebase Console > Storage > Rules');
      console.log('2. Asegúrate de que las reglas permitan escritura para usuarios autenticados');
      console.log('3. O usa reglas de prueba: allow read, write: if true;');
    }
  }
}

testStorageWithAuth();
