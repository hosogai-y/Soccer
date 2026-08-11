import React, { useState } from 'react';
import { useSyncedState, useTelop } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';

const FORMATION_SLOTS = [
    { id: 'GK', label: 'GK' },
    { id: 'DF1', label: 'DF (1)' },
    { id: 'DF2', label: 'DF (2)' },
    { id: 'DF3', label: 'DF (3)' },
    { id: 'DF4', label: 'DF (4)' },
    { id: 'MF1', label: 'MF (1)' },
    { id: 'MF2', label: 'MF (2)' },
    { id: 'MF3', label: 'MF (3)' },
    { id: 'MF4', label: 'MF (4)' },
    { id: 'FW1', label: 'FW (1)' },
    { id: 'FW2', label: 'FW (2)' }
];

export default function LineupEditor() {
    const [players] = useSyncedState<Player[]>('roster', []);
    const [teamMode, setTeamMode] = useState<'left'|'right'>('left');
    
    // Lineup state (slotId -> player.id)
    const [lineup, setLineup] = useState<Record<string, string>>({});
    
    const formationRight = useTelop('フォーメーション右');
    const formationLeft = useTelop('フォーメーション左');
    const subsLeft = useTelop('サブ下位置左');

    const availablePlayers = (players || []).filter(p => p.teamId === teamMode);

    const handleAssign = (slotId: string, playerId: string) => {
        setLineup(prev => ({ ...prev, [slotId]: playerId }));
    };

    const sendToTelop = () => {
        // Build data object for formation telop
        const data: any = {};
        
        FORMATION_SLOTS.forEach(slot => {
            const playerId = lineup[slot.id];
            if (playerId) {
                const p = players?.find(x => x.id === playerId);
                if (p) {
                    // This maps the data to generic node names often found in formation telops
                    // e.g. DF4.Name4, etc. We use a flat nested structure approach.
                    data[slot.id] = {
                        Name: p.name,
                        Number: p.number,
                        GakuNen: `(${p.grade})`,
                        ...Object.fromEntries(
                            ['1','2','3','4','5'].flatMap(n => [
                                [`Name${n}`, p.name],
                                [`Number${n}`, p.number]
                            ])
                        ) // fallback fields for poorly named nodes in the .telop
                    };
                    
                    // Also flat fallback
                    data[`${slot.id}_Name`] = p.name;
                    data[`${slot.id}_Number`] = p.number;
                }
            }
        });

        if (teamMode === 'right') {
            formationRight.setData(data);
            alert('Sent to Formation (Right)');
        } else {
            formationLeft.setData(data);
            alert('Sent to Formation (Left)');
        }
    };

    return (
        <div>
            <h2>Starting Lineups</h2>
            <div className="flex-between" style={{ marginTop: 24, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className={`btn ${teamMode === 'left' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTeamMode('left')}>Left Team</button>
                    <button className={`btn ${teamMode === 'right' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTeamMode('right')}>Right Team</button>
                </div>
                <button className="btn btn-success" onClick={sendToTelop}>Send to Formation Telop</button>
            </div>

            <div className="glass-panel">
                <div className="grid-cards">
                    {FORMATION_SLOTS.map(slot => (
                        <div key={slot.id} style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8 }}>
                            <label className="form-label">{slot.label}</label>
                            <select 
                                className="form-select" 
                                value={lineup[slot.id] || ''} 
                                onChange={e => handleAssign(slot.id, e.target.value)}
                            >
                                <option value="">-- Select Player --</option>
                                {availablePlayers.map(p => (
                                    <option key={p.id} value={p.id}>{p.number} - {p.name} ({p.position})</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
