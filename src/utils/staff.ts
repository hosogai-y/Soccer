import { useCallback, useMemo } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import type { Pro2CommentItem } from '../components/PlayerRegistry';

/**
 * 学校ごとのスタッフ（監督 + 汎用 4 枠の 5 名。コーチ・総監督など）。1Shot のプロ2表示で送出する。
 * 枠数固定で、synced state には JSON 文字列で保存する（SDK の配列マージを避ける）。
 */
export type StaffMember = {
    role: string; // 役職（1 枠目は監督固定）
    name: string;
    kana?: string; // ふりがな（音声送出の照合用。姓と名の間は空白）
    age: string;
    pro2List: Pro2CommentItem[];
};

export const STAFF_SLOT_COUNT = 5;
export const STAFF_COMMENT_COUNT = 5;
export const MANAGER_ROLE = '監督';
const DEFAULT_GENERIC_ROLE = 'コーチ';

const STAFF_KEY = 'team_staff_json';
// 旧: 監督名のみ（学校名 → 監督名）
const LEGACY_MANAGERS_KEY = 'team_managers';

const emptyMember = (idx: number, name = ''): StaffMember => ({
    role: idx === 0 ? MANAGER_ROLE : DEFAULT_GENERIC_ROLE,
    name,
    age: '',
    pro2List: Array.from({ length: STAFF_COMMENT_COUNT }, () => ({ text: '', isYellow: false }))
});

/** 枠数・コメント数を揃える（保存データが欠けていても常に STAFF_SLOT_COUNT 枠） */
const normalizeSlots = (list: StaffMember[] | undefined, legacyManager = ''): StaffMember[] =>
    Array.from({ length: STAFF_SLOT_COUNT }, (_, i) => {
        const m = list?.[i];
        if (!m) return emptyMember(i, i === 0 ? legacyManager : '');
        return {
            ...emptyMember(i),
            ...m,
            role: i === 0 ? MANAGER_ROLE : (m.role ?? DEFAULT_GENERIC_ROLE),
            pro2List: Array.from({ length: STAFF_COMMENT_COUNT }, (_, j) => m.pro2List?.[j] || { text: '', isYellow: false })
        };
    });

type StaffMap = Record<string, StaffMember[]>;

const parseStaff = (json: string | null | undefined): StaffMap => {
    if (typeof json !== 'string') return {};
    try {
        const parsed = JSON.parse(json);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
};

export function useTeamStaff() {
    const [json, setJson] = useSyncedState<string | null>(STAFF_KEY, null);
    const [legacyManagers] = useSyncedState<Record<string, string>>(LEGACY_MANAGERS_KEY, {});
    // 毎回パースし直すと staffOf が描画ごとに変わり、音声送出の照合準備（読みがな変換）まで毎回やり直しになる
    const staffMap = useMemo(() => parseStaff(json), [json]);

    /** 学校のスタッフ枠（未登録なら空枠。旧形式の監督名は 1 枠目に引き継ぐ） */
    const staffOf = useCallback((school: string) => normalizeSlots(staffMap[school], legacyManagers?.[school] || ''), [staffMap, legacyManagers]);

    const updateMember = useCallback((school: string, idx: number, patch: Partial<StaffMember>) => {
        setJson(prevJson => {
            const map = parseStaff(prevJson);
            const slots = normalizeSlots(map[school], legacyManagers?.[school] || '');
            slots[idx] = { ...slots[idx], ...patch };
            return JSON.stringify({ ...map, [school]: slots });
        });
    }, [setJson, legacyManagers]);

    /**
     * 学校ごとのスタッフ枠をまとめて置き換える（選手一覧の CSV / JSON 読み込み）。
     * 共有ステートは書いた直後に読み直しても古いことがあるので、複数校は 1 回で書く
     */
    const replaceStaff = useCallback((bySchool: Record<string, StaffMember[]>) => {
        setJson(prevJson => {
            const map = parseStaff(prevJson);
            Object.entries(bySchool).forEach(([school, slots]) => {
                // 読み込んだファイルにふりがなが無い人は、同じ名前の今のふりがなを引き継ぐ
                const before = map[school] || [];
                map[school] = normalizeSlots(slots).map(m => (m.kana || !m.name ? m : { ...m, kana: before.find(b => b.name === m.name)?.kana }));
            });
            return JSON.stringify(map);
        });
    }, [setJson]);

    /** スタッフを登録したことのある学校 */
    const staffSchools = useMemo(() => Object.keys(staffMap), [staffMap]);

    return { staffOf, updateMember, replaceStaff, staffSchools };
}

/**
 * 学校を消したあとのスタッフ関連ステート（チーム削除用）。
 * キーの削除は差分マージでは反映されないので、全体スナップショットに混ぜて書く
 */
export const staffStateWithoutSchool = (state: Record<string, any>, school: string): Record<string, any> => {
    const staff = parseStaff(state[STAFF_KEY]);
    delete staff[school];
    const legacy = { ...(state[LEGACY_MANAGERS_KEY] || {}) };
    delete legacy[school];
    return { [STAFF_KEY]: JSON.stringify(staff), [LEGACY_MANAGERS_KEY]: legacy };
};

/** 登録済み（氏名あり）のスタッフだけ */
export const registeredStaff = (slots: StaffMember[]) => slots.filter(m => m.name.trim() !== '');

/** 空でないプロ2コメント */
export const staffComments = (m: StaffMember) => m.pro2List.filter(c => c.text && c.text.trim() !== '');
