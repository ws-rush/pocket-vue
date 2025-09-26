import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  plugins: [dts({ rollupTypes: true, clearPureImport: false, logLevel: 'debug' })],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PocketVue',
      formats: ['es', 'umd', 'iife']
    },
    rollupOptions: {
      // external: ['@vue/reactivity', '@vue/shared'],
      // output: {
      //   // Provide global variables to use in the UMD/IIFE build
      //   // for externalized deps
      //   globals: {
      //     '@vue/reactivity': 'VueReactivity',
      //     '@vue/shared': 'VueShared'
      //   },
      // },
      plugins: [
        {
          name: 'remove-collection-handlers',
          transform(code, id) {
            if (id.endsWith('reactivity.esm-bundler.js')) {
              return code
                .replace(`mutableCollectionHandlers,`, `null,`)
                .replace(`readonlyCollectionHandlers,`, `null,`)
            }
          }
        }
      ]
    }
  }
})
