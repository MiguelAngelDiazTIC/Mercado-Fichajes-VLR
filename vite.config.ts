import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'data',
  server: {
    // En dev, /api va al backend local (npm run dev lo arranca en :8080)
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
