import type { BackgroundTimer } from './types';
import { startBackgroundTimeout } from './timers';

/**
 * Raw TCP / serial relay client.
 *
 * Browsers cannot open raw TCP sockets or (from another machine) serial ports, so the TelopHub server
 * opens them and streams the received bytes back (POST /api/proxy/tcp, /api/proxy/serial).
 * The stream reconnects on its own until close() is called, waiting longer after each failure in a row
 * (1 s, 2 s, 4 s ... up to maxReconnectMs) so a struggling server is not hammered. Bytes arrive in arbitrary chunks:
 * framing (STX/ETX, XML documents, ...) is up to the caller.
 */

export type RelayStatus = 'connecting' | 'open' | 'reconnecting' | 'closed';

export interface TcpRelayTarget {
    host: string;
    port: number;
}

export interface SerialRelayTarget {
    /** e.g. "COM3" (Windows) or "/dev/ttyUSB0" */
    path: string;
    baudRate?: number;                                       // default 9600
    dataBits?: 5 | 6 | 7 | 8;                                // default 8
    parity?: 'none' | 'even' | 'odd' | 'mark' | 'space';     // default 'none'
    stopBits?: 1 | 1.5 | 2;                                  // default 1
    rtscts?: boolean;                                        // hardware flow control, default false
    /** Raise DTR / RTS after opening (default true; some devices only send while they are set) */
    dtr?: boolean;
    rts?: boolean;
}

export interface SerialPortInfo {
    path: string;
    manufacturer?: string;
    friendlyName?: string;
    serialNumber?: string;
    vendorId?: string;
    productId?: string;
    /** Already opened by the relay (another dashboard is reading it) */
    inUse: boolean;
}

export interface RelayStreamHandlers {
    /** Raw received bytes */
    onData?: (chunk: Uint8Array) => void;
    /** Received text, decoded with `encoding` (a multi-byte character split across chunks is handled) */
    onText?: (text: string) => void;
    /** Connection status; `message` explains a failure (e.g. "connect ECONNREFUSED ...") */
    onStatus?: (status: RelayStatus, message?: string) => void;
}

export interface RelayStreamOptions {
    /** TextDecoder label for onText (default 'utf-8'; e.g. 'shift_jis', 'windows-1252') */
    encoding?: string;
    /** Wait before the first reconnect after a failure or disconnect (default 1000 ms); doubles on each failure in a row */
    reconnectMs?: number;
    /** Longest wait between reconnects (default 15000 ms) */
    maxReconnectMs?: number;
}

export interface RelayStream {
    close: () => void;
}

/** POSTs `body` to the relay endpoint and keeps reading the streamed response, reconnecting until closed */
export function openRelayStream(
    url: string,
    body: unknown,
    handlers: RelayStreamHandlers,
    options: RelayStreamOptions = {},
): RelayStream {
    const reconnectMs = options.reconnectMs ?? 1000;
    const maxReconnectMs = Math.max(reconnectMs, options.maxReconnectMs ?? 15000);
    /** A connection that stayed up this long counts as healthy and resets the backoff */
    const STABLE_MS = 10000;
    let failures = 0;
    let openedAt = 0;
    let closed = false;
    let controller: AbortController | null = null;
    let retryTimer: BackgroundTimer | null = null;

    const setStatus = (status: RelayStatus, message?: string) => {
        try {
            handlers.onStatus?.(status, message);
        } catch (err) {
            console.error('[SDK Relay] onStatus handler threw:', err);
        }
    };

    const scheduleReconnect = (message?: string) => {
        if (closed) return;
        if (openedAt && Date.now() - openedAt >= STABLE_MS) failures = 0;
        openedAt = 0;
        const delay = Math.min(maxReconnectMs, reconnectMs * 2 ** failures);
        failures++;
        setStatus('reconnecting', message ? `${message} (retry in ${Math.round(delay / 1000)} s)` : undefined);
        retryTimer = startBackgroundTimeout(() => {
            retryTimer = null;
            connect();
        }, delay);
    };

    const connect = async () => {
        if (closed) return;
        controller = new AbortController();
        setStatus('connecting');
        let resp: Response;
        try {
            resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
        } catch (err: any) {
            if (closed) return;
            scheduleReconnect(err?.message || 'Could not reach the TelopHub server');
            return;
        }

        if (!resp.ok || !resp.body) {
            let message = `HTTP ${resp.status}`;
            try {
                const json = await resp.json();
                if (json?.error) message = json.error;
            } catch { /* not JSON */ }
            scheduleReconnect(message);
            return;
        }

        openedAt = Date.now();
        setStatus('open');
        // A fresh decoder per connection: a character cut off by a disconnect is not glued to the next one
        const decoder = handlers.onText ? new TextDecoder(options.encoding || 'utf-8') : null;
        const reader = resp.body.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (!value || value.length === 0) continue;
                try {
                    handlers.onData?.(value);
                    if (decoder) {
                        const text = decoder.decode(value, { stream: true });
                        if (text) handlers.onText!(text);
                    }
                } catch (err) {
                    console.error('[SDK Relay] data handler threw:', err);
                }
            }
            scheduleReconnect('Connection closed');
        } catch (err: any) {
            if (closed) return;
            scheduleReconnect(err?.message || 'Connection lost');
        }
    };

    connect();

    return {
        close: () => {
            if (closed) return;
            closed = true;
            retryTimer?.stop();
            retryTimer = null;
            controller?.abort();
            setStatus('closed');
        },
    };
}

export async function fetchSerialPorts(baseUrl: string): Promise<SerialPortInfo[]> {
    const resp = await fetch(`${baseUrl}/api/proxy/serial/ports`);
    const json = await resp.json().catch(() => null);
    if (!resp.ok || !json?.success) {
        throw new Error(json?.error || `Could not list serial ports (HTTP ${resp.status})`);
    }
    return json.ports as SerialPortInfo[];
}
