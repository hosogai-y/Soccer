import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // 画面に出すビルド日時（TelopHub で開いている画面が最新のビルドか確かめる用）
  define: { __BUILD_TIME__: JSON.stringify(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })) },
  base: './',
  build: { outDir: './.hub/dashboard_dist', emptyOutDir: true },
  resolve: { alias: { '@sdk': path.resolve(__dirname, './sdk') } },
  server: { proxy: { '/socket.io': { target: 'http://localhost:9090', ws: true, changeOrigin: true } } }
});
