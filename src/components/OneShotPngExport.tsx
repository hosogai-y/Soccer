import React, { useState } from 'react';
import JSZip from 'jszip';
import { useSyncedState, useTelopHub } from '@sdk/TelopHubSDK';
import type { Player } from './PlayerRegistry';
import { TeamConfig, DEFAULT_TEAM_CONFIGS } from './TeamSettings';
import { useTeamStaff, registeredStaff, staffComments } from '../utils/staff';
import { playerComments, playerPhotoUrl, buildPlayerOneShotPayload, buildStaffOneShotPayload } from '../utils/oneShotPayload';
import { openOneShotSnapshotter } from '../utils/oneShotSnapshot';

/**
 * 選んでいるチームの選手とスタッフ（監督・コーチ・総監督など）全員の 1Shot（プロ2）を 1 人 1 枚の PNG にし、
 * 「<チーム名>1SHOT確認用.zip」でダウンロードする。画像は顔写真から 1Shot の座布団までを切り出す。
 * 送出と同じ中身にするため、コメントは CG Operation で最初に選ばれている 1 件目を使う。
 */

const safeName = (s: string) => s.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
const numberRank = (n?: string) => {
    const v = parseInt((n || '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)), 10);
    return Number.isNaN(v) ? Infinity : v;
};

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function OneShotPngExport({ school, players }: { school: string, players: Player[] }) {
    const { projectName } = useTelopHub();
    const [teamConfigs] = useSyncedState<TeamConfig[]>('team_configs', DEFAULT_TEAM_CONFIGS);
    const [globalPhotoEnabled] = useSyncedState<boolean>('global_photo_enabled', true);
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const { staffOf } = useTeamStaff();
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState('');

    const staff = registeredStaff(staffOf(school));
    const total = players.length + staff.length;

    const handleExport = async () => {
        if (total === 0) return;
        setBusy(true);
        setStatus('1Shot テロップを準備しています...');
        const teams = teamConfigs && teamConfigs.length > 0 ? teamConfigs : DEFAULT_TEAM_CONFIGS;
        const teamConfig = teams.find(t => t.name === school);
        const staffSide: 'left' | 'right' = school === oaRightTeam ? 'right' : 'left';

        // 選手は背番号順、そのあとにスタッフ（監督から登録順）
        const shots: { file: string, payload: Record<string, any> }[] = [];
        [...players].sort((a, b) => numberRank(a.number) - numberRank(b.number)).forEach(p => {
            const comment = playerComments(p)[0];
            shots.push({
                file: `${p.number ? `#${p.number}` : '番号なし'}_${p.name || '氏名なし'}`,
                payload: buildPlayerOneShotPayload({
                    player: p,
                    teamConfig,
                    side: p.teamId === 'right' ? 'right' : 'left',
                    school,
                    mode: 'pro2',
                    commentText: comment?.text || '',
                    isYellow: false,
                    photoUrl: playerPhotoUrl(p, globalPhotoEnabled)
                })
            });
        });
        staff.forEach(m => {
            shots.push({
                file: `${m.role || 'スタッフ'}_${m.name}`,
                payload: buildStaffOneShotPayload({ member: m, teamConfig, side: staffSide, school, comment: staffComments(m)[0] || { text: '', isYellow: false } })
            });
        });

        let snapshotter: Awaited<ReturnType<typeof openOneShotSnapshotter>> | null = null;
        try {
            snapshotter = await openOneShotSnapshotter(projectName || 'Telops/soccer');
            const zip = new JSZip();
            const failed: string[] = [];
            const blobs = await snapshotter.renderAll(shots.map(x => x.payload), (done, all) => {
                setStatus(`PNG を作っています... (${done}/${all}) ${shots[done - 1]?.file || ''}`);
            });
            blobs.forEach((blob, i) => {
                const { file } = shots[i];
                if (blob) zip.file(`${String(i + 1).padStart(2, '0')}_${safeName(file)}.png`, blob);
                else failed.push(file);
            });
            setStatus('ZIP にまとめています...');
            downloadBlob(await zip.generateAsync({ type: 'blob' }), `${safeName(school)}1SHOT確認用.zip`);
            setStatus(failed.length > 0
                ? `保存しました（${shots.length - failed.length}枚）。作れなかった人: ${failed.join('、')}`
                : `保存しました（選手 ${players.length}人・スタッフ ${staff.length}人）。`);
        } catch (e: any) {
            setStatus(`エラー: ${e.message}`);
        } finally {
            snapshotter?.close();
            setBusy(false);
        }
    };

    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
                className="btn btn-secondary"
                style={{ padding: '3px 10px', fontSize: '0.8rem' }}
                onClick={handleExport}
                disabled={busy || total === 0}
                title={`${school} の選手 ${players.length}人・スタッフ ${staff.length}人の 1Shot（プロ2）を 1 人ずつ PNG にして ZIP で保存します`}
            >
                📸 1SHOT確認用PNG ({total}人)
            </button>
            {status && <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{busy ? '⏳ ' : ''}{status}</span>}
        </span>
    );
}
