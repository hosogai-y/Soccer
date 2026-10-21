import { TelopHubSDK } from '../TelopHubClient';

export class AssetManager {
    private client: TelopHubSDK;

    constructor(client: TelopHubSDK) {
        this.client = client;
    }

    public async uploadAsset(file: Blob | File, destPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const isConnectedToHost = this.client.isConnected();
            
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                const ext = (file as File).name ? (file as File).name.split('.').pop() : 'png';
                const cleanName = destPath || `assets/upload_${Date.now()}.${ext}`;
                const projName = this.client.currentProject || 'default';
                const finalPath = `/telop-assets/${projName.replace(/^Telops\//, '')}/${cleanName}?t=${Date.now()}`;
                
                const uploadPath = `${projName.replace(/^Telops\//, '')}/${cleanName}`;
                console.log(`[SDK] 📤 Uploading asset to host: ${cleanName}`);

                const doLocalSave = async () => {
                    try {
                        const root = await (navigator.storage as any).getDirectory();
                        const userDir = await root.getDirectoryHandle('UserStorage', { create: true });
                        let current = userDir;
                        const parts = uploadPath.split('/');
                        for (let i = 0; i < parts.length - 1; i++) {
                            current = await current.getDirectoryHandle(parts[i], { create: true });
                        }
                        const fileHandle = await current.getFileHandle(parts[parts.length - 1], { create: true });
                        const writable = await (fileHandle as any).createWritable();
                        const binaryString = atob(base64);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        await writable.write(new Blob([bytes]));
                        await writable.close();
                        console.log(`[SDK] Local OPFS save complete for ${cleanName}`);
                        
                        try {
                            const files = [];
                            for await (const name of (current as any).keys()) files.push(name);
                            console.log(`[SDK DEBUG] OPFS ${uploadPath.split('/')[0]}/assets contains:`, files);
                        } catch (err) {
                            console.log('[SDK DEBUG] Dump failed', err);
                        }
                    } catch (e) {
                        console.error('[SDK] Local OPFS save failed:', e);
                    }
                };

                let isResolved = false;
                const resolveOnce = () => {
                    if (!isResolved) {
                        isResolved = true;
                        setTimeout(() => resolve(finalPath), 150);
                    }
                };

                const ackCallback = (data: any) => {
                    if (data && data.path === uploadPath) {
                        resolveOnce();
                        const listeners = this.client.actionListeners.get('project:upload-asset-complete');
                        if (listeners) {
                            const idx = listeners.indexOf(ackCallback);
                            if (idx > -1) listeners.splice(idx, 1);
                        }
                    }
                };
                this.client.actionDispatcher.onAction('project:upload-asset-complete', ackCallback);

                // ALWAYS save locally to OPFS so the local ServiceWorker can serve it,
                // because the Host might save it to the Local File System which the SW cannot read!
                doLocalSave().then(() => {
                    if (!isConnectedToHost) {
                        resolveOnce();
                    } else {
                        // If connected, send to host and we can either wait for ACK or resolve immediately.
                        // We resolve immediately so the UI doesn't block, but still wait for ACK in background.
                        resolveOnce();
                    }
                });

                if (isConnectedToHost) {
                    this.client.actionDispatcher.sendAction('project:upload-asset', { path: uploadPath, data: base64 });
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    public gcAssets(activeUrls: string[]) {
        if (this.client.isConnected()) {
            console.log(`[SDK] 🧹 Requesting asset garbage collection for ${activeUrls.length} active URLs`);
            this.client.actionDispatcher.sendAction('project:gc-assets', { activeUrls });
        }
    }
}
