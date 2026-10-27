import { useCallback } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import type { Pro2CommentItem } from '../components/PlayerRegistry';

/**
 * 学校ごとのスタッフ（監督 + 汎用 3 枠）。1Shot のプロ2表示で送出する。
 * 枠数固定で、synced state には JSON 文字列で保存する（SDK の配列マージを避ける）。
 */
export type StaffMember = {
    role: string; // 役職（1 枠目は監督固定）
    name: string;
    age: string;
    pro2List: Pro2CommentItem[];
};

export const STAFF_SLOT_COUNT = 4;
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
    const staffMap = parseStaff(json);

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
            Object.entries(bySchool).forEach(([school, slots]) => { map[school] = normalizeSlots(slots); });
            return JSON.stringify(map);
        });
    }, [setJson]);

    /** スタッフを登録したことのある学校 */
    const staffSchools = Object.keys(staffMap);

    return { staffOf, updateMember, replaceStaff, staffSchools };
}

/** 登録済み（氏名あり）のスタッフだけ */
export const registeredStaff = (slots: StaffMember[]) => slots.filter(m => m.name.trim() !== '');

/** 空でないプロ2コメント */
export const staffComments = (m: StaffMember) => m.pro2List.filter(c => c.text && c.text.trim() !== '');
