# TelopHub Action SDK

A lightweight React library for project-specific dashboards to control TelopHub players via WebRTC.

## How It Works

The SDK connects to the Main Dashboard (TelopHub) via WebRTC over a long-polling signaling server.
Once connected, actions (show, hide, update) are relayed from your dashboard → Main Dashboard → On Air / Preview players in real time.

Connection is fully automatic: the SDK discovers the host using `machineId`, handles reconnection, and evicts stale hosts automatically.

---

## Getting Started

Wrap your app with `TelopHubProvider`. It auto-infers `machineId`, `project`, and hub URL from query parameters or `localStorage`.

```tsx
import { TelopHubProvider } from '@sdk/TelopHubSDK';

export default function App() {
    return (
        <TelopHubProvider>
            <Dashboard />
        </TelopHubProvider>
    );
}
```

### URL Parameters (auto-resolved by the Provider)

| Parameter    | Description                                      |
|--------------|--------------------------------------------------|
| `machineId`  | ID of the target TelopHub machine                |
| `project`    | Project name (also inferred from URL path)       |
| `hub`        | Base URL of the TelopHub signaling server        |

You can also pass them explicitly via the `config` prop:

```tsx
<TelopHubProvider config={{ machineId: '...', socketUrl: 'http://localhost:9090' }}>
```

---

## Core Hooks

### `useTelop(name, initialData?)`

The primary hook for controlling a telop. `name` must match the basename of the telop's `.json` or `.html` file in the `telops/` folder.

```tsx
import { useTelop } from '@sdk/TelopHubSDK';

function ScoreControl() {
    const { data, setData, show, hide, out, update, toggle, isVisible } = useTelop('Scoreboard', {
        teamA: 'Home',
        scoreA: 0,
    });

    return (
        <div>
            <h3>{data.teamA}: {data.scoreA}</h3>
            <button onClick={() => setData(prev => ({ ...prev, scoreA: prev.scoreA + 1 }))}>+1</button>
            <button onClick={() => show()}>TAKE (Show)</button>
            <button onClick={hide}>HIDE</button>
            <button onClick={out}>OUT (animate out)</button>
            <button onClick={() => update()}>UPDATE (live update)</button>
            <button onClick={toggle}>TOGGLE</button>
        </div>
    );
}
```

**Returns:**

| Field       | Type                          | Description                                              |
|-------------|-------------------------------|----------------------------------------------------------|
| `data`      | `T`                           | Current staged data (synced across all dashboards)       |
| `setData`   | `(val \| fn) => void`         | Updates staged data and syncs to TelopHub server         |
| `show`      | `(override?: T | (id) => T) => void` | Sends ShowTelopOnAir with current (or override) data |
| `hide`      | `() => void`                  | Sends HideTelopOnAir (instant)                           |
| `update`    | `(override?: T) => void`      | Sends UpdateTelopOnAir for a currently visible telop     |
| `toggle`    | `(override?: T) => void`      | show if hidden, hide if visible                          |
| `isVisible` | `boolean`                     | Whether the telop is currently shown                     |

#### Different data per machine (e.g. Japanese / English outputs)

When the dashboard is connected to several machine IDs, `show` / `update` / `toggle` also accept a function.
It is called once per connected machine, and each result is sent only to that machine.

```tsx
const LANG: Record<string, 'ja' | 'en'> = { 'machine-ja': 'ja', 'machine-en': 'en' };

const score = useTelop('Scoreboard', undefined, {
    // optional: use a different telop per machine (e.g. an English layout)
    resolveName: (machineId) => LANG[machineId] === 'en' ? 'Scoreboard_EN' : 'Scoreboard',
});

score.show((machineId) => ({ team: LANG[machineId] === 'en' ? 'Tokyo' : '東京', score: 3 }));
score.hide(); // hides the resolved telop on every machine
```

With no machine ID configured, the function is called with `''` and the result is sent as usual.

---

### `useClearAll()`

Clears all telops from On-Air and/or Preview players at once.

```tsx
import { useClearAll } from '@sdk/TelopHubSDK';

function Controls() {
    const { clearOnAir, clearPreview, clearAll } = useClearAll();
    return (
        <>
            <button onClick={clearOnAir}>Clear On Air</button>
            <button onClick={clearPreview}>Clear Preview</button>
            <button onClick={clearAll}>Clear All</button>
        </>
    );
}
```

---

### `useSyncedState<T>(key, defaultValue)`

Low-level shared state synced in real time across all connected dashboards.

```tsx
const [score, setScore] = useSyncedState<number>('score', 0);
```

---

### `useConnectionStatus()`

Returns `true` when the dashboard is connected to the Main Dashboard via WebRTC.

```tsx
const isConnected = useConnectionStatus();
```

---

### `useBackgroundInterval(callback, delay)`

A background-safe `setInterval` powered by a Web Worker. The interval keeps firing even when the tab is hidden or throttled by the browser.

```tsx
useBackgroundInterval(() => {
    tick();
}, 1000); // fires every 1s regardless of tab visibility
```

Pass `null` as `delay` to pause the interval.

---

## Raw TCP / Serial Relay

Browsers cannot open raw TCP sockets, and Web Serial only reaches ports on the machine the browser runs on.
The TelopHub server opens them instead and streams the received bytes to the dashboard
(`POST /api/proxy/tcp`, `POST /api/proxy/serial`, `GET /api/proxy/serial/ports`; same-LAN requests only).

- Bytes are relayed as-is, in arbitrary chunks. Framing (STX/ETX, XML documents, line breaks, ...) is up to the dashboard.
- One upstream connection is shared by every dashboard that opens the same target. A serial port that is already
  open with different settings is rejected (HTTP 409).
- The stream reconnects on its own until the hook unmounts or `close()` is called, backing off after repeated failures (1 s, 2 s, 4 s ... up to 15 s; reset once a connection stays up for 10 s).
- The server is gentle with the device: one connection per target shared by all dashboards, kept for 5 s after the last one leaves (a page reload reuses it), closed with a FIN rather than a reset, and closed when TelopHub shuts down.

### `useTcpStream(target, handlers, options?)`

```tsx
import { useTcpStream } from '@sdk/TelopHubSDK';

function TimingReceiver() {
    const buffer = useRef('');
    const { status, message } = useTcpStream({ host: '192.168.1.50', port: 6000 }, {
        onText: (text) => {
            buffer.current += text;
            // extract complete documents from buffer.current here
        },
    }, { encoding: 'utf-8' });

    return <div>{status}{message && ` (${message})`}</div>;
}
```

Pass `null` as `target` to disconnect. Changing the target's settings reconnects; passing new handler functions does not.

### `useSerialStream(target, handlers, options?)` / `useSerialPorts()`

```tsx
const { ports, refresh } = useSerialPorts();   // ports on the TelopHub machine: { path, friendlyName, inUse, ... }
const { status } = useSerialStream(
    { path: 'COM3', baudRate: 4800, dataBits: 7, parity: 'even', stopBits: 2 },
    { onText: (text) => { /* ... */ } },
    { encoding: 'windows-1252' },
);
```

Serial options: `baudRate` (9600), `dataBits` (8), `parity` (`'none'`), `stopBits` (1), `rtscts` (false),
`dtr` / `rts` (true: raised after opening, some devices only send while they are set).

**Handlers:** `onData(chunk: Uint8Array)` for raw bytes, `onText(text)` for text decoded with `options.encoding`
(a multi-byte character split across chunks is handled), `onStatus(status, message?)`.
**Status:** `'connecting' | 'open' | 'reconnecting' | 'closed'`; `message` explains the last failure.
**Options:** `encoding` (TextDecoder label, default `'utf-8'`), `reconnectMs` (first retry wait, default 1000), `maxReconnectMs` (default 15000).

Outside React: `sdk.openTcpStream(target, handlers, options)` / `sdk.openSerialStream(...)` return `{ close() }`,
and `sdk.listSerialPorts()` returns the port list.

---

## Advanced: `TelopHubSDK` class

The underlying class is also exported for non-React environments.

```ts
import { TelopHubSDK } from '@sdk/TelopHubSDK';

const sdk = new TelopHubSDK({
    machineId: '...',
    socketUrl: 'http://localhost:9090',
    role: 'dashboard',       // optional, default: 'dashboard'
});

sdk.joinProject('MyProject');

// Listen for state changes from TelopHub
sdk.onSyncedStateChange((state) => {
    console.log('State updated:', state);
});

// Listen for connection changes
sdk.onConnectionChange((connected) => {
    console.log('Connected:', connected);
});

// Send actions directly
sdk.sendAction('ClearAllTelopOnAir', {});
// → clears all telops on the On-Air player

// Send to specific machines only (when connected to multiple machine IDs)
sdk.sendAction('ShowTelopOnAir', { key: 'MyProject/Score', RenderableObject: dataEn }, { targets: ['machine-en'] });
// → only the host 'machine-en' receives it. Omit targets to send to all hosts.
//   Listeners in this dashboard and other tabs in the same browser still receive it regardless of targets.

// Resolve asset paths served via TelopHub
const url = sdk.resolveAssetPath('MyProject', 'images/logo.png');
// → /telop-assets/MyProject/images/logo.png
```

---

## Connection & Reconnection

- The SDK automatically discovers the host by polling `/api/signaling/hosts?machineId=...` every 3 seconds.
- Only the **most recently active** host is connected to at a time (the server enforces one host per machine).
- If an SDP offer is not received within **8 seconds**, the SDK marks the host as dead and retries.
- If the DataChannel closes, the SDK automatically schedules a reconnect after 2 seconds.
- Web Workers are used for timers to prevent throttling in background tabs. If Worker creation fails (e.g., due to CSP), the SDK falls back to native `setInterval`/`setTimeout`.

---

## Development Note for AI Agents

When building a dashboard for a project, check the `telops/` folder for `.json` or `.html` files.
Use `useTelop` with the **basename** of those files (without extension).
The `data` structure should match the fields found in those files.
