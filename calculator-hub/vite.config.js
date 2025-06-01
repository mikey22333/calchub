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
  // Base public path when served in development or production
  base: '/',
  
  // Build configuration
  build: {
    // Target modern browsers
    target: 'esnext',
    
    // Enable minification
    minify: 'terser',
    
    // Generate source maps for production
    sourcemap: true,
    
    // Output directory for the build
    outDir: 'dist',
    
    // Don't clear the output directory before building
    emptyOutDir: true,
    
    // CommonJS options
    commonjsOptions: {
      transformMixedEsModules: true,
      include: /node_modules/,
    },
    
    // CSS handling
    cssCodeSplit: true, // Enable CSS code splitting
    cssMinify: true, // Minify CSS
    
    // Assets handling
    assetsInlineLimit: 4096, // 4kb
    
    // Rollup options
    rollupOptions: {
      // Input files
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      
      // Output configuration
      output: {
        // Manual chunks configuration
        manualChunks: {
          // Split vendor chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Other chunks as needed
        },
        
        // Asset file names
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
