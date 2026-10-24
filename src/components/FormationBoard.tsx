import React, { useEffect, useRef, useState } from 'react';
import {
    CANVAS_W, CANVAS_H, PLATE_W, PLATE_H, PS_IDS, Point, Role,
    clampPoint, toSidePosition
} from '../utils/formationLayout';

export type BoardPlate = { number?: string; name?: string };

type Props = {
    side: 'left' | 'right';
    system: string;
    systemOptions: string[];
    positions: Record<string, Point>; // 左チーム向きの座標
    roles: Record<string, Role>;
    plates: Record<string, BoardPlate>; // PS -> 割り当て選手
    schoolLabel: string;
    teamColor: string;
    onSystemChange: (system: string) => void;
    onPositionsChange: (positions: Record<string, Point>) => void;
    onResetPositions: () => void;
};

const ROLE_COLORS: Record<Role, string> = { GK: '#ffca28', DF: '#42a5f5', MF: '#66bb6a', FW: '#ef5350' };

// チーム情報（学校名ベース）の位置。フォーメーション左／右テロップの実配置
const TEAM_PLATE: Record<'left' | 'right', { x: number; y: number; w: number; h: number }> = {
    left: { x: 48, y: 1009, w: 480, h: 89 },
    right: { x: 1392, y: 1008, w: 480, h: 89 }
};

type DragState = { ps: string; startX: number; startY: number; origin: Point };

/** 陣形フォーメーション: プレートをドラッグ（または矢印キー）で微調整する 1920x1080 の縮小キャンバス */
export default function FormationBoard({
    side, system, systemOptions, positions, roles, plates, schoolLabel, teamColor,
    onSystemChange, onPositionsChange, onResetPositions
}: Props) {
    const boardRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.5);
    const [selected, setSelected] = useState<string>('');
    const [drag, setDrag] = useState<DragState | null>(null);

    useEffect(() => {
        const el = boardRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setScale(el.clientWidth / CANVAS_W));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // 表示はサイドのテロップ座標、保存は左チーム向き（toSidePosition は自身の逆変換）
    const shown = (ps: string) => toSidePosition(positions[ps] || { x: 0, y: 0 }, side);
    const moveTo = (ps: string, sidePoint: Point) => {
        const p = toSidePosition(clampPoint(sidePoint), side);
        const cur = positions[ps];
        if (cur && cur.x === p.x && cur.y === p.y) return;
        onPositionsChange({ ...positions, [ps]: p });
    };

    const handlePointerDown = (e: React.PointerEvent, ps: string) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setSelected(ps);
        setDrag({ ps, startX: e.clientX, startY: e.clientY, origin: shown(ps) });
        boardRef.current?.focus();
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!drag) return;
        moveTo(drag.ps, {
            x: drag.origin.x + (e.clientX - drag.startX) / scale,
            y: drag.origin.y + (e.clientY - drag.startY) / scale
        });
    };

    // 矢印キーで 1px（Shift で 10px）
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!selected) return;
        const step = e.shiftKey ? 10 : 1;
        const delta: Record<string, Point> = {
            ArrowLeft: { x: -step, y: 0 }, ArrowRight: { x: step, y: 0 },
            ArrowUp: { x: 0, y: -step }, ArrowDown: { x: 0, y: step }
        };
        const d = delta[e.key];
        if (!d) return;
        e.preventDefault();
        const p = shown(selected);
        moveTo(selected, { x: p.x + d.x, y: p.y + d.y });
    };

    const px = (v: number) => v * scale;
    const team = TEAM_PLATE[side];
    const sel = selected ? shown(selected) : null;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div className="form-group" style={{ margin: 0, minWidth: 180 }}>
                    <label className="form-label" style={{ fontWeight: 'bold' }}>基本フォーメーション (System)</label>
                    <select
                        className="form-select"
                        value={system}
                        onChange={e => onSystemChange(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '1rem' }}
                    >
                        {systemOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
                <button className="btn btn-secondary" onClick={onResetPositions} title="選択中フォーメーションの標準配置に戻します">
                    ↺ 標準配置に戻す
                </button>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {sel
                        ? <>選択中: <strong style={{ color: '#fff' }}>{selected}</strong> X {sel.x} / Y {sel.y}（矢印キーで1px、Shift+矢印で10px）</>
                        : 'プレートをドラッグして位置を微調整（クリックで選択→矢印キーでも移動）'}
                </span>
            </div>

            <div
                ref={boardRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDrag(null)}
                onPointerCancel={() => setDrag(null)}
                onPointerDown={e => { if (e.target === e.currentTarget) setSelected(''); }}
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
                    background: 'linear-gradient(180deg, #1d3b26 0%, #13281a 100%)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    outline: 'none',
                    touchAction: 'none',
                    userSelect: 'none'
                }}
            >
                {/* セーフエリア目安 (90% / 80%) */}
                <div style={{ position: 'absolute', inset: '5%', border: '1px dashed rgba(0,229,255,0.3)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', inset: '10%', border: '1px dashed rgba(255,235,59,0.25)', pointerEvents: 'none' }} />

                {/* チーム情報（固定） */}
                <div style={{
                    position: 'absolute', left: px(team.x), top: px(team.y), width: px(team.w), height: px(team.h),
                    background: 'rgba(255,255,255,0.12)', borderTop: `${Math.max(2, px(6))}px solid ${teamColor}`,
                    color: '#ddd', fontSize: px(30), display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    pointerEvents: 'none', overflow: 'hidden', whiteSpace: 'nowrap'
                }}>
                    {schoolLabel}
                </div>

                {PS_IDS.map(ps => {
                    const p = shown(ps);
                    const role = roles[ps] || 'MF';
                    const plate = plates[ps] || {};
                    const isSel = ps === selected;
                    return (
                        <div
                            key={ps}
                            onPointerDown={e => handlePointerDown(e, ps)}
                            title={`${ps} (${role}) X ${p.x} / Y ${p.y}`}
                            style={{
                                position: 'absolute',
                                left: px(p.x), top: px(p.y), width: px(PLATE_W), height: px(PLATE_H),
                                display: 'flex', alignItems: 'center', gap: px(8),
                                padding: `0 ${px(8)}px`, boxSizing: 'border-box',
                                background: plate.name ? 'rgba(10,20,30,0.85)' : 'rgba(10,20,30,0.45)',
                                borderLeft: `${Math.max(3, px(10))}px solid ${ROLE_COLORS[role]}`,
                                outline: isSel ? '2px solid #ffca28' : '1px solid rgba(255,255,255,0.25)',
                                borderRadius: 3,
                                cursor: drag?.ps === ps ? 'grabbing' : 'grab',
                                zIndex: isSel ? 2 : 1,
                                fontSize: px(26), lineHeight: 1, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden'
                            }}
                        >
                            <span style={{ color: ROLE_COLORS[role], fontWeight: 'bold', fontSize: px(20) }}>{ps}</span>
                            <span style={{ color: '#aaa', fontSize: px(20) }}>{role}</span>
                            <span style={{ fontWeight: 'bold' }}>{plate.number ? `#${plate.number}` : ''}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', opacity: plate.name ? 1 : 0.5 }}>
                                {plate.name || '（未割当）'}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
