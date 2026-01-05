import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA41GF-TbdQNqsQt79bZOGoxwWs8jfubcA",
    authDomain: "rayenweb-b321c.firebaseapp.com",
    projectId: "rayenweb-b321c",
    storageBucket: "rayenweb-b321c.firebasestorage.app",
    messagingSenderId: "388723022983",
    appId: "1:388723022983:web:4e111d405c83ed1999ec22"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
export default app;