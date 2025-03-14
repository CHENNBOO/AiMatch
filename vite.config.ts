import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
        
        // 新增配置：路径重写（可选）
        rewrite: (path) => path.replace(/^\/api/, ''),
        
        // 新增配置：超时设置（与Nginx对齐）
        proxyTimeout: 60000,
        timeout: 60000
      }
    }
  }
})