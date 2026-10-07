import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'

// By default, HTTPS is enabled for PWA testing & mobile secure context.
// Can be disabled anytime by setting HTTPS=false or VITE_HTTP=true
const isHttps = process.env.HTTPS !== 'false' && process.env.VITE_HTTP !== 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(isHttps ? [basicSsl()] : []),
  ],
  define: {
    global: 'window',
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
