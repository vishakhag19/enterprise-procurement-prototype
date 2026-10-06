import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 43127,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 43127,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 43129,
    allowedHosts: true,
  },
})
