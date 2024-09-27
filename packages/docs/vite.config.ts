import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server: {
    port: 8888 // 设置你的端口号
  },
  build: {
    outDir: 'dist'
  }
})
