import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 部署 GitHub Pages 时设 DEPLOY_TARGET=pages，base 用仓库名；本地/相对部署用 './'
export default defineConfig({
  plugins: [vue()],
  base: process.env.DEPLOY_TARGET === 'pages' ? '/balatro-core/' : './',
})
