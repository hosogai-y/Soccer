import React, { useRef, useState } from 'react';
import { useSyncedState, useTelopHub } from '@sdk/TelopHubSDK';
import { Player } from './PlayerRegistry';
import { useTeamStaff, STAFF_SLOT_COUNT, MANAGER_ROLE, StaffMember } from '../utils/staff';
import { convertTgaAssetUrl } from '../utils/photoMatcher';
import { isTgaFile } from '../utils/tga';
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
 * 書き出しは全学校、または選んだ学校だけ。
 * 読み込みは追加・上書き（同じ学校・同じ氏名の選手は上書き、ファイルに無い選手は残す）。
 * ファイルに監督・コーチがいる学校は、スタッフ枠をファイルの内容に置き換える。
 * 学年が数字だけなら「年」を付け、顔写真が TGA なら PNG に変換して保存し PNG を使う
 */
export default function RosterImportExport({ schools }: { schools: string[] }) {
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [, setSchools] = useSyncedState<string[]>('school_list', []);
    const { staffOf, replaceStaff, staffSchools } = useTeamStaff();
    const { uploadAsset, isConnected } = useTelopHub();
    const fileRef = useRef<HTMLInputElement | null>(null);
    // 書き出す学校（'' = 全学校）
    const [exportSchool, setExportSchool] = useState('');

    const allTeams = buildRosterTeams(players || [], schools, staffOf, staffSchools);
    const exportTarget = allTeams.some(t => t.school === exportSchool) ? exportSchool : '';

    const handleExport = (kind: 'csv' | 'json') => {
        const list = exportTarget ? allTeams.filter(t => t.school === exportTarget) : allTeams;
        if (list.length === 0) {
            alert('書き出す選手がいません。');
            return;
        }
        const base = `soccer_players_${exportTarget ? `${exportTarget}_` : ''}${timestamp()}`;
        if (kind === 'csv') download(toCsv(list), `${base}.csv`, 'text/csv;charset=utf-8');
        else download(toJson(list), `${base}.json`, 'application/json');
    };

    // 顔写真パスが TGA の選手は、TelopHub 上の TGA を PNG に変換・保存して PNG の URL に差し替える。
    // 変換できなかった写真は元のパスのまま残し、その一覧を返す
    const convertTgaPhotos = async (teams: RosterTeam[]): Promise<{ converted: number; failed: string[] }> => {
        const tgaUrls = Array.from(new Set(teams.flatMap(t => t.players.map(p => p.photoUrl || '')).filter(u => u && isTgaFile(u))));
        if (tgaUrls.length === 0) return { converted: 0, failed: [] };
        if (!isConnected) return { converted: 0, failed: tgaUrls.map(u => `${u}（TelopHub 未接続）`) };
        const pngOf = new Map<string, string>();
        const failed: string[] = [];
        for (const url of tgaUrls) {
            try {
                pngOf.set(url, await convertTgaAssetUrl(uploadAsset, url));
            } catch (e: any) {
                failed.push(e.message);
            }
        }
        teams.forEach(t => t.players.forEach(p => {
            const png = p.photoUrl && pngOf.get(p.photoUrl);
            if (png) p.photoUrl = png;
        }));
        return { converted: pngOf.size, failed };
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
        const skipped = imported.flatMap(t => (t.skipped || []).map(name => `${t.school} ${name}`));
        const staffTeams = imported.filter(t => t.staff.length > 0);
        if (playerCount === 0 && staffTeams.length === 0) {
            alert('読み込める選手・監督・コーチがありません。');
            return;
        }
        const overflow = staffTeams.filter(t => t.staff.filter(m => m.role !== MANAGER_ROLE).length > STAFF_SLOT_COUNT - 1);
        if (!window.confirm(
            `「${file.name}」を読み込みますか？\n` +
            imported.map(t => `・${t.school}: 選手 ${t.players.length}人 / スタッフ ${t.staff.length}人`).join('\n') + '\n\n' +
            `※同じ学校・同じ氏名の選手は上書きし、それ以外は追加します（ファイルに無い選手は残ります）。\n` +
            (staffTeams.length > 0 ? `※${staffTeams.map(t => t.school).join('・')} の監督・コーチはファイルの内容に置き換えます。\n` : '') +
            (overflow.length > 0 ? `※${overflow.map(t => t.school).join('・')} はコーチ等が ${STAFF_SLOT_COUNT - 1} 人を超えるため、先頭の ${STAFF_SLOT_COUNT - 1} 人だけ登録します。\n` : '') +
            (skipped.length > 0 ? `※背番号が無い選手 ${skipped.length}人は登録しません: ${skipped.slice(0, 10).join('、')}${skipped.length > 10 ? ' ほか' : ''}` : '')
        )) return;

        const tga = await convertTgaPhotos(imported);
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

        alert(
            `読み込みました。\n選手: 追加 ${added}人・上書き ${updated}人\nスタッフ: ${staffTeams.length}校` +
            (skipped.length > 0 ? `\n背番号が無いため登録しなかった選手: ${skipped.length}人` : '') +
            (tga.converted > 0 ? `\n顔写真: TGA ${tga.converted}枚を PNG に変換しました` : '') +
            (tga.failed.length > 0 ? `\n\n※TGA を PNG に変換できなかった写真（元のパスのままです）:\n${tga.failed.slice(0, 10).join('\n')}` +
                (tga.failed.length > 10 ? `\n...ほか${tga.failed.length - 10}件` : '') : '')
        );
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
            <select className="form-select" value={exportTarget} onChange={e => setExportSchool(e.target.value)}
                style={{ width: 'auto', padding: '5px 8px', fontSize: '0.85rem' }}
                title="書き出す学校を選びます">
                <option value="">全チーム</option>
                {allTeams.map(t => <option key={t.school} value={t.school}>{t.school}</option>)}
            </select>
            <button className="btn btn-secondary" onClick={() => handleExport('csv')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title={`${exportTarget || '全学校'}の選手・監督・コーチを CSV で書き出します（Excel で開けます）`}>
                📤 CSV 書き出し
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('json')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title={`${exportTarget || '全学校'}の選手・監督・コーチを JSON で書き出します（イエロー数・コメントの黄色指定なども含む）`}>
                📤 JSON 書き出し
            </button>
            <button className="btn btn-warning" onClick={() => fileRef.current?.click()} style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                title="書き出した CSV / JSON を読み込みます（同じ学校・同じ氏名の選手は上書き、それ以外は追加）">
                📥 CSV / JSON 読み込み
            </button>
        </>
    );
}
