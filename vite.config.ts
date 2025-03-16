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
      proxy: {
        '^/uaa/.*': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false
        },
        '^/business/.*': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})