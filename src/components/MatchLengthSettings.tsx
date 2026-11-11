import React from 'react';
import { usePeriodMinutes } from '../utils/useScorerCg';
import { GoalTimeStyle, GOAL_TIME_STYLE_LABELS, MATCH_FORMAT_PRESETS, formatGoalMinute } from '../utils/scorers';

const HALF_OPTIONS = [35, 40, 45];
const EXTRA_OPTIONS = [10, 15];

/**
 * 試合時間の設定（Lineups）。前後半・延長の長さと、得点時間の表記（前後半ごと／通し）。
 * 当日操作ログの時刻の入力・表示、大得点得点者の得点時間、音声送出の得点時間に使う。
 * 長さを超えた時間はアディショナルとして「40+2」のように分ける
 */
export default function MatchLengthSettings() {
    const [len, setLen] = usePeriodMinutes();
    const presetIdx = MATCH_FORMAT_PRESETS.findIndex(p => p.value.half === len.half && p.value.extra === len.extra);

    // 例: 後半の始まり・終わり、後半アディショナル 2 分
    const sample = (minute: number, added = 0) => `後半${formatGoalMinute('後半', minute, added, len)}分`;
    const selectStyle: React.CSSProperties = { width: 'auto', padding: '3px 6px', fontSize: '0.85rem' };

    return (
        <div className="glass-panel" style={{ marginBottom: 20, padding: '12px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>⏱ 試合時間</h3>
                <select className="form-select" style={selectStyle} value={presetIdx < 0 ? '' : String(presetIdx)}
                    onChange={e => { const p = MATCH_FORMAT_PRESETS[Number(e.target.value)]; if (p) setLen({ ...len, ...p.value }); }}
                    title="高校・プロの試合時間をまとめて設定します">
                    {presetIdx < 0 && <option value="">カスタム</option>}
                    {MATCH_FORMAT_PRESETS.map((p, i) => <option key={p.label} value={String(i)}>{p.label}</option>)}
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                    前後半
                    <select className="form-select" style={selectStyle} value={len.half} onChange={e => setLen({ ...len, half: Number(e.target.value) })}>
                        {HALF_OPTIONS.map(n => <option key={n} value={n}>{n}分</option>)}
                    </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}>
                    延長
                    <select className="form-select" style={selectStyle} value={len.extra} onChange={e => setLen({ ...len, extra: Number(e.target.value) })}>
                        {EXTRA_OPTIONS.map(n => <option key={n} value={n}>{n}分</option>)}
                    </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem' }}
                    title="当日操作ログの時刻の入力・表示と、大得点得点者の得点時間の書き方">
                    表記
                    <select className="form-select" style={selectStyle} value={len.style} onChange={e => setLen({ ...len, style: e.target.value as GoalTimeStyle })}>
                        {(Object.keys(GOAL_TIME_STYLE_LABELS) as GoalTimeStyle[]).map(s => <option key={s} value={s}>{GOAL_TIME_STYLE_LABELS[s]}</option>)}
                    </select>
                </label>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: 6 }}>
                例: 後半の始まり {sample(1)} ／ 後半の終わり {sample(len.half)} ／ 後半アディショナル2分 {sample(len.half, 2)}。
                タイマーや入力した時刻が{len.half}分を超えたら、自動でアディショナルに分けます。
            </div>
        </div>
    );
}
