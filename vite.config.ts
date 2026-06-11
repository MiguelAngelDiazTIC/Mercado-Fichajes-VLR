import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'data',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})