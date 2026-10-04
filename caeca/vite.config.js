import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Espelha o que o nginx.conf faz no container: /api/<recurso>
    // vira <recurso> no backend. Sem isso o dev local quebraria,
    // porque o app passa a chamar /api em vez de localhost:8080.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
