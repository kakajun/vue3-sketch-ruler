import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
export default defineConfig({
  plugins: [vue(), ElementPlus()],
  base: './',
  build: {
    outDir: 'dist'
  }
})
