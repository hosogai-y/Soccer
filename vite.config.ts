import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function scanPhotos() {
  const photoDir = path.resolve(__dirname, 'Photo');
  if (!fs.existsSync(photoDir)) return [];

  const results: any[] = [];
  const schools = fs.readdirSync(photoDir);
  schools.forEach(school => {
    const schoolPath = path.join(photoDir, school);
    if (fs.statSync(schoolPath).isDirectory()) {
      const files = fs.readdirSync(schoolPath);
      files.forEach(file => {
        if (/\.(png|jpe?g|webp)$/i.test(file)) {
          const cleaned = file.replace(/\.(png|jpe?g|webp)$/i, '').replace(/抜き$/, '').trim();
          const match = cleaned.match(/^([0-9０-９]+)[\s　]*(.*)$/);
          const number = match ? match[1] : '';
          const name = match ? match[2].trim() : cleaned;
          results.push({
            school,
            filename: file,
            number,
            name,
            url: `/Photo/${encodeURIComponent(school)}/${encodeURIComponent(file)}`
          });
        }
      });
    }
  });
  return results;
}

function photoServerPlugin() {
  const syncPublicPhotos = () => {
    const results = scanPhotos();
    const publicDir = path.resolve(__dirname, 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, 'photos.json'), JSON.stringify({ photos: results }, null, 2), 'utf-8');
  };

  return {
    name: 'photo-server-plugin',
    buildStart() {
      syncPublicPhotos();
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, '.hub/dashboard_dist');
      if (fs.existsSync(outDir)) {
        // Photoフォルダを静的配信用にコピー
        const photoSrc = path.resolve(__dirname, 'Photo');
        const photoDest = path.join(outDir, 'Photo');
        if (fs.existsSync(photoSrc)) {
          fs.cpSync(photoSrc, photoDest, { recursive: true, force: true });
        }
        // photos.jsonおよび/api/photos静的エンドポイントを生成
        const results = scanPhotos();
        fs.writeFileSync(path.join(outDir, 'photos.json'), JSON.stringify({ photos: results }, null, 2), 'utf-8');
        const apiDir = path.join(outDir, 'api');
        if (!fs.existsSync(apiDir)) fs.mkdirSync(apiDir, { recursive: true });
        fs.writeFileSync(path.join(apiDir, 'photos'), JSON.stringify({ photos: results }), 'utf-8');
      }
    },
    configureServer(server: any) {
      syncPublicPhotos();
      server.middlewares.use('/api/photos', (req: any, res: any) => {
        const results = scanPhotos();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ photos: results }));
      });

      server.middlewares.use('/Photo', (req: any, res: any, next: any) => {
        const rawUrl = req.url.split('?')[0];
        let decoded = decodeURIComponent(rawUrl);
        // 先頭のスラッシュや重複したPhotoプレフィックスを安全に除去
        decoded = decoded.replace(/^\/?(Photo\/)?/i, '');
        const filePath = path.join(__dirname, 'Photo', decoded);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp'
          };
          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), photoServerPlugin()],
  base: './',
  build: { outDir: './.hub/dashboard_dist', emptyOutDir: true },
  resolve: { alias: { '@sdk': path.resolve(__dirname, './sdk') } },
  server: { proxy: { '/socket.io': { target: 'http://localhost:9090', ws: true, changeOrigin: true } } }
});