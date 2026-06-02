import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

const banner = `/*!${pkg.name} v${pkg.version} ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}*/`

export default defineConfig({
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      exclude: ['test', '**/*.spec.ts', 'vite.config.ts', 'vitest.config.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname)
    },
    extensions: ['.ts', '.json']
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SketchRulerSelecto',
      fileName: (format) => {
        if (format === 'umd') return 'index.umd.cjs'
        if (format === 'cjs') return 'index.cjs'
        if (format === 'iife') return 'index.iife.js'
        return 'index.js'
      },
      formats: ['es', 'cjs', 'umd', 'iife']
    },
    rollupOptions: {
      external: ['vue', '@sketch-ruler/core'],
      output: {
        banner,
        globals: {
          vue: 'Vue',
          '@sketch-ruler/core': 'SketchRulerCore'
        },
        exports: 'named'
      }
    }
  }
})
