import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia']
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // GitHub Pages部署配置 - 确保路径正确
  base: '/formula-validator/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // 使用 esbuild 替代 terser，避免依赖问题
    // 确保资源路径正确
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia'],
          elementPlus: ['element-plus']
        }
      }
    }
  }
})