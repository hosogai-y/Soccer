import React, { useRef, useState } from 'react';
import { useTelopHub, useSyncedState } from '@sdk/TelopHubSDK';
import { useMatchupCard, matchTimeLines, currentPeriodLabel, TITLE_ASSET_DIR } from '../utils/matchup';
import { encodePhotoUrl, isImageFile } from '../utils/photoMatcher';
import { isTgaFile, tgaToPngBlob, tgaToPngName } from '../utils/tga';

/**
 * Lineups: 対戦カード（某対某）のタイトル・タイトル画像・試合時間。
 * 送出は CGOperation のタイマーの下のボタンから
 */
export default function MatchupCardSettings() {
    const { card, update } = useMatchupCard();
    const { uploadAsset, isConnected } = useTelopHub();
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [titleDraft, setTitleDraft] = useState<string | null>(null);

    const handleFile = async (file?: File) => {
        if (!file) return;
        const filename = file.name.normalize('NFC');
        if (!isImageFile(filename)) {
            alert('画像ファイル（png / jpg / webp / tga）を選んでください。');
            return;
        }
        setUploading(true);
        try {
            // ファイル名に日時を付けて、同じ名前の画像を上げ直しても前の画像と混ざらないようにする
            const stamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
            const url = isTgaFile(filename)
                ? await uploadAsset(await tgaToPngBlob(file), `${TITLE_ASSET_DIR}/${stamp}_${tgaToPngName(filename)}`)
                : await uploadAsset(file, `${TITLE_ASSET_DIR}/${stamp}_${filename}`);
            update({ titleImage: url });
        } catch (e) {
            console.error(e);
            alert('タイトル画像をアップロードできませんでした。TelopHub との接続を確認してください。');
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const timeLines = matchTimeLines(card);
    const [timerPeriod] = useSyncedState<string>('match_timer_period', '前半');
    const titleValue = titleDraft ?? card.title;
    const commitTitle = () => {
        if (titleDraft !== null && titleDraft !== card.title) update({ title: titleDraft });
        setTitleDraft(null);
    };

    return (
        <div className="glass-panel" style={{ marginBottom: 20, padding: '14px 18px', border: '1px solid rgba(255, 212, 0, 0.35)' }}>
            <div className="flex-between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffd400' }}>🆚 対戦カード（某対某）</h3>
                <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
                    送出は CGOperation のタイマーの下のボタンから。チーム名は Team Settings の「大得点」表記・チームカラーを使います
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr) auto', gap: 16, alignItems: 'start' }}>
                {/* タイトル（文字版） */}
                <div>
                    <label className="form-label" style={{ fontWeight: 'bold' }}>タイトル（文字版「対戦カード」）</label>
                    <input
                        className="form-input"
                        placeholder="例: 全国高校サッカー選手権 北海道大会 決勝"
                        value={titleValue}
                        onChange={e => setTitleDraft(e.target.value)}
                        onBlur={commitTitle}
                        onKeyDown={e => { if (e.key === 'Enter') commitTitle(); }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>空欄ならタイトルを出しません（Enter またはほかをクリックで確定）</span>
                </div>

                {/* タイトル画像（画像版） */}
                <div>
                    <label className="form-label" style={{ fontWeight: 'bold' }}>タイトル画像（画像版「対戦カード画像」）</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.webp,.tga" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0])} />
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                            onClick={() => fileRef.current?.click()} disabled={uploading || !isConnected}
                            title={isConnected ? '大会ロゴなどの画像を選んでアップロード' : 'TelopHub に接続していません'}>
                            {uploading ? 'アップロード中...' : '📁 画像を選ぶ'}
                        </button>
                        {card.titleImage && (
                            <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }} onClick={() => update({ titleImage: '' })} title="タイトル画像を外す">
                                外す
                            </button>
                        )}
                    </div>
                    <div style={{ marginTop: 6, height: 44, background: 'repeating-conic-gradient(#555 0% 25%, #444 0% 50%) 50% / 16px 16px', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {card.titleImage
                            ? <img src={encodePhotoUrl(card.titleImage)} alt="タイトル画像" style={{ maxHeight: 40, maxWidth: '100%', objectFit: 'contain' }} />
                            : <span style={{ fontSize: '0.75rem', color: '#bbb' }}>未設定（画像版はタイトルなしで出ます）</span>}
                    </div>
                </div>

                {/* 試合時間 */}
                <div style={{ minWidth: 250 }}>
                    <label className="form-label" style={{ fontWeight: 'bold' }}>試合時間（得点エリア）</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 64px auto 64px auto', gap: '6px 6px', alignItems: 'center', fontSize: '0.85rem' }}>
                        {([
                            ['前半', 'first', '後半', 'second', 1],
                            ['延長前半', 'extraFirst', '延長後半', 'extraSecond', 0]
                        ] as const).map(([l1, k1, l2, k2, min]) => (
                            <React.Fragment key={k1}>
                                <span style={{ textAlign: 'right' }}>{l1}</span>
                                <input type="number" min={min} max={90} className="form-input" style={{ padding: '4px 6px' }}
                                    value={card[k1]} onChange={e => update({ [k1]: Math.max(min, Number(e.target.value) || 0) })} />
                                <span>分 / {l2}</span>
                                <input type="number" min={min} max={90} className="form-input" style={{ padding: '4px 6px' }}
                                    value={card[k2]} onChange={e => update({ [k2]: Math.max(min, Number(e.target.value) || 0) })} />
                                <span>分</span>
                            </React.Fragment>
                        ))}
                    </div>
                    <div style={{ marginTop: 6, fontSize: '0.85rem', color: '#ffd400', fontWeight: 'bold', lineHeight: 1.4 }}>
                        CG に出す: {currentPeriodLabel(card, timerPeriod || '前半')}
                        <span style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 'normal' }}>（MatchTimer: {timerPeriod || '前半'}）</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>MatchTimer で選んでいる前後半の項目だけを流し込みます（{timeLines.line1}{timeLines.line2 ? ` / ${timeLines.line2}` : ''}）</span>
                </div>
            </div>
        </div>
    );
}
