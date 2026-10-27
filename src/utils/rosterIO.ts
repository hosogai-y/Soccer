import type { Player, Pro2CommentItem } from '../components/PlayerRegistry';
import type { StaffMember } from './staff';
import { STAFF_SLOT_COUNT, STAFF_COMMENT_COUNT, MANAGER_ROLE } from './staff';

/**
 * 登録選手一覧（選手 + 監督・コーチ）の CSV / JSON 書き出しと読み込み。
 * CSV は学校ごとに選手（背番号順）→ 監督 → コーチの順。監督・コーチは
 * ポジション欄に役職、学年欄に年齢を入れ、背番号・身長・体重・ゴール・顔写真は空欄。
 */

const COMMENT_COUNT = 5;
export const CSV_HEADERS = [
    '高校名', '背番号', 'フルネーム', '苗字', 'ポジション', '学年', '身長', '体重',
    "Today'sゴール", 'Totalゴール', '顔写真パス',
    ...Array.from({ length: COMMENT_COUNT }, (_, i) => `プロ２コメント#${i + 1}`)
];
const PLAYER_POSITIONS = ['GK', 'DF', 'MF', 'FW'];

export const ROSTER_JSON_FORMAT = 'soccer-roster';

export type RosterTeam = {
    school: string;
    players: Player[];
    staff: StaffMember[]; // 氏名のある枠だけ（1 件目が監督とは限らない）
};

// ---------------------------------------------------------------- 共通

const byNumber = (a: Player, b: Player) => (parseInt(a.number) || 0) - (parseInt(b.number) || 0);

/** 「浅田　卓人」→「浅田」（全角・半角スペースの前） */
export const surnameOf = (fullName: string) => fullName.trim().split(/[\s　]+/)[0] || '';

const commentsOf = (p: { pro2List?: Pro2CommentItem[], pro2Comment?: string }): Pro2CommentItem[] => {
    const list = (p.pro2List || []).filter(c => c && c.text && c.text.trim() !== '');
    if (list.length === 0 && p.pro2Comment) return [{ text: p.pro2Comment, isYellow: false }];
    return list;
};

/** 学校の並び（登録済みの学校順 → それ以外は出てきた順） */
function schoolOrder(players: Player[], schools: string[], staffSchools: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    [...schools, ...players.map(p => p.schoolName), ...staffSchools].forEach(s => {
        if (s && !seen.has(s)) { seen.add(s); out.push(s); }
    });
    return out;
}

export function buildRosterTeams(players: Player[], schools: string[], staffOf: (school: string) => StaffMember[], staffSchools: string[]): RosterTeam[] {
    return schoolOrder(players, schools, staffSchools)
        .map(school => ({
            school,
            players: players.filter(p => p.schoolName === school).sort(byNumber),
            staff: staffOf(school).filter(m => m.name.trim() !== '')
        }))
        .filter(t => t.players.length > 0 || t.staff.length > 0);
}

// ---------------------------------------------------------------- CSV

const csvCell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

export function toCsv(teams: RosterTeam[]): string {
    const rows: string[][] = [CSV_HEADERS];
    teams.forEach(t => {
        t.players.forEach(p => {
            const comments = commentsOf(p);
            rows.push([
                t.school, p.number || '', p.name || '', surnameOf(p.name || ''), p.position || '', p.grade || '',
                p.height || '', p.weight || '', p.todayGoals || '0', p.totalGoals || '0', p.photoUrl || '',
                ...Array.from({ length: COMMENT_COUNT }, (_, i) => comments[i]?.text || '')
            ]);
        });
        // 監督を先に、続けてコーチなど
        const staff = [...t.staff].sort((a, b) => Number(b.role === MANAGER_ROLE) - Number(a.role === MANAGER_ROLE));
        staff.forEach(m => {
            const comments = m.pro2List.filter(c => c.text && c.text.trim() !== '');
            rows.push([
                t.school, '', m.name, surnameOf(m.name), m.role, m.age || '', '', '', '', '', '',
                ...Array.from({ length: COMMENT_COUNT }, (_, i) => comments[i]?.text || '')
            ]);
        });
    });
    // Excel で文字化けしないよう BOM 付き・CRLF
    return '﻿' + rows.map(r => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

/** CSV を行×列に分解（ダブルクォート内のカンマ・改行に対応） */
export function parseCsv(text: string): string[][] {
    const s = text.replace(/^﻿/, '');
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (inQuotes) {
            if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; }
            else if (c === '"') inQuotes = false;
            else cell += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(cell); cell = ''; }
        else if (c === '\n' || c === '\r') {
            if (c === '\r' && s[i + 1] === '\n') i++;
            row.push(cell); rows.push(row); row = []; cell = '';
        } else cell += c;
    }
    if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(v => v.trim() !== ''));
}

// 見出しの表記ゆれ（全角数字・半角の「2」・空白）を吸収して比べる
const normHeader = (h: string) => h.trim().replace(/\s/g, '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[’‘]/g, "'");
const toHalf = (v: string) => v.trim().replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));

export function teamsFromCsv(text: string): RosterTeam[] {
    const rows = parseCsv(text);
    if (rows.length === 0) throw new Error('CSV が空です。');
    const header = rows[0].map(normHeader);
    const col = (name: string) => header.indexOf(normHeader(name));
    const required = ['高校名', 'フルネーム', 'ポジション'];
    const missing = required.filter(h => col(h) < 0);
    if (missing.length > 0) throw new Error(`CSV の見出しに ${missing.join('・')} がありません。1 行目は書き出した CSV と同じ見出しにしてください。`);

    const get = (r: string[], name: string) => {
        const i = col(name);
        return i >= 0 ? (r[i] || '').trim() : '';
    };
    const commentCols = Array.from({ length: COMMENT_COUNT }, (_, i) => `プロ２コメント#${i + 1}`);
    const teams = new Map<string, RosterTeam>();
    rows.slice(1).forEach(r => {
        const school = get(r, '高校名');
        const name = get(r, 'フルネーム');
        if (!school || !name) return;
        if (!teams.has(school)) teams.set(school, { school, players: [], staff: [] });
        const team = teams.get(school)!;
        const position = get(r, 'ポジション');
        const comments = commentCols.map(h => get(r, h)).filter(Boolean).map(text => ({ text, isYellow: false }));
        if (PLAYER_POSITIONS.includes(position.toUpperCase())) {
            const today = toHalf(get(r, "Today'sゴール")) || '0';
            const total = toHalf(get(r, 'Totalゴール')) || today;
            team.players.push({
                id: '', schoolName: school, name, number: toHalf(get(r, '背番号')), position: position.toUpperCase(),
                grade: toHalf(get(r, '学年')), height: toHalf(get(r, '身長')), weight: toHalf(get(r, '体重')),
                todayGoals: today, totalGoals: total, photoUrl: get(r, '顔写真パス'),
                pro2Comment: comments[0]?.text || '', pro2List: comments
            });
        } else {
            // GK/DF/MF/FW 以外は監督・コーチ（ポジション欄 = 役職、学年欄 = 年齢）
            team.staff.push({ role: position || 'コーチ', name, age: toHalf(get(r, '学年')), pro2List: comments });
        }
    });
    return [...teams.values()];
}

// ---------------------------------------------------------------- JSON

export function toJson(teams: RosterTeam[]): string {
    return JSON.stringify({
        format: ROSTER_JSON_FORMAT,
        version: 1,
        exportedAt: new Date().toISOString(),
        schools: teams.map(t => ({
            name: t.school,
            players: t.players.map(p => ({
                number: p.number || '', name: p.name || '', surname: surnameOf(p.name || ''), position: p.position || '',
                grade: p.grade || '', height: p.height || '', weight: p.weight || '',
                todayGoals: p.todayGoals || '0', totalGoals: p.totalGoals || '0', baseTotalGoals: p.baseTotalGoals || '',
                yellowCards: p.yellowCards || '0', photoUrl: p.photoUrl || '', photoEnabled: p.photoEnabled !== false,
                pro2IsYellow: !!p.pro2IsYellow, pro2List: commentsOf(p)
            })),
            staff: t.staff.map(m => ({
                role: m.role, name: m.name, surname: surnameOf(m.name), age: m.age || '',
                pro2List: m.pro2List.filter(c => c.text && c.text.trim() !== '')
            }))
        }))
    }, null, 2);
}

export function teamsFromJson(text: string): RosterTeam[] {
    let data: any;
    try {
        data = JSON.parse(text.replace(/^﻿/, ''));
    } catch {
        throw new Error('JSON として読めません。');
    }
    if (!data || data.format !== ROSTER_JSON_FORMAT || !Array.isArray(data.schools)) {
        throw new Error('選手一覧の JSON ではありません（この画面で書き出した JSON を使ってください）。');
    }
    const str = (v: any) => (v === undefined || v === null ? '' : String(v));
    const list = (v: any): Pro2CommentItem[] => (Array.isArray(v) ? v : [])
        .map((c: any) => ({ text: str(c?.text).trim(), isYellow: !!c?.isYellow }))
        .filter((c: Pro2CommentItem) => c.text !== '');
    return data.schools
        .filter((s: any) => str(s?.name))
        .map((s: any) => {
            const school = str(s.name);
            return {
                school,
                players: (Array.isArray(s.players) ? s.players : []).filter((p: any) => str(p?.name)).map((p: any) => {
                    const pro2List = list(p.pro2List);
                    return {
                        id: '', schoolName: school, name: str(p.name), number: str(p.number), position: str(p.position) || 'FW',
                        grade: str(p.grade), height: str(p.height), weight: str(p.weight),
                        todayGoals: str(p.todayGoals) || '0', totalGoals: str(p.totalGoals) || '0',
                        ...(str(p.baseTotalGoals) ? { baseTotalGoals: str(p.baseTotalGoals) } : {}),
                        yellowCards: str(p.yellowCards) || '0', photoUrl: str(p.photoUrl), photoEnabled: p.photoEnabled !== false,
                        pro2IsYellow: !!p.pro2IsYellow, pro2Comment: pro2List[0]?.text || '', pro2List
                    } as Player;
                }),
                staff: (Array.isArray(s.staff) ? s.staff : []).filter((m: any) => str(m?.name)).map((m: any) => ({
                    role: str(m.role) || 'コーチ', name: str(m.name), age: str(m.age), pro2List: list(m.pro2List)
                }))
            };
        });
}

// ---------------------------------------------------------------- 取り込み

/**
 * 読み込んだ選手を今の一覧に反映する。同じ学校で氏名（なければ背番号）が一致する選手は上書き、それ以外は追加。
 * ファイルに無い選手は消さない。CSV に無い項目（イエロー数・写真 ON/OFF・コメントの黄色）は今の値を残す
 */
export function mergePlayers(current: Player[], teams: RosterTeam[]) {
    const next = [...current];
    let added = 0;
    let updated = 0;
    const now = Date.now();
    teams.forEach(t => t.players.forEach((inc, idx) => {
        const sameSchool = (p: Player) => p.schoolName === t.school;
        const pos = next.findIndex(p => sameSchool(p) && p.name.replace(/\s|　/g, '') === inc.name.replace(/\s|　/g, ''));
        const at = pos >= 0 ? pos : (inc.number ? next.findIndex(p => sameSchool(p) && p.number === inc.number) : -1);
        const today = parseInt(inc.todayGoals || '0', 10) || 0;
        const total = parseInt(inc.totalGoals || '0', 10) || 0;
        const base = inc.baseTotalGoals !== undefined ? inc.baseTotalGoals : String(Math.max(0, total - today));
        if (at >= 0) {
            const cur = next[at];
            // コメント文が同じ枠は、今の黄色指定を引き継ぐ
            const pro2List = (inc.pro2List || []).map((c, i) => ({
                text: c.text,
                isYellow: c.isYellow || (cur.pro2List?.[i]?.text === c.text && !!cur.pro2List?.[i]?.isYellow)
            }));
            next[at] = {
                ...cur,
                ...inc,
                id: cur.id,
                teamId: cur.teamId,
                baseTotalGoals: base,
                pro2List,
                yellowCards: inc.yellowCards ?? cur.yellowCards,
                photoEnabled: inc.photoEnabled ?? cur.photoEnabled,
                pro2IsYellow: inc.pro2IsYellow ?? cur.pro2IsYellow
            };
            updated++;
        } else {
            next.push({
                yellowCards: '0',
                photoEnabled: true,
                pro2IsYellow: false,
                ...inc,
                id: `${now}${String(added).padStart(3, '0')}${idx}`,
                teamId: t.school === '札幌大谷' ? 'right' : 'left',
                baseTotalGoals: base
            });
            added++;
        }
    }));
    return { players: next, added, updated };
}

/** 読み込んだ監督・コーチを学校のスタッフ枠（監督 + 3 枠）に並べる。監督は 1 枠目、残りは順に */
export function staffSlotsFrom(staff: StaffMember[]): StaffMember[] | null {
    if (staff.length === 0) return null;
    const pad = (m: StaffMember): StaffMember => ({
        ...m,
        pro2List: Array.from({ length: STAFF_COMMENT_COUNT }, (_, i) => m.pro2List[i] || { text: '', isYellow: false })
    });
    const manager = staff.find(m => m.role === MANAGER_ROLE);
    const others = staff.filter(m => m !== manager);
    const slots: StaffMember[] = [pad(manager ? { ...manager, role: MANAGER_ROLE } : { role: MANAGER_ROLE, name: '', age: '', pro2List: [] })];
    others.slice(0, STAFF_SLOT_COUNT - 1).forEach(m => slots.push(pad(m)));
    while (slots.length < STAFF_SLOT_COUNT) slots.push(pad({ role: 'コーチ', name: '', age: '', pro2List: [] }));
    return slots;
}
