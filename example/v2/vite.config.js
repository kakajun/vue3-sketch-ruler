import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'
const pkg = require('../../package.json')
const banner = `/*!
* vue2 v${pkg.version}
* ${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date()}
* 制作
*/`
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createVuePlugin()],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname)
    }
  },
  build: {
    outDir: '../../lib/v2',
    minify: true, // 不压缩代码,方便开发调试
    lib: {
      entry: resolve(__dirname, '../../src/index.ts'),
      name: 'SketchRuler',
      fileName: 'index',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'vue-demi'],
      output: {
        banner,
        exports: 'auto'
      },
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        vue: 'Vue'
      }
    }
  }
})
