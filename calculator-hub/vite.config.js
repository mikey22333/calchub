import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: {
        env: {}
      }
    }
  },
  define: {
    'process.env': {}
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    cssCodeSplit: false, // Bundle all CSS into a single file
    assetsInlineLimit: 0, // Don't inline any assets as data URLs
    rollupOptions: {
      output: {
        manualChunks: undefined, // Don't split chunks for better CSS handling
        assetFileNames: (assetInfo) => {
          // Put all CSS files in a css directory
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
})
