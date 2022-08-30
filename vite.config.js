import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync, readdirSync, lstatSync, rmdirSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
const pkg = require('./package.json')

emptyDir(resolve(__dirname, 'types'))
const banner = `/*!${pkg.name} v${pkg.version}${new Date().getFullYear()}年${
  new Date().getMonth() + 1
}月${new Date()}制作*/`
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      outputDir: 'types',
      staticImport: true,
      insertTypesEntry: true,
      logDiagnostics: true
    })
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname)
    }
  },
  build: {
    outDir: 'lib/v3',
    // minify: true, // 不压缩代码,方便开发调试
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
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
      }
    }
  }
})

function emptyDir(dir) {
  if (!existsSync(dir)) {
    return
  }

  for (const file of readdirSync(dir)) {
    const abs = resolve(dir, file)

    // baseline is Node 12 so can't use rmSync
    if (lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      rmdirSync(abs)
    } else {
      unlinkSync(abs)
    }
  }
}
