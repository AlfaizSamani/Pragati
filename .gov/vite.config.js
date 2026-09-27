import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': path.resolve(process.cwd(), 'node_modules/lucide-react'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5180,
    strictPort: true,
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/portfolio': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/projects': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/alerts': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/state-summary': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/priority-queue': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/intelligence': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/heatmap': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/states': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/ingest': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/health': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/risk-assessments': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/llm': { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
});
