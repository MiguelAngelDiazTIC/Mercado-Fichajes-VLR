import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

// Fecha del último commit que tocó los datos; si no hay git, la fecha del build
function dataUpdated(): string {
  try {
    const date = execSync('git log -1 --format=%cI -- data', { encoding: 'utf8' }).trim()
    if (date) return date
  } catch {}
  return new Date().toISOString()
}

export default defineConfig({
  // Los JSON se sirven como estáticos (/teamsEmea.json…), sin backend
  publicDir: 'data',
  define: {
    __DATA_UPDATED__: JSON.stringify(dataUpdated()),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // No incrustar las ~270 banderas en el CSS; se descargan solo las que se usan
    assetsInlineLimit: (file) => (file.includes('flag-icons') ? false : undefined),
  },
})
