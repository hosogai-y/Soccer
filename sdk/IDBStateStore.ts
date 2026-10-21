export class IDBStateStore {
    private static dbPromise: Promise<IDBDatabase> | null = null;

    private static getDB(): Promise<IDBDatabase> {
        if (this.dbPromise) return this.dbPromise;
        this.dbPromise = new Promise((resolve, reject) => {
            if (typeof indexedDB === 'undefined') {
                reject(new Error('IndexedDB not supported'));
                return;
            }
            const req = indexedDB.open('TelopHubStateDB', 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains('states')) {
                    db.createObjectStore('states');
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        return this.dbPromise;
    }

    public static async setItem(key: string, value: any): Promise<void> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('states', 'readwrite');
                const store = tx.objectStore('states');
                const req = store.put(value, key);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('[IDBStateStore] Failed to save state to IndexedDB:', e);
        }
    }

    public static async getItem(key: string): Promise<any> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('states', 'readonly');
                const store = tx.objectStore('states');
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('[IDBStateStore] Failed to read state from IndexedDB:', e);
            return null;
        }
    }
}
