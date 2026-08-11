import React from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';

export const ScoreControl: React.FC<{ label: string, stateKey: string }> = ({ label, stateKey }) => {
    const [score, setScore] = useSyncedState(stateKey, 0);
    return (
        <div style={{ background: '#222', padding: 15, borderRadius: 8, textAlign:'center' }}>
            <div style={{ fontSize: 14, color: '#aaa', marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>{score}</div>
            <div style={{ marginTop: 10, display:'flex', gap: 10, justifyContent:'center' }}>
                <button onClick={() => setScore(prev => Math.max(0, prev - 1))} style={{ padding: '5px 15px' }}>-1</button>
                <button onClick={() => setScore(prev => prev + 1)} style={{ padding: '5px 15px' }}>+1</button>
            </div>
        </div>
    );
};