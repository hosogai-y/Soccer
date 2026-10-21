import { BackgroundTimer } from './types';

export function startBackgroundInterval(callback: () => void, delay: number): BackgroundTimer {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
        try {
            const blob = new Blob([
                `
                let timerId = null;
                self.onmessage = function(e) {
                    if (e.data.type === 'start') {
                        timerId = setInterval(() => {
                            self.postMessage('tick');
                        }, e.data.delay);
                    } else if (e.data.type === 'stop') {
                        if (timerId) clearInterval(timerId);
                    }
                };
                `
            ], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const worker = new Worker(url);

            let active = true;
            worker.onmessage = () => {
                if (active) callback();
            };
            worker.postMessage({ type: 'start', delay });

            return {
                stop: () => {
                    if (!active) return;
                    active = false;
                    try {
                        worker.postMessage({ type: 'stop' });
                        worker.terminate();
                    } catch (e) {}
                    try {
                        URL.revokeObjectURL(url);
                    } catch (e) {}
                }
            };
        } catch (err) {
            console.warn('[SDK] Background worker interval creation failed, using native fallback:', err);
        }
    }
    const id = setInterval(callback, delay);
    return {
        stop: () => clearInterval(id)
    };
}

export function startBackgroundTimeout(callback: () => void, delay: number): BackgroundTimer {
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
        try {
            const blob = new Blob([
                `
                let timerId = null;
                self.onmessage = function(e) {
                    if (e.data.type === 'start') {
                        timerId = setTimeout(() => {
                            self.postMessage('timeout');
                        }, e.data.delay);
                    } else if (e.data.type === 'stop') {
                        if (timerId) clearTimeout(timerId);
                    }
                };
                `
            ], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            const worker = new Worker(url);

            let active = true;
            worker.onmessage = () => {
                if (!active) return;
                active = false;
                try {
                    worker.terminate();
                } catch (e) {}
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {}
                callback();
            };
            worker.postMessage({ type: 'start', delay });

            return {
                stop: () => {
                    if (!active) return;
                    active = false;
                    try {
                        worker.postMessage({ type: 'stop' });
                        worker.terminate();
                    } catch (e) {}
                    try {
                        URL.revokeObjectURL(url);
                    } catch (e) {}
                }
            };
        } catch (err) {
            console.warn('[SDK] Background worker timeout creation failed, using native fallback:', err);
        }
    }
    const id = setTimeout(callback, delay);
    return {
        stop: () => clearTimeout(id)
    };
}

export function backgroundDelay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        startBackgroundTimeout(resolve, ms);
    });
}
