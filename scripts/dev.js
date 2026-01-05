#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Iniciando Rayen Web...\n');

// Función para ejecutar comandos
function runCommand(command, args, cwd, name) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: path.resolve(cwd),
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${name} failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Función principal
async function main() {
  try {
    console.log('📦 Instalando dependencias...');
    
    // Instalar dependencias
    console.log('🌐 Instalando dependencias...');
    await runCommand('npm', ['install'], '.', 'Dependencies');
    
    console.log('\n✅ Dependencias instaladas correctamente!');
    console.log('\n🚀 Para iniciar el desarrollo:');
    console.log('   npm run dev        # Servidor de desarrollo');
    console.log('   npm run build      # Build para producción');
    console.log('   npm run deploy     # Deploy a Firebase');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
