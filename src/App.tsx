import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { TelopHubProvider, useConnectionStatus } from '@sdk/TelopHubSDK';

import CGOperator from './components/CGOperator';
import LiveEditor from './components/LiveEditor';
import PlayerRegistry from './components/PlayerRegistry';
import LineupEditor from './components/LineupEditor';
import GlobalTimerManager from './components/GlobalTimerManager';

const PROJECT_NAME = "Telops/soccer";

export default function App() {
    return (
        <TelopHubProvider projectName={PROJECT_NAME} config={{ socketUrl: 'https://telophub.onrender.com' }}>
            <GlobalTimerManager />
            <BrowserRouter>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <nav className="modern-nav flex-between">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>
                                ⚽ SoccerCast
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>CG Operation</NavLink>
                                <NavLink to="/live" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Live Editor</NavLink>
                                <NavLink to="/players" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Player Registry</NavLink>
                                <NavLink to="/lineup" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Lineups</NavLink>
                            </div>
                        </div>
                        <ConnectionBadge />
                    </nav>
                    <main style={{ padding: '32px', flex: 1, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
                        <Routes>
                            <Route path="/" element={<CGOperator />} />
                            <Route path="/live" element={<LiveEditor />} />
                            <Route path="/players" element={<PlayerRegistry />} />
                            <Route path="/lineup" element={<LineupEditor />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </TelopHubProvider>
    );
}

function ConnectionBadge() {
    const isConnected = useConnectionStatus();
    return (
        <div className={`status-badge ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'currentColor', marginRight: 6, verticalAlign: 'middle', marginTop: -2, boxShadow: isConnected ? '0 0 8px currentColor' : 'none' }}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
        </div>
    );
}
