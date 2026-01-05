import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Configuración de Firebase (usar las mismas variables de entorno)
const firebaseConfig = {
    apiKey: "AIzaSyBqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ",
    authDomain: "rayenweb-b321c.firebaseapp.com",
    projectId: "rayenweb-b321c",
    storageBucket: "rayenweb-b321c.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Categorías existentes basadas en el análisis del código
const existingCategories = [
    {
        name: 'Remera',
        slug: 'remera',
        description: 'Remeras y camisetas de algodón',
        isActive: true,
        icon: '👕',
        color: '#3B82F6',
        sortOrder: 1
    },
    {
        name: 'Buzo',
        slug: 'buzo',
        description: 'Buzos y hoodies',
        isActive: true,
        icon: '🧥',
        color: '#10B981',
        sortOrder: 2
    },
    {
        name: 'Pantalón',
        slug: 'pantalon',
        description: 'Pantalones y jeans',
        isActive: true,
        icon: '👖',
        color: '#F59E0B',
        sortOrder: 3
    },
    {
        name: 'Short',
        slug: 'short',
        description: 'Shorts y bermudas',
        isActive: true,
        icon: '🩳',
        color: '#EF4444',
        sortOrder: 4
    },
    {
        name: 'Campera',
        slug: 'campera',
        description: 'Camperas y abrigos',
        isActive: true,
        icon: '🧥',
        color: '#8B5CF6',
        sortOrder: 5
    }
];

async function migrateCategories() {
    console.log('🚀 Iniciando migración de categorías...');
    
    try {
        const results = [];
        
        for (const categoryData of existingCategories) {
            console.log(`📝 Migrando categoría: ${categoryData.name}`);
            
            const docRef = await addDoc(collection(db, 'categories'), {
                ...categoryData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            results.push({
                id: docRef.id,
                name: categoryData.name,
                slug: categoryData.slug
            });
            
            console.log(`✅ Categoría "${categoryData.name}" migrada con ID: ${docRef.id}`);
        }
        
        console.log('\n🎉 Migración completada exitosamente!');
        console.log('📊 Resumen:');
        results.forEach(result => {
            console.log(`  - ${result.name} (${result.slug}): ${result.id}`);
        });
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        process.exit(1);
    }
}

// Ejecutar migración
migrateCategories()
    .then(() => {
        console.log('✅ Script completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    });
