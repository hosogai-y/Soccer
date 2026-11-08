/**
 * 音声認識エンジン。どれも「話し終わった 1 区切りごとに、聞き取り候補の文字列を返す」形にそろえる。
 * - online : ブラウザ（Chrome / Edge）の音声認識。精度は高いが、音声をブラウザ提供元のサーバーに送るのでネットが要る
 * - offline: Vosk（WebAssembly）。ネットなしで端末の中だけで認識する。モデルは public/assets/voice/ に置く
 */

export type EngineKind = 'online' | 'offline';
export type EngineState = 'idle' | 'loading' | 'listening' | 'error';

export type EngineCallbacks = {
    onFinal: (alternatives: string[]) => void; // 1 区切りの認識結果（候補の多い順）
    onPartial?: (text: string) => void; // 話している途中の結果（表示用）
    onState: (state: EngineState, message?: string) => void;
};

export interface SpeechEngine {
    kind: EngineKind;
    start(): Promise<void>;
    stop(): void;
}

// 中身は tar.gz。.gz の名前だとサーバーが自動解凍して返すことがあり、Vosk が読めなくなるので .bin で置く
// TelopHub はダッシュボードの index.html と assets/ の中しか配信しないので、assets/ の下に置く
export const VOSK_MODEL_URL = './assets/voice/vosk-model-small-ja-0.22.tar.gz.bin';

// ---------------------------------------------------------------- online（Web Speech API）

const SpeechRecognitionCtor = (): any => (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
export const onlineEngineAvailable = () => !!SpeechRecognitionCtor();

// この時間内に RESTART_LIMIT 回止まったら、繋ぎ直しをやめる
const RESTART_WINDOW_MS = 10000;
const RESTART_LIMIT = 5;

export function createOnlineEngine(cb: EngineCallbacks): SpeechEngine {
    let rec: any = null;
    let active = false;
    let disposed = false; // 止めた・エラーで終わった後の onend / onerror は無視する
    return {
        kind: 'online',
        async start() {
            const Ctor = SpeechRecognitionCtor();
            if (!Ctor) throw new Error('このブラウザは音声認識（オンライン）に対応していません。Chrome か Edge を使ってください。');
            active = true;
            disposed = false;
            rec = new Ctor();
            rec.lang = 'ja-JP';
            rec.continuous = true;
            rec.interimResults = true;
            rec.maxAlternatives = 5;
            rec.onresult = (e: any) => {
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    const r = e.results[i];
                    if (r.isFinal) {
                        const alts: string[] = [];
                        for (let j = 0; j < r.length; j++) alts.push(r[j].transcript);
                        cb.onFinal(alts);
                    } else cb.onPartial?.(r[0].transcript);
                }
            };
            rec.onerror = (e: any) => {
                if (disposed) return;
                // no-speech / aborted は待ち受けを続ける。ネット切れ・マイク拒否は知らせる
                if (e.error === 'no-speech' || e.error === 'aborted') return;
                const msg = e.error === 'network' ? 'ネットに繋がらないため、オンライン認識が使えません'
                    : e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'マイクの使用が許可されていません'
                    : `音声認識エラー: ${e.error}`;
                active = false;
                disposed = true;
                cb.onState('error', msg);
            };
            // continuous でもしばらく無音だと止まるので、止めるまでは繋ぎ直す。
            // すぐ止まる状態（他のタブがマイクを使っている・aborted が続く等）で即座に繋ぎ直すと
            // start / end が際限なく回ってブラウザが固まり、TelopHub との接続も切れるので、間を空け、続くときは諦める
            const recentEnds: number[] = [];
            rec.onend = () => {
                if (disposed || !active) return;
                const now = Date.now();
                recentEnds.push(now);
                while (recentEnds.length > 0 && now - recentEnds[0] > RESTART_WINDOW_MS) recentEnds.shift();
                if (recentEnds.length >= RESTART_LIMIT) {
                    active = false;
                    disposed = true;
                    cb.onState('error', '音声認識がすぐに止まるため、待ち受けをやめました（他のタブ・アプリでマイクを使っていないか確認してください）');
                    return;
                }
                const current = rec;
                setTimeout(() => {
                    if (disposed || !active || rec !== current) return;
                    try { current.start(); } catch { /* 二重 start は無視 */ }
                }, recentEnds.length > 1 ? 1000 : 250);
            };
            rec.start();
            cb.onState('listening');
        },
        stop() {
            const wasDisposed = disposed;
            active = false;
            disposed = true;
            try { rec?.stop(); } catch { /* 止まっている */ }
            rec = null;
            if (!wasDisposed) cb.onState('idle');
        }
    };
}

// ---------------------------------------------------------------- offline（Vosk）

let voskModelPromise: Promise<any> | null = null;

/** Vosk のモデルを読み込む（初回だけ数秒〜十数秒。2 回目からは使い回す） */
function loadVoskModel(): Promise<any> {
    if (!voskModelPromise) {
        voskModelPromise = (async () => {
            const head = await fetch(VOSK_MODEL_URL, { method: 'HEAD' }).catch(() => null);
            if (!head || !head.ok) {
                // TelopHub には大きいファイルを同期しないので、TelopHub から開いた画面ではモデルが無いのが普通
                throw new Error('オフライン認識は使えません（音声モデルは TelopHub に置いていません）。「自動」か「オンライン」で使ってください');
            }
            const Vosk: any = await import('vosk-browser');
            return (Vosk.createModel || Vosk.default?.createModel)(new URL(VOSK_MODEL_URL, location.href).href);
        })();
        voskModelPromise.catch(() => { voskModelPromise = null; });
    }
    return voskModelPromise;
}

export function createOfflineEngine(cb: EngineCallbacks): SpeechEngine {
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;
    let node: ScriptProcessorNode | null = null;
    let recognizer: any = null;
    let stopped = false;
    const cleanup = () => {
        node?.disconnect();
        stream?.getTracks().forEach(t => t.stop());
        ctx?.close().catch(() => undefined);
        try { recognizer?.remove(); } catch { /* 片付け済み */ }
        node = null; stream = null; ctx = null; recognizer = null;
    };
    return {
        kind: 'offline',
        async start() {
            stopped = false;
            cb.onState('loading', 'オフライン音声モデルを読み込み中…');
            const model = await loadVoskModel();
            if (stopped) return;
            cb.onState('loading', 'マイクの使用許可を待っています（ブラウザの確認で「許可」を押してください）');
            stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 }
            });
            if (stopped) { cleanup(); return; }
            ctx = new AudioContext();
            recognizer = new model.KaldiRecognizer(ctx.sampleRate);
            recognizer.on('result', (m: any) => {
                // Vosk の日本語は単語ごとに空白が入る
                const text = String(m?.result?.text || '').replace(/\s+/g, '');
                if (text) cb.onFinal([text]);
            });
            recognizer.on('partialresult', (m: any) => {
                const text = String(m?.result?.partial || '').replace(/\s+/g, '');
                if (text) cb.onPartial?.(text);
            });
            node = ctx.createScriptProcessor(4096, 1, 1);
            node.onaudioprocess = e => {
                try { recognizer?.acceptWaveform(e.inputBuffer); } catch (err) { console.warn('[voice] acceptWaveform failed', err); }
            };
            ctx.createMediaStreamSource(stream).connect(node);
            // ScriptProcessor は出力に繋がないと動かないブラウザがある（音は 0 を出すだけ）
            node.connect(ctx.destination);
            cb.onState('listening');
        },
        stop() {
            stopped = true;
            cleanup();
            cb.onState('idle');
        }
    };
}

/** auto: ネットに繋がっていてブラウザの認識があれば online、なければ offline */
export function pickEngine(pref: 'auto' | EngineKind): EngineKind {
    if (pref !== 'auto') return pref;
    return navigator.onLine && onlineEngineAvailable() ? 'online' : 'offline';
}
