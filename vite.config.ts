import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: './.hub/dashboard_dist', emptyOutDir: true },
  resolve: { alias: { '@sdk': path.resolve(__dirname, './sdk') } },
  server: { proxy: { '/socket.io': { target: 'http://localhost:9090', ws: true, changeOrigin: true } } }
});
