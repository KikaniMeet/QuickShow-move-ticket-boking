import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',  // 👈 this is the fix for Render
    port: 5173        // optional: set your preferred dev port
  },
  optimizeDeps: {
    force: true
  }
})
