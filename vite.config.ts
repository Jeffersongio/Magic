import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path para GitHub Pages
  // Se o repositório for "https://usuario.github.io/repositorio", use: base: '/repositorio/'
  // Se for "https://usuario.github.io" (user page), use: base: '/'
  base: process.env.NODE_ENV === 'production' ? '/Magic/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})

