import React, { useState } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';

export type Player = {
    id: string;
    teamId: 'left' | 'right'; // Grouping for left/right teams
    name: string; // 氏名
    number: string; // 番号
    position: string; // ポジション
    grade: string; // 学年 (e.g. "3年")
    height: string;
    weight: string;
    prevTeam: string;
};

export default function PlayerRegistry() {
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [teamFilter, setTeamFilter] = useState<'left' | 'right'>('left');

    const [form, setForm] = useState<Partial<Player>>({
        teamId: 'left', name: '', number: '', position: 'FW', grade: '', height: '', weight: '', prevTeam: ''
    });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.number) return;

        const newPlayer: Player = {
            ...(form as Player),
            id: Date.now().toString()
        };
        setPlayers(prev => [...(prev || []), newPlayer]);
        setForm({ ...form, name: '', number: '', grade: '', height: '', weight: '', prevTeam: '' }); // reset some fields
    };

    const handleDelete = (id: string) => {
        setPlayers(prev => (prev || []).filter(p => p.id !== id));
    };

    const filteredPlayers = (players || []).filter(p => p.teamId === teamFilter);

    return (
        <div>
            <h2>Player Registry</h2>
            <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                
                {/* Registration Form */}
                <div className="glass-panel" style={{ flex: '0 0 350px' }}>
                    <h3>Add New Player</h3>
                    <form onSubmit={handleAdd} style={{ marginTop: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Team</label>
                            <select className="form-select" value={form.teamId} onChange={e => setForm({...form, teamId: e.target.value as 'left'|'right'})}>
                                <option value="left">Left Team</option>
                                <option value="right">Right Team</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Number</label>
                            <input className="form-input" required value={form.number} onChange={e => setForm({...form, number: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Name (氏名)</label>
                            <input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </div>
                        <div className="flex-between" style={{ gap: 12 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Position</label>
                                <select className="form-select" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                                    <option value="GK">GK</option>
                                    <option value="DF">DF</option>
                                    <option value="MF">MF</option>
                                    <option value="FW">FW</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Grade</label>
                                <input className="form-input" placeholder="e.g. 3年" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} />
                            </div>
                        </div>
                        <div className="flex-between" style={{ gap: 12 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Height</label>
                                <input className="form-input" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Weight</label>
                                <input className="form-input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Previous Team</label>
                            <input className="form-input" value={form.prevTeam} onChange={e => setForm({...form, prevTeam: e.target.value})} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Register Player</button>
                    </form>
                </div>

                {/* Player List */}
                <div className="glass-panel" style={{ flex: 1 }}>
                    <div className="flex-between" style={{ marginBottom: 16 }}>
                        <h3>Registered Players</h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className={`btn ${teamFilter === 'left' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTeamFilter('left')}>Left Team</button>
                            <button className={`btn ${teamFilter === 'right' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTeamFilter('right')}>Right Team</button>
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Pos</th>
                                    <th>Name</th>
                                    <th>Grade</th>
                                    <th>H/W</th>
                                    <th>Prev Team</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', opacity: 0.5 }}>No players registered for this team.</td></tr>}
                                {filteredPlayers.sort((a,b) => parseInt(a.number) - parseInt(b.number)).map(p => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 'bold' }}>{p.number}</td>
                                        <td>{p.position}</td>
                                        <td>{p.name}</td>
                                        <td>{p.grade}</td>
                                        <td>{p.height} / {p.weight}</td>
                                        <td>{p.prevTeam}</td>
                                        <td>
                                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleDelete(p.id)}>Del</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
