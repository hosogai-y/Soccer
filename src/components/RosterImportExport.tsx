import React, { useRef } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { useTeamStaff, STAFF_SLOT_COUNT, MANAGER_ROLE, StaffMember } from '../utils/staff';
import { buildRosterTeams, toCsv, toJson, teamsFromCsv, teamsFromJson, mergePlayers, staffSlotsFrom, RosterTeam } from '../utils/rosterIO';

const timestamp = () => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
};

const download = (content: string, filename: string, type: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * 登録選手一覧（選手 + 監督・コーチ）の CSV / JSON 書き出しと読み込み。
 * 読み込みは追加・上書き（同じ学校・同じ氏名の選手は上書き、ファイルに無い選手は残す）。
 * ファイルに監督・コーチがいる学校は、スタッフ枠をファイルの内容に置き換える
 */
export default function RosterImportExport({ schools }: { schools: string[] }) {
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [, setSchools] = useSyncedState<string[]>('school_list', []);
    const { staffOf, replaceStaff, staffSchools } = useTeamStaff();
    const fileRef = useRef<HTMLInputElement | null>(null);

    const teams = () => buildRosterTeams(players || [], schools, staffOf, staffSchools);

    const handleExport = (kind: 'csv' | 'json') => {
        const list = teams();
        if (list.length === 0) {
            alert('書き出す選手がいません。');
            return;
        }
        if (kind === 'csv') download(toCsv(list), `soccer_players_${timestamp()}.csv`, 'text/csv;charset=utf-8');
        else download(toJson(list), `soccer_players_${timestamp()}.json`, 'application/json');
    };

    const handleImport = async (file?: File) => {
        if (!file) return;
        let imported: RosterTeam[];
        try {
            const text = await file.text();
            imported = /\.json$/i.test(file.name) ? teamsFromJson(text) : teamsFromCsv(text);
        } catch (e: any) {
            alert(`読み込みエラー: ${e.message}`);
            return;
        }
        const playerCount = imported.reduce((n, t) => n + t.players.length, 0);
        const staffTeams = imported.filter(t => t.staff.length > 0);
        if (playerCount === 0 && staffTeams.length === 0) {
            alert('読み込める選手・監督・コーチがありません。');
            return;
        }
        const overflow = staffTeams.filter(t => t.staff.filter(m => m.role !== MANAGER_ROLE).length > STAFF_SLOT_COUNT - 1);
        if (!window.confirm(
            `「${file.name}」を読み込みますか？\n` +
            imported.map(t => `・${t.school}: 選手 ${t.players.length}人 / 監督・コーチ ${t.staff.length}人`).join('\n') + '\n\n' +
            `※同じ学校・同じ氏名の選手は上書きし、それ以外は追加します（ファイルに無い選手は残ります）。\n` +
            (staffTeams.length > 0 ? `※${staffTeams.map(t => t.school).join('・')} の監督・コーチはファイルの内容に置き換えます。\n` : '') +
            (overflow.length > 0 ? `※${overflow.map(t => t.school).join('・')} はコーチ等が ${STAFF_SLOT_COUNT - 1} 人を超えるため、先頭の ${STAFF_SLOT_COUNT - 1} 人だけ登録します。` : '')
        )) return;

        const { players: merged, added, updated } = mergePlayers(players || [], imported);
        setPlayers(merged);

        const newSchools = imported.map(t => t.school).filter(s => !schools.includes(s));
        if (newSchools.length > 0) setSchools(prev => Array.from(new Set([...(prev && prev.length > 0 ? prev : schools), ...newSchools])));

        const staffBySchool: Record<string, StaffMember[]> = {};
        staffTeams.forEach(t => {
            const slots = staffSlotsFrom(t.staff);
            if (slots) staffBySchool[t.school] = slots;
        });
        if (Object.keys(staffBySchool).length > 0) replaceStaff(staffBySchool);

        alert(`読み込みました。\n選手: 追加 ${added}人・上書き ${updated}人\n監督・コーチ: ${staffTeams.length}校`);
    };

    return (
        <>
            <input
                ref={fileRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                style={{ display: 'none' }}
                onChange={e => { handleImport(e.target.files?.[0]); e.target.value = ''; }}
            />
            <button className="btn btn-secondary" onClick={() => handleExport('csv')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title="全学校の選手・監督・コーチを CSV で書き出します（Excel で開けます）">
                📤 CSV 書き出し
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('json')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title="全学校の選手・監督・コーチを JSON で書き出します（イエロー数・コメントの黄色指定なども含む）">
                📤 JSON 書き出し
            </button>
            <button className="btn btn-warning" onClick={() => fileRef.current?.click()} style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title="書き出した CSV / JSON を読み込みます（同じ学校・同じ氏名の選手は上書き、それ以外は追加）">
                📥 CSV / JSON 読み込み
            </button>
        </>
    );
}
