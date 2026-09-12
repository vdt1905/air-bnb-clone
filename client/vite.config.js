import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Client and server run independently.
// In dev, /api is proxied to the Express server so the browser sees one origin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Preview the distributable on its own, including the bundled data fallback.
  // Do not inherit the development proxy and accidentally use another local API.
  preview: { proxy: {} },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
