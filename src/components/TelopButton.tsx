import React from 'react';
import { useTelop } from '@sdk/TelopHubSDK';

export const TelopButton: React.FC<{ label: string, telop: string }> = ({ label, telop: telopName }) => {
    const telop = useTelop(telopName);
    return (
        <button onClick={() => telop.show()} style={{ padding: '12px 20px', background: '#007bff', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
            {label}
        </button>
    );
};