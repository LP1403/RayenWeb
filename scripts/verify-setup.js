#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Verificando configuración del proyecto...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'src/config/firebase.ts',
  'src/types/Product.ts',
  'src/services/productService.ts',
  'src/hooks/useProducts.ts',
  'src/auth/firebaseAuth.ts',
  'src/pages/Products.tsx',
  'scripts/migrate-products.js',
  'firebase.json',
  '.firebaserc'
];

let allFilesExist = true;

console.log('📁 Verificando archivos:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar configuración de Firebase
console.log('\n🔥 Verificando configuración de Firebase:');
try {
  const firebaseConfig = fs.readFileSync('src/config/firebase.ts', 'utf8');
  const hasApiKey = firebaseConfig.includes('apiKey:');
  const hasProjectId = firebaseConfig.includes('projectId:');
  const hasAuthDomain = firebaseConfig.includes('authDomain:');
  
  console.log(`${hasApiKey ? '✅' : '❌'} API Key configurada`);
  console.log(`${hasProjectId ? '✅' : '❌'} Project ID configurado`);
  console.log(`${hasAuthDomain ? '✅' : '❌'} Auth Domain configurado`);
  
  if (!hasApiKey || !hasProjectId || !hasAuthDomain) {
    console.log('\n⚠️  Configuración de Firebase incompleta');
    console.log('   Edita src/config/firebase.ts con tus credenciales');
  }
} catch (error) {
  console.log('❌ Error leyendo configuración de Firebase');
}

// Verificar package.json
console.log('\n📦 Verificando scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasMigrateScript = packageJson.scripts && packageJson.scripts['migrate:products'];
  console.log(`${hasMigrateScript ? '✅' : '❌'} Script de migración`);
  
  if (!hasMigrateScript) {
    console.log('   Agrega "migrate:products": "node scripts/migrate-products.js" a package.json');
  }
} catch (error) {
  console.log('❌ Error leyendo package.json');
}

// Verificar dependencias
console.log('\n📚 Verificando dependencias:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasFirebase = packageJson.dependencies && packageJson.dependencies.firebase;
  const hasReact = packageJson.dependencies && packageJson.dependencies.react;
  const hasVite = packageJson.devDependencies && packageJson.devDependencies.vite;
  
  console.log(`${hasFirebase ? '✅' : '❌'} Firebase`);
  console.log(`${hasReact ? '✅' : '❌'} React`);
  console.log(`${hasVite ? '✅' : '❌'} Vite`);
  
  if (!hasFirebase) {
    console.log('   Ejecuta: npm install firebase');
  }
  if (!hasReact) {
    console.log('   Ejecuta: npm install react react-dom');
  }
  if (!hasVite) {
    console.log('   Ejecuta: npm install --save-dev vite');
  }
} catch (error) {
  console.log('❌ Error verificando dependencias');
}

// Resumen
console.log('\n📊 Resumen:');
if (allFilesExist) {
  console.log('✅ Todos los archivos necesarios están presentes');
  console.log('🚀 Listo para ejecutar: npm run migrate:products');
} else {
  console.log('❌ Faltan algunos archivos');
  console.log('🔧 Revisa la configuración antes de continuar');
}

console.log('\n📋 Próximos pasos:');
console.log('1. Configurar credenciales de Firebase en src/config/firebase.ts');
console.log('2. Ejecutar: npm run migrate:products');
console.log('3. Verificar productos en Firebase Console');
console.log('4. Configurar autenticación para admin');
console.log('5. Integrar ABM en el admin');
