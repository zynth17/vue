import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: true,
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VariantJS',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      plugins: [
        typescript({
          "exclude": ["node_modules", 'src/__tests/**/*']
        }),
      ],
      external: ['vue', '@popperjs/core', '@variantjs/core'],
      output: {
        globals: {
          vue: 'Vue'
        },
      }
    }
  }
})
