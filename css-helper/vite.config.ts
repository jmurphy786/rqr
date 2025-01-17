import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://jmurphy786.github.io/rqr/',  // Add this line
  plugins: [react()],
})
