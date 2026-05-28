import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // base removed – defaults to '/' (correct for root domain)
  server: {
    port: 5174,
  },
  build: {
    // outDir removed – defaults to 'dist'
  },
})