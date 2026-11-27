import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import pkg from './package.json' with { type: 'json' }

const banner = `/*!${pkg.name} v${pkg.version} ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}*/`

export default defineConfig({
  esbuild: { drop: ['console', 'debugger'] },
  plugins: [
    dts({
      bundleTypes: true,
      tsconfigPath: resolve(import.meta.dirname, 'tsconfig.json'),
      exclude: ['test', '**/*.spec.ts', 'vite.config.ts', 'vitest.config.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname)
    },
    extensions: ['.ts', '.json']
  },
  build: {
    outDir: 'lib',
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'SketchRulerCanvas',
      fileName: (format) => {
        if (format === 'umd') return 'index.umd.cjs'
        if (format === 'cjs') return 'index.cjs'
        if (format === 'iife') return 'index.iife.js'
        return 'index.js'
      },
      formats: ['es', 'cjs', 'umd', 'iife']
    },
    rollupOptions: {
      external: ['@sketch-ruler/core'],
      output: {
        banner,
        globals: {
          '@sketch-ruler/core': 'SketchRulerCore'
        },
        exports: 'named'
      }
    }
  }
})
