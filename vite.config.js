import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' makes every asset URL relative, so the build works on any
// GitHub Pages path (https://<user>.github.io/<repo>/) without extra config.
export default defineConfig({
  plugins: [react()],
  base: './',
})
