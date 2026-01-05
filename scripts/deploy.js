#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Preparando deploy para Firebase...\n');

try {
  // 1. Build del proyecto
  console.log('📦 Building proyecto...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completado correctamente!');
  console.log('\n📁 Estructura generada:');
  console.log('   dist/ → Proyecto compilado');
  
  console.log('\n🚀 Para hacer deploy:');
  console.log('   npm run deploy');
  console.log('\n🌐 URLs después del deploy:');
  console.log('   https://tu-proyecto.web.app/ → Aplicación web');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
