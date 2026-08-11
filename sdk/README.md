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
| `show`      | `(override?: T) => void`      | Sends ShowTelopOnAir with current (or override) data     |
| `hide`      | `() => void`                  | Sends HideTelopOnAir (instant)                           |
| `update`    | `(override?: T) => void`      | Sends UpdateTelopOnAir for a currently visible telop     |
| `toggle`    | `(override?: T) => void`      | show if hidden, hide if visible                          |
| `isVisible` | `boolean`                     | Whether the telop is currently shown                     |

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
