import { useCallback } from 'react';
import { useSyncedState } from '@sdk/TelopHubSDK';
import { Player } from '../components/PlayerRegistry';
import { TEAM_LINEUPS_KEY, TeamLineup, SubstitutionPair, hasRegistered, applySubstitutions } from './lineup';

/**
 * 選手交代反映: Lineups の登録メンバー（team_lineups）でスタメンと控えを入れ替える関数を返す。
 * 反映できた組があれば true。反映できなかった組は理由をアラートで知らせる
 */
export function useApplySubstitution() {
    const [teamLineups, setTeamLineups] = useSyncedState<Record<string, TeamLineup>>(TEAM_LINEUPS_KEY, {});
    const [players] = useSyncedState<Player[]>('roster', []);

    return useCallback((team: string, pairs: SubstitutionPair[]): boolean => {
        const valid = pairs.filter(p => p.outId && p.inId);
        if (valid.length === 0) {
            alert('OUT 選手と IN 選手を選択してください。');
            return false;
        }
        const lineup = teamLineups?.[team];
        if (!lineup || !hasRegistered(lineup)) {
            alert(`${team} のメンバーが未登録です。Lineups タブで「メンバー登録/更新」を押してください。`);
            return false;
        }
        const nameOf = (id: string) => {
            const p = (players || []).find(pl => pl.id === id);
            return p ? `#${p.number} ${p.name}` : '(不明な選手)';
        };
        const { lineup: next, applied, skipped } = applySubstitutions(lineup, valid, nameOf);
        if (applied.length > 0) setTeamLineups(prev => ({ ...(prev || {}), [team]: next }));
        if (skipped.length > 0) {
            alert((applied.length > 0 ? `${applied.length} 件を反映しました。\n` : '') + `反映できなかった交代:\n・${skipped.join('\n・')}`);
        }
        return applied.length > 0;
    }, [teamLineups, setTeamLineups, players]);
}
