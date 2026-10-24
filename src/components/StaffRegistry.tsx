import React, { useState } from 'react';
import { useTeamStaff, MANAGER_ROLE } from '../utils/staff';
import { toHalfWidthNum } from './PlayerRegistry';

/**
 * スタッフ登録（監督 + 汎用 3 枠）。学校ごとに役職・氏名・年齢・プロ2コメント（5 枠）を登録する。
 * CG Operation の Starters に表示し、1Shot（プロ2表示）で送出する。
 */
export default function StaffRegistry({ school }: { school: string }) {
    const { staffOf, updateMember } = useTeamStaff();
    const slots = staffOf(school);
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(0,0,0,0.25)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: 6 }}>🧑‍💼 スタッフ ({school})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {slots.map((m, idx) => {
                    const isManager = idx === 0;
                    const isOpen = openIdx === idx;
                    const commentCount = m.pro2List.filter(c => c.text.trim() !== '').length;
                    return (
                        <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 8px' }}>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={m.role}
                                    disabled={isManager}
                                    onChange={e => updateMember(school, idx, { role: e.target.value })}
                                    placeholder="役職"
                                    title={isManager ? '1 枠目は監督固定' : '役職（コーチ・部長など）'}
                                    style={{ padding: '4px 8px', width: 110, fontWeight: 'bold' }}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={m.name}
                                    onChange={e => updateMember(school, idx, { name: e.target.value })}
                                    placeholder={`${isManager ? MANAGER_ROLE : '氏名'}を入力`}
                                    style={{ padding: '4px 8px', flex: 1, minWidth: 140 }}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={m.age}
                                    onChange={e => updateMember(school, idx, { age: toHalfWidthNum(e.target.value) })}
                                    placeholder="年齢"
                                    style={{ padding: '4px 8px', width: 64, textAlign: 'center' }}
                                />
                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>歳</span>
                                <button
                                    type="button"
                                    className={`btn ${isOpen ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                                >
                                    💬 プロ2 ({commentCount})
                                </button>
                            </div>
                            {isOpen && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                                    {m.pro2List.map((c, ci) => (
                                        <div key={ci} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#aaa', width: 18 }}>#{ci + 1}</span>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={c.text}
                                                onChange={e => updateMember(school, idx, { pro2List: m.pro2List.map((x, xi) => xi === ci ? { ...x, text: e.target.value } : x) })}
                                                placeholder="プロ2コメント"
                                                style={{ padding: '4px 8px', flex: 1, color: c.isYellow ? '#ffeb3b' : 'white' }}
                                            />
                                            <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: '#ffeb3b', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!c.isYellow}
                                                    onChange={e => updateMember(school, idx, { pro2List: m.pro2List.map((x, xi) => xi === ci ? { ...x, isYellow: e.target.checked } : x) })}
                                                />
                                                黄色
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
