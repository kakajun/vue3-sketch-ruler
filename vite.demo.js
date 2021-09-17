import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const pkg = require('./package.json')
const banner = `/*!
* ${pkg.name} v${pkg.version}
* ${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date()}
* 制作
*/`
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
