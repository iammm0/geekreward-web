import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  base: '', // 设置静态资源路径
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: '', // 静态资源存放目录
  }
})
