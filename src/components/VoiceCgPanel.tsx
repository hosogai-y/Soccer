import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTelop, useSyncedState } from '@sdk/TelopHubSDK';
import type { Player } from './PlayerRegistry';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';
import { useTeamStaff, registeredStaff, staffComments } from '../utils/staff';
import { useClearForTake, takeOrUpdate } from '../utils/cgExclusive';
import { useMatchLog, playerFields } from '../utils/useMatchLog';
import { playerComments, playerPhotoUrl, buildPlayerOneShotPayload, buildStaffOneShotPayload } from '../utils/oneShotPayload';
import { teamColorSet } from '../utils/teamColor';
import { loadReadingTokenizer } from '../utils/voice/reading';
import { colorNameOf } from '../utils/voice/colorWords';
import {
    VOICE_CGS, DEFAULT_VOICE_CG, voiceCgDef, VoiceCgId, VoiceCgAliases, VoiceTarget, VoiceParse,
    prepareTargets, parseAlternatives
} from '../utils/voice/voiceMatch';
import {
    EngineKind, EngineState, SpeechEngine, createOnlineEngine, createOfflineEngine, onlineEngineAvailable, pickEngine
} from '../utils/voice/speechEngines';

/**
 * 音声で選手・スタッフと CG を選び、確認してから TAKE する。
 * - 手動モード: マイクを使わない（今までどおりの操作だけ）
 * - 音声優先モード: 聞き取った内容で選択を置き換える（下の 1Shot パネルの選手も合わせる）。送出は必ず TAKE ボタン
 * モードは開くたびに手動操作から（読み込み直せば必ず操作できる状態に戻す）。認識エンジンは端末ごとの設定。CG のふりがなは共有。
 * 音声優先で待ち受けるのは同じブラウザの 1 タブだけ（マイクの奪い合いで認識が止まり続けないように）。
 */

type Mode = 'manual' | 'voice';
type EnginePref = 'auto' | EngineKind;
type Pending = { target: VoiceTarget, cg: VoiceCgId, parse: VoiceParse | null, at: number };

// 音声優先で待ち受けるタブを 1 つにするためのロック名
const MIC_LOCK = 'telops-soccer-voice-mic';

declare const __BUILD_TIME__: string;
const ENGINE_KEY = 'voice_cg_engine';
const ALIASES_KEY = 'voice_cg_aliases_json';
// 学校ごとに足したチームカラーの呼び方 { 学校名: ['えんじ', ...] }（全端末で共有）
const TEAM_COLOR_WORDS_KEY = 'voice_team_color_words_json';

const readLocal = <T extends string>(key: string, fallback: T, allowed: T[]): T => {
    try {
        const v = localStorage.getItem(key) as T | null;
        return v && allowed.includes(v) ? v : fallback;
    } catch {
        return fallback;
    }
};
const writeLocal = (key: string, v: string) => {
    try { localStorage.setItem(key, v); } catch { /* 保存できなくても動く */ }
};

/** 学校のチームカラーの呼び方（色コードから自動で作ったもの + 設定で足したもの） */
export type TeamColorWords = { school: string, side: 'left' | 'right', colors: string[], auto: { label: string, words: string[] }[], extra: string[], words: string[] };
const parseColorWords = (json: string | null | undefined): Record<string, string[]> => {
    if (typeof json !== 'string') return {};
    try {
        const v = JSON.parse(json);
        return v && typeof v === 'object' ? v : {};
    } catch {
        return {};
    }
};

const parseAliases = (json: string | null | undefined): VoiceCgAliases => {
    if (typeof json !== 'string') return {};
    try {
        const v = JSON.parse(json);
        return v && typeof v === 'object' ? v : {};
    } catch {
        return {};
    }
};

const CARD_IMAGES: Record<'card_yellow1' | 'card_yellow2' | 'card_red', { img: string, cardType: string }> = {
    card_yellow1: { img: 'img/Yellow1_15.png', cardType: 'yellow1' },
    card_yellow2: { img: 'img/Yellow2_15.png', cardType: 'yellow2' },
    card_red: { img: 'img/Red_15.png', cardType: 'red' }
};
const ONE_SHOT_MODES: Partial<Record<VoiceCgId, 'pro2' | 'today' | 'total'>> = { '1shot_pro2': 'pro2', '1shot_today': 'today', '1shot_total': 'total' };

export default function VoiceCgPanel({ leftSchool, rightSchool, leftPlayers, rightPlayers, onSelectPlayer }: {
    leftSchool: string,
    rightSchool: string,
    leftPlayers: Player[], // Starters + Subs
    rightPlayers: Player[],
    onSelectPlayer: (playerId: string) => void
}) {
    // 開いたときは必ず手動操作から（音声優先で不具合が出ても、読み込み直せば操作できる状態に戻る）
    const [mode, setModeState] = useState<Mode>('manual');
    const [enginePref, setEnginePrefState] = useState<EnginePref>(() => readLocal<EnginePref>(ENGINE_KEY, 'auto', ['auto', 'online', 'offline']));
    const [engineKind, setEngineKind] = useState<EngineKind | null>(null);
    const [engineState, setEngineState] = useState<EngineState>('idle');
    const [engineMessage, setEngineMessage] = useState('');
    const [partial, setPartial] = useState('');
    const [pending, setPending] = useState<Pending | null>(null);
    const [log, setLog] = useState<{ text: string, result: string, at: number }[]>([]);
    const [showSettings, setShowSettings] = useState(false);
    const [lockBusy, setLockBusy] = useState(false); // 別のタブが音声優先を使っている
    const [stealNonce, setStealNonce] = useState(0); // 「このタブで使う」を押した回数（押すとほかのタブから引き取る）
    const [tokenizer, setTokenizer] = useState<Awaited<ReturnType<typeof loadReadingTokenizer>>>(null);
    const [aliasesJson, setAliasesJson] = useSyncedState<string | null>(ALIASES_KEY, null);
    const aliases = useMemo(() => parseAliases(aliasesJson), [aliasesJson]);
    const [colorWordsJson, setColorWordsJson] = useSyncedState<string | null>(TEAM_COLOR_WORDS_KEY, null);
    const extraColorWords = useMemo(() => parseColorWords(colorWordsJson), [colorWordsJson]);

    const oneShot = useTelop('1Shot');
    const oneShotCard = useTelop('1Shotカード');
    const clearForTake = useClearForTake();
    const { record: recordLog } = useMatchLog();
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const [globalPhotoEnabled] = useSyncedState<boolean>('global_photo_enabled', true);
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const { staffOf } = useTeamStaff();
    const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;

    // ---------------------------------------------------------------- 候補（出場 2 校の選手・スタッフ）
    const targets = useMemo<VoiceTarget[]>(() => {
        const list: VoiceTarget[] = [];
        const addSide = (side: 'left' | 'right', school: string, players: Player[]) => {
            players.forEach(p => list.push({
                key: `p_${p.id}`, kind: 'player', side, school, name: p.name, number: p.number || '',
                label: `#${p.number} ${p.name}`, player: p, kanaMissing: !p.kana
            }));
            if (school) registeredStaff(staffOf(school)).forEach((m, i) => list.push({
                key: `s_${school}_${i}_${m.name}`, kind: 'staff', side, school, name: m.name, number: '',
                label: `${m.role} ${m.name}`, staff: m, kanaMissing: !m.kana
            }));
        };
        addSide('left', leftSchool, leftPlayers);
        addSide('right', rightSchool, rightPlayers);
        return list;
    }, [leftSchool, rightSchool, leftPlayers, rightPlayers, staffOf]);

    const prepared = useMemo(
        () => prepareTargets(targets, t => (t.player?.kana || t.staff?.kana || ''), tokenizer),
        [targets, tokenizer]
    );
    // チームカラーの呼び方（「赤の13番」）。カラー1 と、2 色のチームはカラー2 も
    const teamColorWords = useMemo<TeamColorWords[]>(() => (['left', 'right'] as const).map(side => {
        const school = side === 'left' ? leftSchool : rightSchool;
        const set = teamColorSet(teams.find(t => t.name === school), side);
        const colors = set.color2 && set.color2 !== set.color ? [set.color, set.color2] : [set.color];
        const auto = colors.map(colorNameOf).filter((c): c is { label: string, words: string[] } => !!c);
        const extra = extraColorWords[school] || [];
        return { school, side, colors, auto, extra, words: [...auto.flatMap(c => c.words), ...extra] };
    }), [teams, leftSchool, rightSchool, extraColorWords]);

    const sideWords = useMemo(() => {
        const schoolWords = (side: 'left' | 'right', school: string) => {
            const cfg = teams.find(t => t.name === school);
            return [school, cfg?.oneShotName || '', side === 'left' ? '左' : '右', side === 'left' ? 'ひだり' : 'みぎ'].filter(Boolean);
        };
        // 両チームが同じ色の呼び方を持つとき（青と水色の「あお」など）は、その呼び方ではチームを決めない
        const [l, r] = teamColorWords;
        const shared = new Set(l.words.filter(w => r.words.includes(w)));
        return {
            left: schoolWords('left', leftSchool), right: schoolWords('right', rightSchool),
            leftColors: l.words.filter(w => !shared.has(w)), rightColors: r.words.filter(w => !shared.has(w))
        };
    }, [teams, leftSchool, rightSchool, teamColorWords]);

    // 最新の値をエンジンのコールバックから読む
    const latest = useRef({ prepared, tokenizer, aliases, sideWords, onSelectPlayer });
    latest.current = { prepared, tokenizer, aliases, sideWords, onSelectPlayer };

    // ---------------------------------------------------------------- 認識結果 → 選択
    const handleFinal = useCallback((alternatives: string[]) => {
        setPartial('');
        const { prepared, tokenizer, aliases, sideWords, onSelectPlayer } = latest.current;
        const parse = parseAlternatives(alternatives, prepared, tokenizer, aliases, sideWords);
        const text = alternatives[0] || '';
        if (!parse || parse.candidates.length === 0) {
            setLog(prev => [{ text, result: '該当なし', at: Date.now() }, ...prev].slice(0, 8));
            return;
        }
        const target = parse.candidates[0].target;
        let cg = parse.cg || DEFAULT_VOICE_CG;
        if (target.kind === 'staff' && !voiceCgDef(cg).staffOk) cg = DEFAULT_VOICE_CG;
        setPending({ target, cg, parse, at: Date.now() });
        if (target.player) onSelectPlayer(target.player.id);
        setLog(prev => [{ text, result: `${target.label} / ${voiceCgDef(cg).label}`, at: Date.now() }, ...prev].slice(0, 8));
    }, []);

    // ---------------------------------------------------------------- エンジン
    const engineRef = useRef<SpeechEngine | null>(null);
    const stopEngine = useCallback(() => {
        engineRef.current?.stop();
        engineRef.current = null;
        setEngineKind(null);
        setPartial('');
    }, []);

    const startEngine = useCallback(async (kind: EngineKind, allowFallback: boolean) => {
        stopEngine();
        setEngineMessage('');
        const callbacks = {
            onFinal: handleFinal,
            onPartial: setPartial,
            onState: (state: EngineState, message?: string) => {
                setEngineState(state);
                if (message) setEngineMessage(message);
                // auto でオンライン認識がネット切れで止まったら、オフラインに切り替えて続ける
                if (state === 'error' && kind === 'online' && allowFallback) {
                    setEngineMessage(`${message || 'オンライン認識が止まりました'} → オフライン認識に切り替えます`);
                    startEngine('offline', false);
                }
            }
        };
        const engine = kind === 'online' ? createOnlineEngine(callbacks) : createOfflineEngine(callbacks);
        engineRef.current = engine;
        setEngineKind(kind);
        try {
            await engine.start();
        } catch (err: any) {
            if (engineRef.current !== engine) return;
            setEngineState('error');
            setEngineMessage(err?.message || String(err));
            engineRef.current = null;
            setEngineKind(null);
        }
    }, [handleFinal, stopEngine]);

    // 音声優先モードの間だけマイクを使う。
    // 同じブラウザの複数タブで同時に待ち受けるとマイクを奪い合って認識が止まり続けるので、1 タブだけにする（Web Locks）
    useEffect(() => {
        if (mode !== 'voice') {
            stopEngine();
            setEngineState('idle');
            return;
        }
        let cancelled = false;
        let release: (() => void) | null = null;
        const begin = () => {
            if (cancelled) return;
            loadReadingTokenizer().then(t => { if (!cancelled) setTokenizer(t); });
            startEngine(pickEngine(enginePref), enginePref === 'auto');
        };
        const locks = (navigator as any).locks;
        let holding = false;
        const onLock = (lock: unknown, retries: number) => {
            if (cancelled) return undefined;
            if (!lock) {
                if (retries > 0) setTimeout(() => tryLock(retries - 1), 300);
                else {
                    setEngineState('error');
                    setLockBusy(true);
                    setEngineMessage('別のタブ（または TelopHub の画面に埋め込まれたダッシュボード）で音声優先が動いています。');
                }
                return undefined;
            }
            holding = true;
            setLockBusy(false);
            begin();
            // モードを切り替える・タブを閉じるまでロックを持ち続ける
            return new Promise<void>(resolve => { release = resolve; });
        };
        // 認識方式を変えたときなど、直前の待ち受けのロックが外れるのは少し後なので、何回か取り直す。
        // 「このタブで使う」を押したときは、ほかのタブのロックを奪う
        const tryLock = (retries: number, steal = false) => {
            locks.request(MIC_LOCK, steal ? { steal: true } : { ifAvailable: true }, (lock: unknown) => onLock(lock, retries))
                .catch(() => {
                    if (cancelled) return;
                    if (holding) {
                        // ほかのタブに奪われた → このタブは手動操作に戻る
                        setModeState('manual');
                        setPending(null);
                        setEngineMessage('別のタブで音声優先を使い始めたので、このタブは手動操作に戻しました');
                    } else begin(); // Web Locks が使えない環境
                });
        };
        if (locks?.request) tryLock(5, stealNonce > 0);
        else begin();
        return () => {
            cancelled = true;
            stopEngine();
            release?.();
        };
    }, [mode, enginePref, startEngine, stopEngine, stealNonce]);

    // 設定画面でふりがなを確かめるときも辞書を使う
    useEffect(() => {
        if (showSettings) loadReadingTokenizer().then(setTokenizer);
    }, [showSettings]);

    const setMode = (m: Mode) => { setModeState(m); setStealNonce(0); setLockBusy(false); if (m === 'manual') { setPending(null); setEngineMessage(''); } };
    const setEnginePref = (p: EnginePref) => { setEnginePrefState(p); writeLocal(ENGINE_KEY, p); };

    // ---------------------------------------------------------------- TAKE（確認後）
    const takePending = () => {
        if (!pending) return;
        const { target, cg } = pending;
        const def = voiceCgDef(cg);
        if (target.player) {
            const player = target.player;
            const rawSchool = player.schoolName || (player.teamId === 'right' ? oaRightTeam : oaLeftTeam);
            const teamConfig = teams.find(t => t.name === rawSchool) ||
                teams.find(t => (player.teamId === 'right' ? t.name === oaRightTeam : t.name === oaLeftTeam));
            const comment = playerComments(player)[0] || { text: player.pro2Comment || '', isYellow: false };
            const base = (m: 'pro2' | 'today' | 'total') => buildPlayerOneShotPayload({
                player, teamConfig, side: player.teamId === 'right' ? 'right' : 'left', school: rawSchool, mode: m,
                commentText: comment.text || '', isYellow: false, photoUrl: playerPhotoUrl(player, globalPhotoEnabled !== false)
            });
            const oneShotMode = ONE_SHOT_MODES[cg];
            if (oneShotMode) {
                const payload = base(oneShotMode);
                oneShot.setData(payload);
                takeOrUpdate(oneShot, payload, () => clearForTake('1Shot'));
            } else {
                const card = CARD_IMAGES[cg as keyof typeof CARD_IMAGES];
                const payload = { ...base('pro2'), 'カード': card.img, 'cardType': card.cardType };
                oneShotCard.setData(payload);
                takeOrUpdate(oneShotCard, payload, () => clearForTake('1Shotカード'));
                recordLog({
                    type: cg === 'card_red' ? 'red' : 'yellow', team: rawSchool, ...playerFields(player),
                    ...(cg === 'card_yellow2' ? { note: '2枚目' } : {})
                });
            }
        } else if (target.staff && def.staffOk) {
            const teamConfig = teams.find(t => t.name === target.school);
            const comment = staffComments(target.staff)[0] || { text: '', isYellow: false };
            const payload = buildStaffOneShotPayload({ member: target.staff, teamConfig, side: target.side, school: target.school, comment });
            oneShot.setData(payload);
            takeOrUpdate(oneShot, payload, () => clearForTake('1Shot'));
        }
        setPending(null);
    };

    // ---------------------------------------------------------------- 表示
    const stateBadge = mode === 'manual' ? { text: '手動操作', color: '#888' }
        : engineState === 'listening' ? { text: `🎤 待ち受け中（${engineKind === 'online' ? 'オンライン' : 'オフライン'}）`, color: '#4caf50' }
        : engineState === 'loading' ? { text: '⏳ 準備中…', color: '#ffca28' }
        : engineState === 'error' ? { text: '⚠ 停止', color: '#f44336' }
        : { text: '停止中', color: '#888' };

    const pendingColor = pending ? teamColorSet(teams.find(t => t.name === pending.target.school), pending.target.side).color : '#666';
    const otherCandidates = (pending?.parse?.candidates || []).filter(c => c.target.key !== pending?.target.key).slice(0, 3);
    const cands = pending?.parse?.candidates || [];
    // 最初の候補のまま、2 番目が同じくらい近いとき
    const ambiguous = !!pending && cands.length >= 2 && cands[0].target.key === pending.target.key && cands[0].score - cands[1].score < 0.05;
    const missingKana = targets.filter(t => t.kanaMissing);

    return (
        <div className="glass-panel" style={{ padding: '12px 16px', border: `1px solid ${mode === 'voice' ? 'rgba(76,175,80,0.5)' : 'rgba(255,255,255,0.1)'}` }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold' }}>🎙 音声送出</span>
                    <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <button className={`btn ${mode === 'manual' ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '4px 12px', borderRadius: 0, fontSize: '0.8rem' }} onClick={() => setMode('manual')} title="マイクを使わない（今までどおりの操作）">
                            手動操作
                        </button>
                        <button className={`btn ${mode === 'voice' ? 'btn-success' : 'btn-secondary'}`} style={{ padding: '4px 12px', borderRadius: 0, fontSize: '0.8rem' }} onClick={() => setMode('voice')} title="聞き取った内容で選手と CG を選ぶ（送出は TAKE ボタン）">
                            音声優先
                        </button>
                    </div>
                    <select className="form-select" value={enginePref} onChange={e => setEnginePref(e.target.value as EnginePref)} style={{ width: 'auto', padding: '3px 6px', fontSize: '0.75rem' }} title="音声認識の方式（この端末だけの設定）">
                        <option value="auto">自動（ネットがあればオンライン）</option>
                        <option value="online" disabled={!onlineEngineAvailable()}>オンライン（ブラウザ）</option>
                        <option value="offline">オフライン（端末内）</option>
                    </select>
                    <span style={{ fontSize: '0.78rem', color: stateBadge.color, fontWeight: 'bold' }}>{stateBadge.text}</span>
                </div>
                <button className={`btn ${showSettings ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '3px 10px', fontSize: '0.75rem' }} onClick={() => setShowSettings(!showSettings)}>
                    🔤 ふりがな設定
                </button>
                <span style={{ fontSize: '0.65rem', color: '#666' }} title="この画面のビルド日時">build {__BUILD_TIME__}</span>
            </div>

            {engineMessage && <div style={{ fontSize: '0.75rem', color: engineState === 'error' ? '#ff8a80' : '#ffca28', marginTop: 6 }}>{engineMessage}</div>}
            {mode === 'voice' && lockBusy && (
                <button className="btn btn-warning" style={{ marginTop: 6, padding: '4px 12px', fontSize: '0.8rem', fontWeight: 'bold' }}
                    onClick={() => { setLockBusy(false); setEngineMessage(''); setStealNonce(n => n + 1); }}
                    title="ほかのタブの音声優先を止めて（手動操作に戻して）、このタブで待ち受けます">
                    🎤 このタブで音声優先を使う
                </button>
            )}

            {mode === 'voice' && (
                <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: '0.75rem', color: '#aaa', minHeight: '1.2em' }}>
                        {partial ? <>聞き取り中: <span style={{ color: '#fff' }}>{partial}</span></> : '例:「13番 浅田」「赤の13番」「浅田 イエロー」「札幌創成の監督」「浅田 トゥデイ」'}
                    </div>

                    {pending ? (
                        <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.35)', border: `2px solid ${pendingColor}` }}>
                            <div className="flex-between" style={{ gap: 8, flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>
                                        {pending.target.label}
                                        <span style={{ fontSize: '0.8rem', color: '#ffca28', marginLeft: 8 }}>{pending.target.school}</span>
                                    </div>
                                    {pending.parse && <div style={{ fontSize: '0.72rem', color: '#aaa' }}>「{pending.parse.transcript}」{pending.parse.candidates[0] && `（${pending.parse.candidates[0].why}）`}</div>}
                                    {ambiguous && <div style={{ fontSize: '0.75rem', color: '#ff9800', fontWeight: 'bold' }}>⚠ 同じくらい近い候補があります。ほかの候補も確認してください</div>}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-success" style={{ padding: '8px 22px', fontWeight: 'bold', fontSize: '1rem' }} onClick={takePending}>
                                        TAKE
                                    </button>
                                    <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => setPending(null)}>
                                        取消
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                                {VOICE_CGS.filter(c => pending.target.kind === 'player' || c.staffOk).slice().reverse().map(c => (
                                    <button key={c.id}
                                        className={`btn ${pending.cg === c.id ? 'btn-warning' : 'btn-secondary'}`}
                                        style={{ padding: '3px 8px', fontSize: '0.75rem', fontWeight: pending.cg === c.id ? 'bold' : 'normal' }}
                                        onClick={() => setPending({ ...pending, cg: c.id })}>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                            {otherCandidates.length > 0 && (
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6, alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.72rem', color: '#aaa' }}>ほかの候補:</span>
                                    {otherCandidates.map(c => (
                                        <button key={c.target.key} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                                            onClick={() => {
                                                const cg = c.target.kind === 'staff' && !voiceCgDef(pending.cg).staffOk ? DEFAULT_VOICE_CG : pending.cg;
                                                setPending({ ...pending, target: c.target, cg });
                                                if (c.target.player) onSelectPlayer(c.target.player.id);
                                            }}>
                                            {c.target.label}（{c.target.school}）
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.2)', color: '#888', fontSize: '0.85rem', textAlign: 'center' }}>
                            選手名・背番号・CG 名を話すと、ここに送出候補が出ます（送出は TAKE ボタンで確認してから）
                        </div>
                    )}

                    <input className="form-input" style={{ marginTop: 6, padding: '3px 8px', fontSize: '0.75rem' }}
                        placeholder="🧪 文字で試す（話す代わりに入力して Enter。聞き取りの確認用）"
                        onKeyDown={e => {
                            const el = e.currentTarget;
                            if (e.key === 'Enter' && el.value.trim()) { handleFinal([el.value.trim()]); el.value = ''; }
                        }} />

                    {log.length > 0 && (
                        <div style={{ marginTop: 6, fontSize: '0.7rem', color: '#888', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {log.slice(0, 3).map(l => <div key={l.at}>「{l.text}」→ {l.result}</div>)}
                        </div>
                    )}
                </div>
            )}

            {showSettings && (
                <VoiceAliasSettings
                    aliases={aliases}
                    onChange={next => setAliasesJson(JSON.stringify(next))}
                    missingKana={missingKana}
                    teamColorWords={teamColorWords}
                    onChangeColorWords={(school, words) => setColorWordsJson(JSON.stringify({ ...extraColorWords, [school]: words }))}
                />
            )}
        </div>
    );
}

/** CG のふりがな（言い方）を足す。ふりがな未登録の選手・スタッフも一覧で知らせる */
function VoiceAliasSettings({ aliases, onChange, missingKana, teamColorWords, onChangeColorWords }: {
    aliases: VoiceCgAliases,
    onChange: (next: VoiceCgAliases) => void,
    missingKana: VoiceTarget[],
    teamColorWords: TeamColorWords[],
    onChangeColorWords: (school: string, words: string[]) => void
}) {
    const [drafts, setDrafts] = useState<Partial<Record<VoiceCgId, string>>>({});
    const [colorDrafts, setColorDrafts] = useState<Record<string, string>>({});
    const [l, r] = teamColorWords;
    const shared = l.words.filter(w => r.words.includes(w));
    const cgWords = new Set(VOICE_CGS.flatMap(c => [...c.defaultAliases, ...(aliases[c.id] || [])]));
    return (
        <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(0,0,0,0.25)', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>チームカラーの呼び方（「赤の13番」のように使う）</div>
            <div style={{ color: '#aaa', fontSize: '0.72rem', marginBottom: 8 }}>
                Team Settings のチームカラーから自動で決まります。ほかの呼び方（例: えんじ、すかいぶるー）は読点「、」区切りで足せます。全端末で共有されます。
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {teamColorWords.map(t => {
                    const draft = colorDrafts[t.school] ?? t.extra.join('、');
                    const clash = t.extra.filter(w => cgWords.has(w));
                    return (
                        <div key={t.side} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {t.colors.map(c => <span key={c} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: '1px solid rgba(255,255,255,0.3)' }} />)}
                                {t.school || (t.side === 'left' ? '左チーム' : '右チーム')}
                            </span>
                            <div>
                                <div style={{ color: '#aaa', fontSize: '0.7rem', marginBottom: 2 }}>
                                    自動: {t.auto.length > 0 ? t.auto.map(a => `${a.label}（${a.words.join('、')}）`).join(' / ') : '色を判定できません'}
                                </div>
                                <input className="form-input" style={{ padding: '3px 8px', fontSize: '0.8rem' }} placeholder="追加の呼び方（例: えんじ）"
                                    value={draft}
                                    onChange={e => setColorDrafts({ ...colorDrafts, [t.school]: e.target.value })}
                                    onBlur={() => {
                                        onChangeColorWords(t.school, draft.split(/[、,，\s]+/).map(w => w.trim()).filter(Boolean));
                                        setColorDrafts(d => { const n = { ...d }; delete n[t.school]; return n; });
                                    }} />
                                {clash.length > 0 && <div style={{ color: '#ff9800', fontSize: '0.7rem' }}>⚠ {clash.join('、')} は CG の呼び方と同じです（カードなどと取り違えます）</div>}
                            </div>
                        </div>
                    );
                })}
                {shared.length > 0 && (
                    <div style={{ color: '#ff9800', fontSize: '0.72rem' }}>
                        ⚠ 両チーム共通の呼び方（{shared.join('、')}）ではチームを決められません。学校名か、片方だけの呼び方を使ってください。
                    </div>
                )}
            </div>

            <div style={{ fontWeight: 'bold', marginBottom: 6 }}>CG のふりがな（呼び方）</div>
            <div style={{ color: '#aaa', fontSize: '0.72rem', marginBottom: 8 }}>
                標準の呼び方に加えて、追加の呼び方をひらがな・カタカナで登録できます（読点「、」区切り）。全端末で共有されます。
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {VOICE_CGS.slice().reverse().map(c => {
                    const extra = aliases[c.id] || [];
                    const draft = drafts[c.id] ?? extra.join('、');
                    return (
                        <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>{c.label}</span>
                            <div>
                                <div style={{ color: '#aaa', fontSize: '0.7rem', marginBottom: 2 }}>標準: {c.defaultAliases.join('、')}</div>
                                <input className="form-input" style={{ padding: '3px 8px', fontSize: '0.8rem' }} placeholder="追加の呼び方（例: ぷろふ、しょうかいかーど）"
                                    value={draft}
                                    onChange={e => setDrafts({ ...drafts, [c.id]: e.target.value })}
                                    onBlur={() => {
                                        const words = draft.split(/[、,，\s]+/).map(w => w.trim()).filter(Boolean);
                                        onChange({ ...aliases, [c.id]: words });
                                        setDrafts(d => { const n = { ...d }; delete n[c.id]; return n; });
                                    }} />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: 10, fontWeight: 'bold' }}>ふりがな未登録（出場 2 校）: {missingKana.length} 名</div>
            <div style={{ color: '#aaa', fontSize: '0.72rem' }}>
                未登録の人は名前の漢字から読みを推測するので、読み違えることがあります。Players タブ・スタッフ欄で登録してください。
            </div>
            {missingKana.length > 0 && (
                <div style={{ marginTop: 4, color: '#ffca28', fontSize: '0.72rem' }}>
                    {missingKana.map(t => `${t.label}（${t.school}）`).join('、')}
                </div>
            )}
        </div>
    );
}
