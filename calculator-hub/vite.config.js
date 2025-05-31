import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: resolve('node_modules', 'crypto-browserify'),
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
