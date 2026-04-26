import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
    },
  },
  optimizeDeps: {
    include: ['@appletosolutions/reactbits'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
})
