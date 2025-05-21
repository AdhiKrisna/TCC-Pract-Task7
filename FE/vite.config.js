import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  // server: {
  //   allowedHosts: ['tcc-fe-task6-582441420598.us-central1.run.app']
  // }
})
