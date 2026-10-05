import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Avoid /assets/* on Workers (often missing from broken deploys + SPA fallback returns HTML)
    assetsDir: 'bundle',
  },
  define: {
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
