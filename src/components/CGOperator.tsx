import React from 'react';
import { useTelop, useClearAll } from '@sdk/TelopHubSDK';

const ALL_TELOPS = [
    { name: '大得点', label: 'Big Score' },
    { name: '小得点', label: 'Small Score' },
    { name: 'タイマー', label: 'Timer' },
    { name: 'アディショナルタイム', label: 'Additional Time' },
    { name: '1Shot', label: '1Shot' },
    { name: '顔付き1Shot', label: '1Shot (Face)' },
    { name: 'プロ２', label: 'Profile 2' },
    { name: '顔付きプロ２', label: 'Profile 2 (Face)' },
    { name: '前所属', label: 'Prev Team' },
    { name: 'フォーメーション右', label: 'Formation (Right)' },
    { name: 'フォーメーション左', label: 'Formation (Left)' },
    { name: 'サブ下位置左', label: 'Substitutes' }
];

export default function CGOperator() {
    const { clearOnAir, clearPreview, clearAll } = useClearAll();

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: 24 }}>
                <h2>CG Operations</h2>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-warning" onClick={clearPreview}>Clear Preview</button>
                    <button className="btn btn-danger" onClick={clearOnAir}>Clear On Air</button>
                    <button className="btn btn-secondary" onClick={clearAll} style={{ borderColor: 'var(--accent-danger)' }}>Clear All</button>
                </div>
            </div>

            <div className="grid-cards">
                {ALL_TELOPS.map(t => (
                    <TelopControl key={t.name} telopName={t.name} label={t.label} />
                ))}
            </div>
        </div>
    );
}

function TelopControl({ telopName, label }: { telopName: string, label: string }) {
    const { show, hide, update, isVisible } = useTelop(telopName);

    return (
        <div className="glass-panel" style={{ borderLeft: isVisible ? '4px solid var(--accent-success)' : '4px solid transparent' }}>
            <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{label}</h3>
                {isVisible && <span className="status-badge status-connected">ON AIR</span>}
            </div>
            
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={() => show()}>TAKE</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={hide}>HIDE</button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => update()}>UPDATE</button>
            </div>
        </div>
    );
}
