export interface TimerPayload {
    時刻: string;
    前後半: string;
    // 全角 keyExp
    分２桁: string;
    分１桁: string;
    秒２桁: string;
    秒１桁: string;
    分３桁: string;
    セミコロン: string;
    前半後半延長: string;
    // 半角 keyExp エイリアス
    分2桁: string;
    分1桁: string;
    秒2桁: string;
    秒1桁: string;
    分3桁: string;
}

/**
 * ミリ秒および前後半文字列から、タイマーグラフィックの各keyExp画像パーツを含む
 * 軽量かつ完全なペイロードを生成します。
 * 
 * 0〜9分の時は分1桁のみ表示し、分2桁・分3桁は空文字("")にして「0:00」表記を実現します。
 */
export function buildTimerPayload(totalMs: number, period: string = '前半'): TimerPayload {
    const safeMs = Math.max(0, totalMs);
    const totalSeconds = Math.floor(safeMs / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    const sStr = s.toString().padStart(2, '0');
    const timeStr = `${m}:${sStr}`;

    const sec2 = Math.floor(s / 10);
    const sec1 = s % 10;

    // 分の計算 (0分〜9分は分2桁・分3桁を空文字にして 0:00 表記にする)
    let min3Img = '';
    let min2Img = '';
    let min1Img = `img/Time_${m % 10}.png`;

    if (m < 10) {
        // 0:00 〜 9:59 : 分2桁・分3桁は画像なし(非表示)
        min3Img = '';
        min2Img = '';
        min1Img = `img/Time_${m}.png`;
    } else if (m < 100) {
        // 10:00 〜 99:59 : 分2桁を表示
        min3Img = '';
        min2Img = `img/Time_${Math.floor(m / 10)}.png`;
        min1Img = `img/Time_${m % 10}.png`;
    } else {
        // 100:00 〜 : 分3桁・分2桁・分1桁を表示
        const mStr = m.toString();
        min3Img = `img/Time_${mStr[0]}.png`;
        min2Img = `img/Time_${mStr[1]}.png`;
        min1Img = `img/Time_${mStr[2]}.png`;
    }

    const sec2Img = `img/Time_${sec2}.png`;
    const sec1Img = `img/Time_${sec1}.png`;
    const colonImg = `img/Time_10.png`;

    let halfImg = 'img/HD2D_P01_Moji_1.png';
    const p = period || '前半';
    // 「延長後半」は「後半」も含むため、延長の判定を先に行う
    if (p.includes('延後') || p.includes('延長後半') || p === 'Ex2') {
        halfImg = 'img/HD2D_P01_Moji_4.png';
    } else if (p.includes('延前') || p.includes('延長前半') || p === 'Ex1') {
        halfImg = 'img/HD2D_P01_Moji_3.png';
    } else if (p.includes('後半') || p === '2nd') {
        halfImg = 'img/HD2D_P01_Moji_2.png';
    }

    return {
        時刻: timeStr,
        前後半: p,
        // 全角 keyExp
        分２桁: min2Img,
        分１桁: min1Img,
        秒２桁: sec2Img,
        秒１桁: sec1Img,
        分３桁: min3Img,
        セミコロン: colonImg,
        前半後半延長: halfImg,
        // 半角 keyExp エイリアス
        分2桁: min2Img,
        分1桁: min1Img,
        秒2桁: sec2Img,
        秒1桁: sec1Img,
        分3桁: min3Img
    };
}
