import React from 'react';

export interface BackgroundTimer {
    stop: () => void;
}

export interface SDKConfig {
    machineId?: string | string[];      // The target machine(s) to control (single ID, array of IDs, or comma-separated string)
    machineIds?: string[];               // Alias for multiple target machine IDs
    role?: string;                       // Role to register with the host (default: 'dashboard')
    socketUrl?: string;                  // Signaling server URL (TelopHub server)
}

export interface TelopHubContextType {
    sdk: any;
    syncedState: any;
    syncedStateRef: React.MutableRefObject<any>;
    setSyncedState: React.Dispatch<React.SetStateAction<any>>;
    projectName: string;
    isConnected: boolean;
    connectionStates: Record<string, boolean>;
    targetMachineIds: string[];
    isSyncingSnapshot: boolean;
    uploadAsset: (file: Blob | File, destPath: string) => Promise<string>;
    gcAssets: (activeUrls: string[]) => void;
}

