import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const pkg = require('./package.json')
import { resolve } from 'path'
const banner = `/*!
* ${pkg.name} v${pkg.version}
* ${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date()}
* 制作
*/`
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // minify: false, // 不压缩代码,方便开发调试
    lib: {
      entry: resolve(__dirname, 'packages/index.js'),
      name: 'SketchRuler',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        banner
      }
    }
  }
})
