/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import pkg from './package.json';

const banner = `/*!${pkg.name} v${pkg.version}${new Date().getFullYear()}年${
  new Date().getMonth() + 1
}月${new Date()}制作*/`

export default defineConfig({
  plugins: [
    vue(),
    dts({
   rollupTypes: true
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  },

  resolve: {
    alias: {
      '@': resolve(__dirname)
    }
  },
  build: {
    outDir: 'lib',
    // minify: true, // 不压缩代码,方便开发调试
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SketchRuler',
      fileName: 'index',
      formats: ['es', 'cjs','umd']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        banner,
        globals: {
          vue: 'Vue',
          // panzoom: 'simple-panzoom' // 这里假设 panzoom 暴露在全局变量 Panzoom 下
        }
      }
    }
  }
})
