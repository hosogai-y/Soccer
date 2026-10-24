import React from 'react';

export interface BackgroundTimer {
    stop: () => void;
}

export interface SDKConfig {
    machineId?: string | string[];      // The target machine(s) to control (single ID, array of IDs, or comma-separated string)
    machineIds?: string[];               // Alias for multiple target machine IDs
    role?: string;                       // Role to register with the host (default: 'dashboard')
    socketUrl?: string;                  // Signaling server URL (TelopHub server)
    useSocket?: boolean;                 // Explicitly enable Socket.IO mode (PeerJS port 9091)
}

export interface SendActionOptions {
    /**
     * 送り先のマシン ID。省略するとつながっている全ホストに送る。
     * 指定すると、その ID のホストにだけ送る（空の配列ならどのホストにも送らない）。
     * このダッシュボード自身のリスナーと、同じブラウザの別タブには宛先に関係なく届く
     */
    targets?: string[];
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
    /** Delete this project's unused assets (or list them with dryRun). null when not connected / no answer */
    gcAssets: (activeUrls: string[], options?: { dryRun?: boolean; timeoutMs?: number }) => Promise<import('./managers/AssetManager').GcAssetsResult | null>;
}

