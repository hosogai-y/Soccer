/**
 * 漢字かな混じりの文を読みがな（カタカナ）にする。音声認識の結果（「浅田選手のワンショット」）と
 * 選手名・学校名の読みを、同じカタカナで比べるために使う。
 * 辞書は public/assets/voice/kuromoji/（scripts/setup-voice-assets.mjs で用意）から読み、ネットは使わない。
 */
import { toKatakana } from './kana';

type Token = { surface_form: string, reading?: string, pos?: string };
type Tokenizer = { tokenize(text: string): Token[] };

let tokenizerPromise: Promise<Tokenizer | null> | null = null;

// TelopHub はダッシュボードの index.html と assets/ の中しか配信しないので、assets/ の下に置く
const DIC_PATH = './assets/voice/kuromoji/';
const LOAD_TIMEOUT_MS = 30000;

/**
 * kuromoji は辞書を「*.dat.gz」の名前で取りに来るが、サーバーによっては .gz を自動解凍して返し、
 * kuromoji の解凍が失敗する。辞書は gzip のまま「*.dat.bin」で置き、読み込みの間だけ URL を差し替える。
 */
function withDictionaryUrls<T>(run: () => Promise<T>): Promise<T> {
    const original = window.fetch;
    const patched: typeof fetch = (input, init) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        if (url.includes('voice/kuromoji/') && url.endsWith('.dat.gz')) return original(url.replace(/\.dat\.gz$/, '.dat.bin'), init);
        return original(input as any, init);
    };
    window.fetch = patched;
    return run().finally(() => {
        if (window.fetch === patched) window.fetch = original;
    });
}

/** 辞書を読み込む（初回だけ。読めなければ null = 読みがな変換なしで動く） */
export function loadReadingTokenizer(): Promise<Tokenizer | null> {
    if (!tokenizerPromise) {
        // TelopHub には大きいファイルを同期しないので、辞書が無いのが普通。
        // 先に 1 回だけ確かめて、無ければ読み込まない（辞書ファイルごとに 404 を出さない）
        tokenizerPromise = fetch(`${DIC_PATH}base.dat.bin`, { method: 'HEAD' })
            .then(res => res.ok, () => false)
            .then(available => {
                if (!available) {
                    console.info('[voice] kuromoji dictionary is not deployed; matching by kanji and registered furigana only');
                    return null;
                }
                return loadTokenizer();
            });
    }
    return tokenizerPromise;
}

function loadTokenizer(): Promise<Tokenizer | null> {
    return import('@sglkc/kuromoji')
        .then(mod => withDictionaryUrls(() => new Promise<Tokenizer | null>(resolve => {
            // 辞書の読み込みで例外が出ると kuromoji はコールバックを呼ばないので、時間切れで諦める
            const timer = setTimeout(() => {
                console.warn('[voice] kuromoji dictionary timed out; matching without readings');
                resolve(null);
            }, LOAD_TIMEOUT_MS);
            const kuromoji: any = (mod as any).default || mod;
            kuromoji.builder({ dicPath: DIC_PATH }).build((err: unknown, tokenizer: Tokenizer) => {
                clearTimeout(timer);
                if (err) {
                    console.warn('[voice] kuromoji dictionary could not be loaded', err);
                    resolve(null);
                } else resolve(tokenizer);
            });
        })))
        .catch(err => {
            console.warn('[voice] kuromoji could not be loaded', err);
            return null;
        });
}

/** 読みがな（カタカナ）。辞書が無い・読めない語はその字のまま（ひらがなはカタカナに） */
export function readingOf(tokenizer: Tokenizer | null, text: string): string {
    if (!text) return '';
    if (!tokenizer) return toKatakana(text);
    return tokenizer.tokenize(text)
        .map(t => (t.reading && t.reading !== '*' ? t.reading : toKatakana(t.surface_form)))
        .join('');
}
