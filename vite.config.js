import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vuetify({ autoImport: true })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',  // Expose to network (accessible from outside localhost)
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:4545',
          changeOrigin: true
        }
      }
    },
    // Define global constants available in the app
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || '')
    },
    // Build optimizations for faster initial load
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vuetify': ['vuetify'],
            'vue-vendor': ['vue', 'vue-router'],
            'axios': ['axios']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: 'esbuild' // Faster than terser and doesn't need extra install
    }
  }
})
