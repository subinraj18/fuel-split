import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with these paths will be forwarded to your backend
      '/friends': 'http://127.0.0.1:5000',
      '/cars': 'http://127.0.0.1:5000',
      '/settings': 'http://127.0.0.1:5000',
      '/trips': 'http://127.0.0.1:5000',
      '/balances': 'http://127.0.0.1:5000',
      '/expenses': 'http://127.0.0.1:5000',
      '/payments': 'http://127.0.0.1:5000',
    }
  }
})