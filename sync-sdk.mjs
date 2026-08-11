// TelopHub本体のSDKを自動同期するスクリプト (npm run predev で自動実行)
import { copyFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dest = resolve(__dirname, './sdk/TelopHubSDK.tsx');

// 候補パスを順番に試す（プロジェクトの配置場所によって異なる）
const candidates = [
    '../../src/sdk/TelopHubSDK.tsx',           // TelopHub/Telops/soccer/ の場合
    '../../TelopHub/src/sdk/TelopHubSDK.tsx',  // TelopHub と同階層の場合
    '../../../src/sdk/TelopHubSDK.tsx',         // 3階層下の場合
    '../TelopHub/src/sdk/TelopHubSDK.tsx',      // 兄弟フォルダの場合
];

let synced = false;
for (const rel of candidates) {
    const src = resolve(__dirname, rel);
    if (existsSync(src)) {
        copyFileSync(src, dest);
        console.log('[sync-sdk] ✅ SDK synced from:', src);
        synced = true;
        break;
    }
}

// ファイルで見つからない場合はローカルのTelopHubサーバーから取得
if (!synced) {
    try {
        const resp = await fetch('http://localhost:9090/api/sdk/source');
        if (resp.ok) {
            const content = await resp.text();
            writeFileSync(dest, content);
            console.log('[sync-sdk] ✅ SDK synced via HTTP from localhost:9090');
            synced = true;
        }
    } catch (e) { /* サーバーが起動していない場合はスキップ */ }
}

if (!synced) {
    console.warn('[sync-sdk] ⚠️  SDK source not found. Continuing with existing sdk/TelopHubSDK.tsx.');
}
