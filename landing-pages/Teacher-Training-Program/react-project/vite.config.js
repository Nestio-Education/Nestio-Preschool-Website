import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/landing-pages/Teacher-Training-Program/react-project/dist/',
  plugins: [react()],
})