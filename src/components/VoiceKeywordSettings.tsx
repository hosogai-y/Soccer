import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { useTelop } from '../utils/telop';
import { loadReadingTokenizer } from '../utils/voice/reading';
import { VOICE_CGS, VoiceCgAliases } from '../utils/voice/voiceMatch';
import {
    VOICE_KEYWORD_CGS, VOICE_KEYWORD_COMMANDS, VOICE_KEYWORDS_KEY, VoiceKeywordItem, VoiceKeywordSettings, VoiceKeywordConfig,
    parseKeywordSettings, keywordsOf, splitKeywords, matchKeyword, duplicateKeywords,
    buildVoiceSettingsFile, readVoiceSettingsFile
} from '../utils/voice/voiceKeywords';
import { ALIASES_KEY, TEAM_COLOR_WORDS_KEY } from './VoiceCgPanel';

/**
 * Voice Keywords タブ: 音声送出のキーワード登録。
 * - CG グラフィックス一覧: CG 名を言うとその CG を TAKE する（確認カードの TAKE、または確認なしで実行）
 * - 1Shot / 1Shotカード: 選手名と一緒に言う CG の呼び方（音声送出の「ふりがな設定」と同じもの）
 * - 操作コマンド: CGクリア・1Shot のコメント切替など
 * 設定は全端末で共有され、JSON ファイルに保存・読み込みできる。
 */
const parseJsonRecord = (json: string | null | undefined): Record<string, string[]> => {
    if (typeof json !== 'string') return {};
    try {
        const v = JSON.parse(json);
        return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    } catch {
        return {};
    }
};

export default function VoiceKeywordSettingsPage() {
    const [keywordsJson, setKeywordsJson] = useSyncedState<string | null>(VOICE_KEYWORDS_KEY, null);
    const [aliasesJson, setAliasesJson] = useSyncedState<string | null>(ALIASES_KEY, null);
    const [colorWordsJson, setColorWordsJson] = useSyncedState<string | null>(TEAM_COLOR_WORDS_KEY, null);
    const settings = useMemo(() => parseKeywordSettings(keywordsJson), [keywordsJson]);
    const aliases = useMemo(() => parseJsonRecord(aliasesJson) as VoiceCgAliases, [aliasesJson]);
    const [tokenizer, setTokenizer] = useState<Awaited<ReturnType<typeof loadReadingTokenizer>>>(null);
    const [message, setMessage] = useState<{ text: string, error?: boolean } | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // 読み（ふりがな）で照合・重複チェックするための辞書
    useEffect(() => { loadReadingTokenizer().then(setTokenizer); }, []);

    const save = (next: VoiceKeywordSettings) => setKeywordsJson(JSON.stringify(next));
    const setConfig = (id: string, patch: Partial<VoiceKeywordConfig>) => {
        const cur = { ...(settings[id] || {}), ...patch };
        // 標準に戻した項目・既定値だけの項目は消しておく（JSON を小さく）
        (Object.keys(cur) as (keyof VoiceKeywordConfig)[]).forEach(k => { if (cur[k] === undefined || cur[k] === false) delete cur[k]; });
        const next = { ...settings };
        if (Object.keys(cur).length === 0) delete next[id];
        else next[id] = cur;
        save(next);
    };

    const duplicates = useMemo(() => duplicateKeywords(settings, tokenizer), [settings, tokenizer]);

    // ---------------------------------------------------------------- JSON 保存・読み込み
    const exportJson = () => {
        const file = buildVoiceSettingsFile(settings, aliases as Record<string, string[]>, parseJsonRecord(colorWordsJson));
        const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        a.href = url;
        a.download = `voice_settings_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage({ text: `JSON に保存しました（${a.download}）` });
    };

    const importJson = async (file: File) => {
        try {
            const data = readVoiceSettingsFile(await file.text());
            if (!confirm(`「${file.name}」の音声設定（キーワード・CG の呼び方・チームカラーの呼び方）で、今の設定を置き換えます。よろしいですか？`)) return;
            setKeywordsJson(JSON.stringify(data.keywords));
            setAliasesJson(JSON.stringify(data.cgAliases));
            setColorWordsJson(JSON.stringify(data.teamColorWords));
            setMessage({ text: `「${file.name}」を読み込みました（キーワード設定 ${Object.keys(data.keywords).length} 項目）` });
        } catch (err: any) {
            setMessage({ text: `読み込めませんでした: ${err?.message || err}`, error: true });
        }
    };

    const resetAll = () => {
        if (!confirm('CG・操作コマンドのキーワードを、すべて標準に戻します（1Shot の呼び方・チームカラーの呼び方はそのまま）。よろしいですか？')) return;
        save({});
        setMessage({ text: 'キーワードを標準に戻しました' });
    };

    // ---------------------------------------------------------------- 試し入力
    const [testText, setTestText] = useState('');
    const testHit = testText.trim() ? matchKeyword([testText.trim()], settings, tokenizer) : null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>🎙 Voice Keywords（音声操作のキーワード）</h2>
                        <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: 4 }}>
                            CG Operation の「🎙 音声送出」を音声優先にして、ここで登録したキーワードを話すと、その CG の TAKE・操作の確認カードが出ます。
                            「確認なしで実行」にした項目は、話すとすぐ実行します。キーワードは読点「、」区切りで、ひらがな・カタカナ・漢字で登録できます（全端末で共有）。
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" style={{ padding: '6px 14px', fontWeight: 'bold' }} onClick={exportJson}>💾 JSON に保存</button>
                        <button className="btn btn-secondary" style={{ padding: '6px 14px' }} onClick={() => fileRef.current?.click()}>📂 JSON を読み込む</button>
                        <button className="btn btn-secondary" style={{ padding: '6px 14px' }} onClick={resetAll}>↺ すべて標準に戻す</button>
                        <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ''; }} />
                    </div>
                </div>
                {message && <div style={{ marginTop: 8, fontSize: '0.8rem', color: message.error ? '#ff8a80' : '#81c784' }}>{message.text}</div>}

                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input className="form-input" style={{ flex: 1, minWidth: 260, padding: '5px 10px' }} value={testText} onChange={e => setTestText(e.target.value)}
                        placeholder="🧪 試す: 話す言葉を入力（例: 大得点、CGクリア、2項目目にチェンジ）" />
                    <span style={{ fontSize: '0.85rem', minWidth: 260 }}>
                        {!testText.trim() ? <span style={{ color: '#666' }}>入力すると、どの項目に当たるかを表示します</span>
                            : testHit ? <>→ <b style={{ color: testHit.item.group === 'cg' ? '#81c784' : '#ffb74d' }}>{testHit.item.label}</b>
                                <span style={{ color: '#aaa' }}>（「{testHit.keyword}」{testHit.immediate ? '・確認なしで実行' : ''}）</span></>
                                : <span style={{ color: '#aaa' }}>→ キーワードなし（選手名・1Shot・交代・気象・得点として照合）</span>}
                    </span>
                </div>
                {duplicates.size > 0 && (
                    <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#ff9800' }}>
                        ⚠ 同じキーワードが複数の項目にあります（長く一致したほう・一覧の上のほうが優先されます）:{' '}
                        {Array.from(duplicates.entries()).map(([w, labels]) => `「${w}」${labels.join(' / ')}`).join('、')}
                    </div>
                )}
            </div>

            <KeywordTable title="🎬 CG グラフィックス一覧" note="キーワードを話すと、その CG を TAKE します（ボタンの TAKE と同じ処理。送出中なら UPDATE）。"
                items={VOICE_KEYWORD_CGS} settings={settings} onChange={setConfig} showTelop />

            <OneShotAliasTable aliases={aliases} onChange={next => setAliasesJson(JSON.stringify(next))} />

            <KeywordTable title="⚙ 操作コマンド" note="CGクリアや、選択中の選手の 1Shot のコメント切替（「2項目目」）などを音声で行います。1Shot の操作は、CG Operation で選手を選んでいるときに使えます。"
                items={VOICE_KEYWORD_COMMANDS} settings={settings} onChange={setConfig} />
        </div>
    );
}

function KeywordTable({ title, note, items, settings, onChange, showTelop }: {
    title: string,
    note: string,
    items: VoiceKeywordItem[],
    settings: VoiceKeywordSettings,
    onChange: (id: string, patch: Partial<VoiceKeywordConfig>) => void,
    showTelop?: boolean
}) {
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
            <div style={{ fontSize: '0.78rem', color: '#aaa', margin: '4px 0 10px' }}>{note}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 240px) minmax(0, 1fr) auto', gap: '8px 12px', alignItems: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>{showTelop ? 'CG（テロップ）' : '操作'}</div>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>キーワード（「、」区切り）</div>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>実行のしかた</div>
                {items.map(item => {
                    const cfg = settings[item.id] || {};
                    const custom = cfg.keywords !== undefined;
                    const draft = drafts[item.id] ?? keywordsOf(item, settings).join('、');
                    const commit = () => {
                        const words = splitKeywords(draft);
                        const same = words.join('|') === item.defaults.join('|');
                        onChange(item.id, { keywords: same ? undefined : words });
                        setDrafts(d => { const n = { ...d }; delete n[item.id]; return n; });
                    };
                    return (
                        <React.Fragment key={item.id}>
                            <div style={{ opacity: cfg.disabled ? 0.45 : 1 }}>
                                <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>
                                    {item.label}
                                    {showTelop && item.telop && <TelopOnAir name={item.telop} />}
                                </div>
                                {(showTelop && item.telop || item.note) && (
                                    <div style={{ fontSize: '0.7rem', color: '#999' }}>
                                        {showTelop && item.telop ? `${item.telop}` : ''}{showTelop && item.telop && item.note ? '・' : ''}{item.note || ''}
                                    </div>
                                )}
                            </div>
                            <div style={{ opacity: cfg.disabled ? 0.45 : 1 }}>
                                <input className="form-input" style={{ padding: '4px 8px', fontSize: '0.85rem', borderColor: custom ? 'rgba(255,202,40,0.6)' : undefined }}
                                    value={draft} placeholder="キーワードなし（音声では使わない）"
                                    onChange={e => setDrafts({ ...drafts, [item.id]: e.target.value })}
                                    onBlur={commit}
                                    onKeyDown={e => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur(); }} />
                                {custom && (
                                    <div style={{ fontSize: '0.68rem', color: '#aaa', marginTop: 2 }}>
                                        標準: {item.defaults.join('、')}{' '}
                                        <button className="btn btn-secondary" style={{ padding: '0 6px', fontSize: '0.65rem' }}
                                            onClick={() => { onChange(item.id, { keywords: undefined }); setDrafts(d => { const n = { ...d }; delete n[item.id]; return n; }); }}>
                                            標準に戻す
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: cfg.immediate ? '#ffb74d' : '#bbb' }}
                                    title="オン: 話すとすぐ実行（確認カードを出さない）／オフ: 確認カードの TAKE・実行ボタンで実行">
                                    <input type="checkbox" checked={!!cfg.immediate} onChange={e => onChange(item.id, { immediate: e.target.checked || undefined })} />
                                    確認なしで実行
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: '#bbb' }} title="オン: この項目は音声で使わない">
                                    <input type="checkbox" checked={!!cfg.disabled} onChange={e => onChange(item.id, { disabled: e.target.checked || undefined })} />
                                    使わない
                                </label>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

function TelopOnAir({ name }: { name: string }) {
    const { isVisible } = useTelop(name);
    if (!isVisible) return null;
    return <span className="status-badge status-connected" style={{ padding: '1px 5px', fontSize: '0.58rem', marginLeft: 6 }}>ON AIR</span>;
}

/** 1Shot / 1Shotカード の CG の呼び方（選手名と一緒に言う。音声送出の「ふりがな設定」と同じデータ） */
function OneShotAliasTable({ aliases, onChange }: { aliases: VoiceCgAliases, onChange: (next: VoiceCgAliases) => void }) {
    const [drafts, setDrafts] = useState<Record<string, string>>({});
    return (
        <div className="glass-panel" style={{ padding: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>👤 1Shot / 1Shotカード（選手名と一緒に話す）</h3>
            <div style={{ fontSize: '0.78rem', color: '#aaa', margin: '4px 0 10px' }}>
                「13番 浅田 イエロー」のように、選手名・背番号と一緒に話す CG の呼び方です。標準の呼び方に加えて、追加の呼び方を登録できます（音声送出の「🔤 ふりがな設定」と同じ設定）。
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 240px) minmax(0, 1fr)', gap: '8px 12px', alignItems: 'center' }}>
                {VOICE_CGS.slice().reverse().map(c => {
                    const extra = aliases[c.id] || [];
                    const draft = drafts[c.id] ?? extra.join('、');
                    return (
                        <React.Fragment key={c.id}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.88rem' }}>{c.label}<TelopOnAir name={c.telop} /></div>
                                <div style={{ fontSize: '0.7rem', color: '#999' }}>{c.telop}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.68rem', color: '#aaa', marginBottom: 2 }}>標準: {c.defaultAliases.join('、')}</div>
                                <input className="form-input" style={{ padding: '4px 8px', fontSize: '0.85rem' }} placeholder="追加の呼び方（例: ぷろふ）"
                                    value={draft}
                                    onChange={e => setDrafts({ ...drafts, [c.id]: e.target.value })}
                                    onBlur={() => {
                                        onChange({ ...aliases, [c.id]: splitKeywords(draft) });
                                        setDrafts(d => { const n = { ...d }; delete n[c.id]; return n; });
                                    }}
                                    onKeyDown={e => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur(); }} />
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
