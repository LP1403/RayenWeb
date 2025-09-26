import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // 👇 IMPORTANTE: usar el nombre del repo como base solo en producción
  base: command === 'build' ? '/RayenWeb/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',   // carpeta de salida
    sourcemap: false  // podés poner true si querés ver mapas de debug
  },
  server: {
    port: 5173,       // puerto de vite dev
    open: true        // abre el navegador al levantar
  }
}))