import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: mode === 'development' ? {
        '^/uaa/.*': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false
        },
        '^/business/.*': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false
        }
      } : undefined
    }
  }
})