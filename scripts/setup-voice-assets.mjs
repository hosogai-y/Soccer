// 音声送出（Voice CG）のオフライン用ファイルを public/assets/voice/ に用意する。
//   node scripts/setup-voice-assets.mjs
// - kuromoji の辞書（認識結果を読みがなに直す）: node_modules からコピー
// - Vosk の日本語モデル（ネットなしの音声認識）: 初回だけダウンロードして tar.gz に詰め直す
// public/assets/voice/ は .gitignore 済み。npm run build で .hub/dashboard_dist/assets/voice/（TelopHub は assets/ の中しか配信しない） に入る。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'assets', 'voice');
const MODEL = 'vosk-model-small-ja-0.22';
const MODEL_URL = `https://alphacephei.com/vosk/models/${MODEL}.zip`;

// 辞書は *.dat.gz だが、開発サーバーなどが .gz を「圧縮転送」扱いで自動解凍して返し、kuromoji の解凍が失敗する。
// 中身は gzip のまま *.dat.bin の名前で置く（src/utils/voice/reading.ts が読み込み時に名前を差し替える）
fs.rmSync(path.join(out, 'kuromoji'), { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'kuromoji'), { recursive: true });
const dictSrc = path.join(root, 'node_modules', '@sglkc', 'kuromoji', 'dict');
for (const f of fs.readdirSync(dictSrc)) fs.copyFileSync(path.join(dictSrc, f), path.join(out, 'kuromoji', f.replace(/\.dat\.gz$/, '.dat.bin')));
console.log('kuromoji dict -> public/assets/voice/kuromoji/');

// 中身は tar.gz だが、.gz の名前だとサーバーが自動解凍して返すことがあるので .bin で置く
const tgz = path.join(out, `${MODEL}.tar.gz.bin`);
if (fs.existsSync(tgz)) {
    console.log(`Vosk model already there: public/assets/voice/${MODEL}.tar.gz.bin`);
} else {
    const tmp = path.join(root, 'node_modules', '.voice-tmp');
    fs.mkdirSync(tmp, { recursive: true });
    const zipName = `${MODEL}.zip`;
    const zip = path.join(tmp, zipName);
    if (!fs.existsSync(zip)) {
        console.log(`downloading ${MODEL_URL} ...`);
        const res = await fetch(MODEL_URL);
        if (!res.ok) throw new Error(`download failed: ${res.status} ${res.statusText}`);
        fs.writeFileSync(zip + '.part', Buffer.from(await res.arrayBuffer()));
        fs.renameSync(zip + '.part', zip);
    }
    // zip の展開には bsdtar が要る。Windows では Git Bash の GNU tar（zip が読めず、C: 付きのパスを
    // リモート指定と取り違えて止まる）ではなく Windows 付属の tar を使い、パスも相対で渡す
    const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\Windows', 'System32', 'tar.exe') : 'tar';
    fs.rmSync(path.join(tmp, MODEL), { recursive: true, force: true });
    execFileSync(tar, ['-xf', zipName], { cwd: tmp, stdio: 'inherit' });
    execFileSync(tar, ['-czf', path.relative(tmp, tgz), MODEL], { cwd: tmp, stdio: 'inherit' });
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`Vosk model -> public/assets/voice/${MODEL}.tar.gz.bin`);
}
