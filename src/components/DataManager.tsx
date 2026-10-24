import React, { useRef, useState } from 'react';
import JSZip from 'jszip';
import { useTelopHub, useFullSyncedState } from '@sdk/TelopHubSDK';
import { toPhotoAssetUrl, encodePhotoUrl } from '../utils/photoMatcher';

// 保存ファイル (ZIP) の中身: state.json + 使っている写真 (assets/face/高校名/ファイル名)
const STATE_FILE = 'state.json';
const BACKUP_FORMAT = 'soccer-dashboard-backup';
// このプロジェクトの写真だけを対象にする（他プロジェクトの URL はそのまま残す）
const ASSET_URL_RE = /^\/telop-assets\/soccer\/(assets\/[^?]+)/;

// テロップが送出中かどうか (<テロップ名>_visible) は保存せず、読み込み時も今の状態を残す
const isVisibilityKey = (key: string) => key.endsWith('_visible');

// 値の中の文字列をすべて fn で置き換えたコピー
function mapStrings(value: any, fn: (s: string) => string): any {
    if (typeof value === 'string') return fn(value);
    if (Array.isArray(value)) return value.map(v => mapStrings(v, fn));
    if (value && typeof value === 'object') {
        const out: Record<string, any> = {};
        Object.keys(value).forEach(k => { out[k] = mapStrings(value[k], fn); });
        return out;
    }
    return value;
}

// /telop-assets/soccer/assets/face/北海/x.png?t=1 → assets/face/北海/x.png（写真の URL でなければ null）
function assetPathOf(str: string): string | null {
    const m = toPhotoAssetUrl(str).match(ASSET_URL_RE);
    if (!m) return null;
    try {
        return decodeURIComponent(m[1]).normalize('NFC');
    } catch {
        return m[1].normalize('NFC');
    }
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const timestamp = () => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
};

export default function DataManager() {
    const { syncedState, syncedStateRef, uploadAsset, isConnected } = useTelopHub();
    const fullSyncState = useFullSyncedState();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState('');

    const roster: any[] = Array.isArray(syncedState?.roster) ? syncedState.roster : [];
    const savedKeys = Object.keys(syncedState || {}).filter(k => k !== '_rev' && !isVisibilityKey(k));

    // 今の状態を ZIP にしてダウンロード
    const handleSave = async () => {
        setBusy(true);
        setStatus('保存の準備中...');
        try {
            const current = syncedStateRef.current || {};
            const state: Record<string, any> = {};
            Object.keys(current).forEach(k => {
                if (k !== '_rev' && !isVisibilityKey(k)) state[k] = current[k];
            });

            // 写真の URL を ZIP 内のパスに置き換え、その写真を ZIP に入れる
            const assetUrls = new Map<string, string>();
            const portableState = mapStrings(state, s => {
                const assetPath = assetPathOf(s);
                if (!assetPath) return s;
                assetUrls.set(assetPath, toPhotoAssetUrl(s));
                return assetPath;
            });

            const zip = new JSZip();
            const missing: string[] = [];
            let count = 0;
            for (const [assetPath, url] of assetUrls) {
                setStatus(`写真をまとめています... (${++count}/${assetUrls.size})`);
                try {
                    const res = await fetch(encodePhotoUrl(url));
                    if (!res.ok) throw new Error(String(res.status));
                    zip.file(assetPath, await res.blob());
                } catch {
                    missing.push(assetPath);
                }
            }

            zip.file(STATE_FILE, JSON.stringify({
                format: BACKUP_FORMAT,
                version: 1,
                savedAt: new Date().toISOString(),
                state: portableState
            }, null, 2));

            downloadBlob(await zip.generateAsync({ type: 'blob' }), `soccer_${timestamp()}.zip`);
            setStatus(missing.length > 0
                ? `保存しました。ただし ${missing.length} 枚の写真を読み込めず、ZIPに入っていません: ${missing.join(', ')}`
                : `保存しました（データ ${Object.keys(state).length} 項目・写真 ${assetUrls.size} 枚）。`);
        } catch (e: any) {
            setStatus(`保存エラー: ${e.message}`);
        } finally {
            setBusy(false);
        }
    };

    // 保存した ZIP（または state.json）から元に戻す
    const handleLoad = async (file?: File) => {
        if (!file) return;
        setBusy(true);
        try {
            let saved: any;
            let zip: JSZip | null = null;
            if (/\.zip$/i.test(file.name)) {
                zip = await JSZip.loadAsync(file);
                const entry = zip.file(STATE_FILE);
                if (!entry) throw new Error(`ZIPの中に ${STATE_FILE} がありません。`);
                saved = JSON.parse(await entry.async('text'));
            } else {
                saved = JSON.parse(await file.text());
            }

            const state = saved && saved.format === BACKUP_FORMAT ? saved.state : null;
            if (!state || typeof state !== 'object') {
                throw new Error('このダッシュボードの保存ファイルではありません。');
            }

            const assetEntries = zip ? zip.file(/^assets\//).filter(f => !f.dir) : [];
            const savedAt = saved.savedAt ? new Date(saved.savedAt).toLocaleString() : '不明';
            const playerCount = Array.isArray(state.roster) ? state.roster.length : 0;
            if (!confirm(
                `「${file.name}」を読み込みますか？\n` +
                `・保存日時: ${savedAt}\n` +
                `・選手: ${playerCount}人\n` +
                `・写真: ${assetEntries.length}枚\n\n` +
                `※今のダッシュボードのデータは全部置き換わります。`
            )) return;

            if (assetEntries.length > 0 && !isConnected) {
                throw new Error('TelopHubに接続されていないため、写真をアップロードできません。');
            }

            // 写真をアップロードし直して、ZIP 内のパスを新しい URL に戻す
            const uploadedUrls = new Map<string, string>();
            for (let i = 0; i < assetEntries.length; i++) {
                const entry = assetEntries[i];
                const assetPath = entry.name.normalize('NFC');
                setStatus(`写真をアップロード中... (${i + 1}/${assetEntries.length})`);
                uploadedUrls.set(assetPath, await uploadAsset(await entry.async('blob'), assetPath));
            }
            const restored = mapStrings(state, s => uploadedUrls.get(s) ?? s);

            const current = syncedStateRef.current || {};
            Object.keys(current).forEach(k => {
                if (isVisibilityKey(k)) restored[k] = current[k];
            });

            fullSyncState(restored);
            setStatus(`読み込みました（保存日時: ${savedAt}）。`);
        } catch (e: any) {
            setStatus(`読み込みエラー: ${e.message}`);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ margin: '0 0 4px 0' }}>💾 データの保存・読み込み (Data)</h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#aaa' }}>
                選手・チーム設定・ラインナップ・スコア・タイマー・PK・スタッツ・各テロップの中身を、顔写真ごと1つのZIPファイルにまとめます。
            </p>

            <div className="glass-panel" style={{ marginBottom: 16 }}>
                <h3 style={{ marginTop: 0 }}>今のデータ</h3>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: '0.9rem' }}>
                    <span>選手: <b>{roster.length}</b>人</span>
                    <span>顔写真あり: <b>{roster.filter(p => p && p.photoUrl).length}</b>人</span>
                    <span>保存される項目: <b>{savedKeys.length}</b></span>
                    <span className={`status-badge ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
                        {isConnected ? 'TelopHub接続中' : 'TelopHub未接続'}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div className="glass-panel" style={{ flex: 1, minWidth: 280 }}>
                    <h3 style={{ marginTop: 0 }}>保存</h3>
                    <p style={{ fontSize: '0.85rem', color: '#aaa' }}>今のダッシュボードの状態をZIPファイルでダウンロードします。</p>
                    <button className="btn btn-success" onClick={handleSave} disabled={busy}>
                        💾 今の状態を保存
                    </button>
                </div>

                <div className="glass-panel" style={{ flex: 1, minWidth: 280 }}>
                    <h3 style={{ marginTop: 0 }}>読み込み</h3>
                    <p style={{ fontSize: '0.85rem', color: '#aaa' }}>保存したZIPファイルを選ぶと、その時の状態に戻します。今のデータは置き換わります。</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,.json"
                        style={{ display: 'none' }}
                        onChange={e => { handleLoad(e.target.files?.[0]); e.target.value = ''; }}
                    />
                    <button className="btn btn-warning" onClick={() => fileInputRef.current?.click()} disabled={busy}>
                        📂 保存ファイルを読み込む
                    </button>
                </div>
            </div>

            {status && (
                <div className="glass-panel" style={{ marginTop: 16, fontSize: '0.9rem' }}>
                    {busy ? '⏳ ' : ''}{status}
                </div>
            )}
        </div>
    );
}
