export function cleanBase64Deep(obj: any): any {
    if (typeof obj === 'string') {
        const trimmed = obj.trim();
        if (trimmed.startsWith('data:image')) {
            if (/[\r\n\s]/.test(trimmed)) {
                return trimmed.replace(/[\r\n\s]/g, '');
            }
            return trimmed;
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(cleanBase64Deep);
    }
    if (obj && typeof obj === 'object') {
        const cleaned: any = {};
        for (const k of Object.keys(obj)) {
            cleaned[k] = cleanBase64Deep(obj[k]);
        }
        return cleaned;
    }
    return obj;
}

export function safeDeepMergeState(current: any, incomingRaw: any): any {
    if (!incomingRaw || typeof incomingRaw !== 'object') return current;
    if (!current || typeof current !== 'object') return cleanBase64Deep(incomingRaw);
    if (current === incomingRaw) return current;

    const result = { ...current };
    let hasChanges = false;

    Object.keys(incomingRaw).forEach(k => {
        const incVal = incomingRaw[k];
        const curVal = current[k];

        if (incVal === undefined || incVal === null) {
            return;
        }

        // Fast path: unchanged reference/value
        if (incVal === curVal) {
            return;
        }

        const DIRECT_REPLACE_KEYS = ['zigzag', 'set_scores', 'libero_active', 'set_lineups', 'player_points', 'match_events', 'sub_queue'];

        // Object deep merge (e.g. team objects, nested configs) vs direct replacement (discrete state objects)
        if (DIRECT_REPLACE_KEYS.includes(k)) {
            result[k] = incVal;
            hasChanges = true;
        } else if (
            typeof incVal === 'object' && !Array.isArray(incVal) &&
            typeof curVal === 'object' && !Array.isArray(curVal)
        ) {
            const mergedChild = safeDeepMergeState(curVal, incVal);
            if (mergedChild !== curVal) {
                result[k] = mergedChild;
                hasChanges = true;
            }
        } else if (Array.isArray(incVal)) {
            // Anti-destruction guard: preserve current populated array if incoming array is unexpectedly empty
            if (incVal.length === 0 && Array.isArray(curVal) && curVal.length > 0) {
                // Keep current non-empty array
            } else if (Array.isArray(curVal) && curVal.length > 0) {
                // Deep merge array elements (e.g., players) to preserve Base64 photos/logos if incoming items have empty strings
                result[k] = incVal.map((incItem: any, idx: number) => {
                    if (incItem && typeof incItem === 'object') {
                        const curItem = curVal.find((c: any) => c && c.id && incItem.id && c.id === incItem.id) || curVal[idx];
                        if (curItem && typeof curItem === 'object') {
                            return safeDeepMergeState(curItem, incItem);
                        }
                    }
                    return typeof incItem === 'string' ? cleanBase64Deep(incItem) : incItem;
                });
                hasChanges = true;
            } else {
                result[k] = cleanBase64Deep(incVal);
                hasChanges = true;
            }
        } else {
            // Anti-destruction guard: preserve long Base64 data URI if incoming string is empty
            if (typeof curVal === 'string' && curVal.length > 100 && (incVal === '' || incVal === undefined || incVal === null)) {
                // Keep existing Base64 photo/logo
            } else {
                const cleaned = typeof incVal === 'string' ? cleanBase64Deep(incVal) : incVal;
                result[k] = cleaned;
                hasChanges = true;
            }
        }
    });

    return hasChanges ? { ...result } : current;

}

export function computeStateDiff(oldState: any, newState: any): { diff: Record<string, any>; isFullSnapshot: boolean } {
    if (!newState || typeof newState !== 'object') {
        return { diff: {}, isFullSnapshot: false };
    }
    if (!oldState || typeof oldState !== 'object' || Object.keys(oldState).length === 0) {
        return { diff: newState, isFullSnapshot: false };
    }

    const diff: Record<string, any> = {};
    const newKeys = Object.keys(newState);

    for (const key of newKeys) {
        if (key.startsWith('_')) continue;
        const oldVal = oldState[key];
        const newVal = newState[key];

        if (Object.is(oldVal, newVal)) {
            continue;
        }

        // Deep JSON comparison for objects/arrays to check if content actually changed
        if (typeof newVal === 'object' && newVal !== null && typeof oldVal === 'object' && oldVal !== null) {
            if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
                continue;
            }
        }

        diff[key] = newVal;
    }

    return { diff, isFullSnapshot: false };
}



export function computeStateChecksum(state: any): string {
    if (!state || typeof state !== 'object') return '0';

    // Extract lightweight deterministic projection excluding base64 images
    const projectLightweight = (obj: any): any => {
        if (!obj || typeof obj !== 'object') {
            if (typeof obj === 'string' && (obj.startsWith('data:image') || obj.length > 200)) {
                return `[str_len_${obj.length}]`;
            }
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(projectLightweight);
        }
        const sortedKeys = Object.keys(obj).sort();
        const result: Record<string, any> = {};
        for (const k of sortedKeys) {
            if (k === '_rev' || k === '_checksum' || k === '_senderId') continue;
            if (k === 'photo' || k === 'logo' || k === 'belongingLogo') {
                const val = obj[k];
                result[k] = val ? `[img_${typeof val === 'string' ? val.length : 'obj'}]` : '';
            } else {
                result[k] = projectLightweight(obj[k]);
            }
        }
        return result;
    };

    const light = projectLightweight(state);
    const jsonStr = JSON.stringify(light);

    // Fast FNV-1a 32-bit hash
    let hash = 0x811c9dc5;
    for (let i = 0; i < jsonStr.length; i++) {
        hash ^= jsonStr.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
}

export function getInitialSyncedState(providedProjectName?: string): any {
    try {
        if (typeof window === 'undefined') return {};
        const params = new URLSearchParams(window.location.search);
        const proj = providedProjectName || params.get('project') || window.location.pathname.split('/').filter(p => p !== '')[1] || 'default';
        const storageKey = `telop-hub-state-${proj}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object') {
                console.log('[SDK Provider] 0ms Synchronous LocalStorage Hydration succeeded:', parsed);
                return parsed;
            }
        }
    } catch (e) {}
    return {};
}

