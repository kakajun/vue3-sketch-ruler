import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  test: {
    environment: 'happy-dom' // or 'jsdom', 'node'
  },
  server: {
    port: 8888 // 设置你的端口号
  },
  build: {
    outDir: 'dist'
  }
})
