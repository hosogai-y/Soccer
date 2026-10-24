import React, { useState, useEffect, useRef } from 'react';
import { useSyncedState, useTelopHub } from '@sdk/TelopHubSDK';
import { matchPlayerPhoto, toPhotoFile, faceAssetPath, toPhotoAssetUrl, encodePhotoUrl, isImageFile, PhotoFile } from '../utils/photoMatcher';

export interface Pro2CommentItem {
    text: string;
    isYellow?: boolean;
}

export type Player = {
    id: string;
    schoolName: string; // 高校名 (e.g. "札幌創成", "札幌大谷")
    teamId?: 'left' | 'right'; // Backward compatibility fallback
    name: string; // 氏名
    number: string; // 背番号
    position: string; // ポジション (GK, DF, MF, FW)
    grade: string; // 学年 ("", "1年", "2年", "3年")
    height: string; // 身長
    weight: string; // 体重
    pro2Comment: string; // プロ2コメント (第1スロット互換用)
    pro2List?: Pro2CommentItem[]; // 最大5個のプロ2コメントスロット
    pro2IsYellow?: boolean; // プロ2黄色文字フラグ (ONでコメント全部が黄色デザインに流し込まれる)
    prevTeam?: string; // Legacy fallback
    yellowCards?: string; // 累積イエロー
    totalGoals?: string; // 通算ゴール
    todayGoals?: string; // Todaysゴール
    baseTotalGoals?: string; // 本日の試合前時点での通算ゴール
    isSubbed?: boolean; // 交代フラグ
    photoUrl?: string; // 顔写真パス/URL
    photoEnabled?: boolean; // 選手個別の顔写真送出ON/OFF (デフォルト: true)
};

// Full-width to half-width digit converter helper
export const toHalfWidthNum = (str: string): string => {
    if (!str) return '';
    return str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)).trim();
};

const DEFAULT_SCHOOLS = ['札幌創成', '札幌大谷', '帯広北', '北海'];

export default function PlayerRegistry() {
    const [players, setPlayers] = useSyncedState<Player[]>('roster', []);
    const [schools, setSchools] = useSyncedState<string[]>('school_list', DEFAULT_SCHOOLS);
    const [globalPhotoEnabled, setGlobalPhotoEnabled] = useSyncedState<boolean>('global_photo_enabled', true);
    const [oaLeftTeam] = useSyncedState<string>('oa_left_team', '札幌創成');
    const [oaRightTeam] = useSyncedState<string>('oa_right_team', '帯広北');
    const { uploadAsset, gcAssets, isConnected } = useTelopHub();
    const bulkFilesRef = useRef<HTMLInputElement | null>(null);
    const bulkFolderRef = useRef<HTMLInputElement | null>(null);
    const formPhotoRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // Currently selected school filter in player list
    const [selectedSchool, setSelectedSchool] = useState<string>('札幌創成');
    const [newSchoolName, setNewSchoolName] = useState<string>('');

    // Photo matching status message
    const [matchingStatus, setMatchingStatus] = useState<string>('');

    // Editing state
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

    // Number selection mode: '1'..'25' or 'custom'
    const [numberSelectMode, setNumberSelectMode] = useState<string>('1');

    const [form, setForm] = useState<Partial<Player>>({
        schoolName: '札幌創成',
        name: '',
        number: '1',
        position: 'FW',
        grade: '',
        height: '',
        weight: '',
        pro2Comment: '',
        pro2IsYellow: false,
        pro2List: [
            { text: '', isYellow: false },
            { text: '', isYellow: false },
            { text: '', isYellow: false },
            { text: '', isYellow: false },
            { text: '', isYellow: false }
        ],
        yellowCards: '0',
        totalGoals: '0',
        todayGoals: '0',
        baseTotalGoals: '0',
        photoUrl: '',
        photoEnabled: true
    });

    const activeSchools = Array.from(new Set([...(schools || DEFAULT_SCHOOLS)]));

    const showStatus = (message: string, clearAfterMs?: number) => {
        setMatchingStatus(message);
        if (clearAfterMs) setTimeout(() => setMatchingStatus(''), clearAfterMs);
    };

    // 選んだ写真を背番号・氏名で選手に割り当て、割り当て先のある写真だけ TelopHub にアップロード
    const handleBulkPhotoFiles = async (fileList: FileList | null) => {
        const files = Array.from(fileList || []).filter(f => isImageFile(f.name));
        if (files.length === 0) {
            showStatus('画像ファイルが見つかりませんでした。', 5000);
            return;
        }
        if (!isConnected) {
            showStatus('TelopHubに接続されていないため、写真をアップロードできません。', 5000);
            return;
        }

        const photoFiles = files.map(f => toPhotoFile(f, selectedSchool));
        const assignments = new Map<string, PhotoFile>();
        (players || []).forEach(p => {
            const matched = matchPlayerPhoto(p, photoFiles, p.schoolName || selectedSchool);
            if (matched) assignments.set(p.id, matched);
        });
        if (assignments.size === 0) {
            showStatus(`${files.length}枚の写真に合う選手が見つかりませんでした（ファイル名は「背番号 氏名.png」）。`, 8000);
            return;
        }

        setIsUploading(true);
        try {
            const toUpload = Array.from(new Set(assignments.values()));
            const urls = new Map<PhotoFile, string>();
            for (let i = 0; i < toUpload.length; i++) {
                const ph = toUpload[i];
                setMatchingStatus(`写真をアップロード中... (${i + 1}/${toUpload.length})`);
                urls.set(ph, await uploadAsset(ph.file, faceAssetPath(ph.school, ph.filename)));
            }
            setPlayers(prev => (prev || []).map(p => {
                const ph = assignments.get(p.id);
                const url = ph && urls.get(ph);
                return url ? { ...p, photoUrl: url, photoEnabled: p.photoEnabled !== false } : p;
            }));
            showStatus(`完了: ${assignments.size}名の顔写真を登録しました！`, 5000);
        } catch (e: any) {
            showStatus(`アップロードエラー: ${e.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // フォームの選手1人分の写真をアップロード
    const handleFormPhotoFile = async (file: File | undefined, school: string) => {
        if (!file) return;
        if (!isConnected) {
            showStatus('TelopHubに接続されていないため、写真をアップロードできません。', 5000);
            return;
        }
        setIsUploading(true);
        try {
            const url = await uploadAsset(file, faceAssetPath(school, file.name.normalize('NFC')));
            setForm(prev => ({ ...prev, photoUrl: url }));
        } catch (e: any) {
            showStatus(`アップロードエラー: ${e.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // どの選手も使っていない写真を assets/ から削除（先に一覧を見せて確認する）
    const handleCleanupPhotos = async () => {
        const activeUrls = Array.from(new Set((players || []).map(p => toPhotoAssetUrl(p.photoUrl)).filter(Boolean)));
        const preview = await gcAssets(activeUrls, { dryRun: true });
        if (!preview) {
            showStatus('TelopHubから応答がないため、整理できませんでした。', 5000);
            return;
        }
        if (preview.error) {
            showStatus(`整理エラー: ${preview.error}`);
            return;
        }
        if (preview.unused.length === 0) {
            showStatus('使っていない写真はありません。', 5000);
            return;
        }
        const list = preview.unused.slice(0, 20).join('\n') + (preview.unused.length > 20 ? `\n...ほか${preview.unused.length - 20}枚` : '');
        if (!confirm(`どの選手も使っていない写真が${preview.unused.length}枚あります。削除しますか？\n\n${list}`)) return;
        const result = await gcAssets(activeUrls);
        showStatus(result ? `${result.deleted.length}枚の写真を削除しました。` : 'TelopHubから応答がありませんでした。', 5000);
    };

    // Add new school
    const handleAddSchool = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newSchoolName.trim();
        if (!trimmed) return;
        if (!schools?.includes(trimmed)) {
            setSchools(prev => [...(prev || []), trimmed]);
        }
        setSelectedSchool(trimmed);
        setForm(prev => ({ ...prev, schoolName: trimmed }));
        setNewSchoolName('');
    };

    const handleNumberSelectChange = (val: string) => {
        setNumberSelectMode(val);
        if (val !== 'custom') {
            setForm(prev => ({ ...prev, number: val }));
        }
    };

    // Today'sゴール入力時にTotalゴール数を連動更新するロジック
    const handleTodayGoalsChange = (valStr: string) => {
        const cleanToday = toHalfWidthNum(valStr);
        const todayNum = parseInt(cleanToday || '0', 10) || 0;
        const baseNum = parseInt(form.baseTotalGoals || '0', 10) || 0;
        const newTotal = String(baseNum + todayNum);

        setForm(prev => ({
            ...prev,
            todayGoals: cleanToday,
            totalGoals: newTotal
        }));
    };

    // Totalゴール直接変更時（基準値baseTotalGoalsも更新）
    const handleTotalGoalsChange = (valStr: string) => {
        const cleanTotal = toHalfWidthNum(valStr);
        const totalNum = parseInt(cleanTotal || '0', 10) || 0;
        const todayNum = parseInt(form.todayGoals || '0', 10) || 0;
        const newBase = String(Math.max(0, totalNum - todayNum));

        setForm(prev => ({
            ...prev,
            totalGoals: cleanTotal,
            baseTotalGoals: newBase
        }));
    };

    // Pro 2 Comments list handler helper
    const handlePro2Change = (index: number, field: 'text' | 'isYellow', value: any) => {
        setForm(prev => {
            const list: Pro2CommentItem[] = [...(prev.pro2List || [
                { text: '', isYellow: false },
                { text: '', isYellow: false },
                { text: '', isYellow: false },
                { text: '', isYellow: false },
                { text: '', isYellow: false }
            ])];
            while (list.length < 5) {
                list.push({ text: '', isYellow: false });
            }
            list[index] = { ...list[index], [field]: value };
            const primary = list[0]?.text || '';
            return {
                ...prev,
                pro2List: list,
                pro2Comment: primary
            };
        });
    };

    // Handle Add / Update Player Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name) return;

        const cleanNumber = toHalfWidthNum(form.number || '1');
        const cleanHeight = toHalfWidthNum(form.height || '');
        const cleanWeight = toHalfWidthNum(form.weight || '');
        const targetSchool = form.schoolName || selectedSchool || '札幌創成';
        const targetPhotoUrl = toPhotoAssetUrl(form.photoUrl);

        // 5スロットのコメントを整形
        const rawList = form.pro2List || [];
        const cleanedList: Pro2CommentItem[] = rawList
            .map(item => ({ text: (item.text || '').trim(), isYellow: !!item.isYellow }))
            .filter(item => item.text !== '');
        const primaryComment = cleanedList[0]?.text || form.pro2Comment || '';

        if (editingPlayerId) {
            // Update existing player
            setPlayers(prev => (prev || []).map(p => {
                if (p.id === editingPlayerId) {
                    return {
                        ...p,
                        schoolName: targetSchool,
                        teamId: targetSchool === '札幌大谷' ? 'right' : 'left',
                        name: form.name || '',
                        number: cleanNumber,
                        position: form.position || 'FW',
                        grade: form.grade || '',
                        height: cleanHeight,
                        weight: cleanWeight,
                        pro2Comment: primaryComment,
                        pro2List: cleanedList,
                        pro2IsYellow: !!form.pro2IsYellow,
                        yellowCards: form.yellowCards || '0',
                        totalGoals: form.totalGoals || '0',
                        todayGoals: form.todayGoals || '0',
                        baseTotalGoals: form.baseTotalGoals || '0',
                        photoUrl: targetPhotoUrl,
                        photoEnabled: form.photoEnabled !== false
                    };
                }
                return p;
            }));
            setEditingPlayerId(null);
        } else {
            // Add new player
            const newPlayer: Player = {
                id: Date.now().toString(),
                schoolName: targetSchool,
                teamId: targetSchool === '札幌大谷' ? 'right' : 'left',
                name: form.name || '',
                number: cleanNumber,
                position: form.position || 'FW',
                grade: form.grade || '',
                height: cleanHeight,
                weight: cleanWeight,
                pro2Comment: primaryComment,
                pro2List: cleanedList,
                pro2IsYellow: !!form.pro2IsYellow,
                yellowCards: form.yellowCards || '0',
                totalGoals: form.totalGoals || '0',
                todayGoals: form.todayGoals || '0',
                baseTotalGoals: form.baseTotalGoals || '0',
                photoUrl: targetPhotoUrl,
                photoEnabled: form.photoEnabled !== false
            };
            setPlayers(prev => [...(prev || []), newPlayer]);
        }

        resetForm(targetSchool);
    };

    const handleStartEdit = (player: Player) => {
        setEditingPlayerId(player.id);
        const num = player.number || '1';
        const isStandardNum = parseInt(num, 10) >= 1 && parseInt(num, 10) <= 25 && String(parseInt(num, 10)) === num;
        setNumberSelectMode(isStandardNum ? num : 'custom');
        
        const school = player.schoolName || (player.teamId === 'right' ? '札幌大谷' : '札幌創成');

        // 既存の pro2List または pro2Comment から5スロット作成
        const existingList = (player.pro2List && player.pro2List.length > 0)
            ? player.pro2List.map(item => ({ text: item.text, isYellow: !!item.isYellow }))
            : (player.pro2Comment ? [{ text: player.pro2Comment, isYellow: false }] : []);
        
        const paddedList: Pro2CommentItem[] = [...existingList];
        while (paddedList.length < 5) {
            paddedList.push({ text: '', isYellow: false });
        }

        setForm({
            schoolName: school,
            name: player.name,
            number: num,
            position: player.position,
            grade: player.grade || '',
            height: player.height || '',
            weight: player.weight || '',
            pro2Comment: player.pro2Comment || player.prevTeam || '',
            pro2List: paddedList,
            pro2IsYellow: !!player.pro2IsYellow,
            yellowCards: player.yellowCards || '0',
            totalGoals: player.totalGoals || '0',
            todayGoals: player.todayGoals || '0',
            baseTotalGoals: player.baseTotalGoals || player.totalGoals || '0',
            photoUrl: player.photoUrl || '',
            photoEnabled: player.photoEnabled !== false
        });
    };

    const handleCancelEdit = () => {
        setEditingPlayerId(null);
        resetForm(selectedSchool);
    };

    const resetForm = (schoolName: string) => {
        setForm({
            schoolName,
            name: '',
            number: '1',
            position: 'FW',
            grade: '',
            height: '',
            weight: '',
            pro2Comment: '',
            pro2IsYellow: false,
            pro2List: [
                { text: '', isYellow: false },
                { text: '', isYellow: false },
                { text: '', isYellow: false },
                { text: '', isYellow: false },
                { text: '', isYellow: false }
            ],
            yellowCards: '0',
            totalGoals: '0',
            todayGoals: '0',
            baseTotalGoals: '0',
            photoUrl: '',
            photoEnabled: true
        });
        setNumberSelectMode('1');
    };

    const handleDelete = (id: string) => {
        if (confirm('この選手を削除しますか？')) {
            setPlayers(prev => (prev || []).filter(p => p.id !== id));
            if (editingPlayerId === id) {
                setEditingPlayerId(null);
                resetForm(selectedSchool);
            }
        }
    };

    // Toggle individual player photo enabled
    const togglePlayerPhoto = (id: string) => {
        setPlayers(prev => (prev || []).map(p => {
            if (p.id === id) {
                return { ...p, photoEnabled: !(p.photoEnabled !== false) };
            }
            return p;
        }));
    };

    const filteredPlayers = (players || []).filter(p => {
        const school = p.schoolName || (p.teamId === 'right' ? '札幌大谷' : '札幌創成');
        return school === selectedSchool;
    });

    return (
        <div>
            {/* Datalists for Height & Weight */}
            <datalist id="height-options">
                {[...Array(49)].map((_, i) => (
                    <option key={i + 150} value={150 + i} />
                ))}
            </datalist>
            <datalist id="weight-options">
                {[...Array(46)].map((_, i) => (
                    <option key={i + 55} value={55 + i} />
                ))}
            </datalist>

            {/* Top Toolbar */}
            <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0 }}>⚽ 選手登録 & 高校名・顔写真管理 (Player Registry)</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>
                        顔写真のアップロードと選手の紐付け・ゴール数・イエローカード管理
                    </p>
                </div>
                
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Global Photo Toggle */}
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <input 
                            type="checkbox" 
                            checked={globalPhotoEnabled !== false} 
                            onChange={e => setGlobalPhotoEnabled(e.target.checked)} 
                        />
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: globalPhotoEnabled !== false ? '#4caf50' : '#f44336' }}>
                            顔写真送出: {globalPhotoEnabled !== false ? '一括 ON' : '一括 OFF'}
                        </span>
                    </label>

                    {/* 写真の一括登録（ファイル名「背番号 氏名.png」で自動割り当て） */}
                    <input
                        ref={bulkFilesRef}
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => { handleBulkPhotoFiles(e.target.files); e.target.value = ''; }}
                    />
                    <input
                        ref={(el) => {
                            bulkFolderRef.current = el;
                            if (el) el.setAttribute('webkitdirectory', '');
                        }}
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={e => { handleBulkPhotoFiles(e.target.files); e.target.value = ''; }}
                    />
                    <button 
                        className="btn btn-primary" 
                        onClick={() => bulkFilesRef.current?.click()}
                        disabled={isUploading}
                        title={`選んだ写真を「${selectedSchool}」の選手に背番号・氏名で割り当てます`}
                        style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        🖼️ 写真をまとめて登録
                    </button>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => bulkFolderRef.current?.click()}
                        disabled={isUploading}
                        title="高校名のフォルダ（またはそれをまとめた親フォルダ）を選ぶと、フォルダ名を高校名として割り当てます"
                        style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        📁 フォルダごと登録
                    </button>
                    <button 
                        className="btn btn-secondary" 
                        onClick={handleCleanupPhotos}
                        disabled={isUploading}
                        title="どの選手にも使われていない写真をTelopHubから削除します"
                        style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        🧹 使っていない写真を整理
                    </button>

                    {/* Add New School Inline Form */}
                    <form onSubmit={handleAddSchool} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="新しい高校名を入力..." 
                            value={newSchoolName} 
                            onChange={e => setNewSchoolName(e.target.value)} 
                            style={{ padding: '6px 12px', fontSize: '0.85rem', width: '160px' }}
                        />
                        <button type="submit" className="btn btn-warning" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                            ➕ 高校追加
                        </button>
                    </form>
                </div>
            </div>

            {matchingStatus && (
                <div style={{ padding: '8px 16px', background: 'rgba(13, 202, 240, 0.2)', border: '1px solid #0dcaf0', borderRadius: 6, marginBottom: 16, fontSize: '0.9rem', color: '#0dcaf0' }}>
                    {matchingStatus}
                </div>
            )}

            <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                
                {/* Registration / Edit Form */}
                <div className="glass-panel" style={{ flex: '0 0 400px' }}>
                    <div className="flex-between" style={{ marginBottom: 16 }}>
                        <h3 style={{ margin: 0, color: editingPlayerId ? '#ffca28' : 'white' }}>
                            {editingPlayerId ? '✏️ 選手情報を編集' : '➕ 選手新規登録'}
                        </h3>
                        {editingPlayerId && (
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={handleCancelEdit}>
                                キャンセル
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* School Name Select */}
                        <div className="form-group">
                            <label className="form-label">高校名 (所属チーム)</label>
                            <select 
                                className="form-select" 
                                value={form.schoolName} 
                                onChange={e => setForm({...form, schoolName: e.target.value})}
                            >
                                {activeSchools.map(sch => (
                                    <option key={sch} value={sch}>{sch}</option>
                                ))}
                            </select>
                        </div>

                        {/* Number (1-25 Select + Custom) */}
                        <div className="form-group">
                            <label className="form-label">背番号 (Number)</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <select 
                                    className="form-select" 
                                    style={{ flex: 1 }}
                                    value={numberSelectMode} 
                                    onChange={e => handleNumberSelectChange(e.target.value)}
                                >
                                    {[...Array(25)].map((_, i) => (
                                        <option key={i + 1} value={String(i + 1)}>{i + 1} 番</option>
                                    ))}
                                    <option value="custom">その他 (直接入力)</option>
                                </select>

                                {numberSelectMode === 'custom' && (
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ flex: 1, fontWeight: 'bold' }} 
                                        placeholder="背番号..." 
                                        required 
                                        value={form.number || ''} 
                                        onChange={e => setForm({...form, number: e.target.value})} 
                                    />
                                )}
                            </div>
                        </div>

                        {/* Player Name */}
                        <div className="form-group">
                            <label className="form-label">氏名 (Name)</label>
                            <input 
                                className="form-input" 
                                required 
                                placeholder="例: 月舘 汰壱" 
                                value={form.name || ''} 
                                onChange={e => setForm({...form, name: e.target.value})} 
                            />
                        </div>

                        {/* Position & Grade */}
                        <div className="flex-between" style={{ gap: 12 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">ポジション</label>
                                <select className="form-select" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                                    <option value="GK">GK</option>
                                    <option value="DF">DF</option>
                                    <option value="MF">MF</option>
                                    <option value="FW">FW</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">学年 (Grade)</label>
                                <select className="form-select" value={form.grade || ''} onChange={e => setForm({...form, grade: e.target.value})}>
                                    <option value="">(空白)</option>
                                    <option value="1年">1年</option>
                                    <option value="2年">2年</option>
                                    <option value="3年">3年</option>
                                </select>
                            </div>
                        </div>

                        {/* Height & Weight */}
                        <div className="flex-between" style={{ gap: 12 }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">身長 (cm)</label>
                                <input 
                                    type="text" 
                                    list="height-options" 
                                    className="form-input" 
                                    placeholder="150~198..." 
                                    value={form.height || ''} 
                                    onChange={e => setForm({...form, height: e.target.value})} 
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">体重 (kg)</label>
                                <input 
                                    type="text" 
                                    list="weight-options" 
                                    className="form-input" 
                                    placeholder="55~100" 
                                    value={form.weight || ''} 
                                    onChange={e => setForm({...form, weight: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Goals: Today'sゴール入力時にTotalゴールが連動更新！ */}
                        <div style={{ background: 'rgba(0,0,0,0.25)', padding: 10, borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ffca28', marginBottom: 6 }}>
                                ⚽ ゴール数 & カード (連動更新)
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Today'sゴール</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        min="0"
                                        placeholder="0" 
                                        value={form.todayGoals ?? '0'} 
                                        onChange={e => handleTodayGoalsChange(e.target.value)} 
                                        style={{ fontWeight: 'bold', color: '#ffca28' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>今大会通算(Total)</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        min="0"
                                        placeholder="0" 
                                        value={form.totalGoals ?? '0'} 
                                        onChange={e => handleTotalGoalsChange(e.target.value)} 
                                        style={{ fontWeight: 'bold', color: '#4caf50' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '0.75rem' }}>累積イエロー</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        min="0"
                                        placeholder="0" 
                                        value={form.yellowCards ?? '0'} 
                                        onChange={e => setForm({...form, yellowCards: e.target.value})} 
                                        style={{ color: '#ffeb3b' }}
                                    />
                                </div>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: 4 }}>
                                ※Today'sゴールを入力すると、大会通算ゴール数も自動で更新されます。
                            </div>
                        </div>

                        {/* Photo URL & Individual Toggle */}
                        {(() => {
                            const currentSchool = form.schoolName || selectedSchool || '北海';
                            return (
                                <div className="form-group" style={{ background: 'rgba(0,0,0,0.25)', padding: 10, borderRadius: 8, marginBottom: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="flex-between" style={{ marginBottom: 6 }}>
                                        <label className="form-label" style={{ margin: 0 }}>顔写真 (Photo)</label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.75rem' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={form.photoEnabled !== false} 
                                                onChange={e => setForm({...form, photoEnabled: e.target.checked})} 
                                            />
                                            <span>写真送出: {form.photoEnabled !== false ? 'ON' : 'OFF'}</span>
                                        </label>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <input
                                            ref={formPhotoRef}
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={e => { handleFormPhotoFile(e.target.files?.[0], currentSchool); e.target.value = ''; }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => formPhotoRef.current?.click()}
                                            disabled={isUploading}
                                            style={{ padding: '4px 10px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                                        >
                                            {isUploading ? 'アップロード中...' : '📁 画像を選ぶ'}
                                        </button>
                                        <input 
                                            className="form-input" 
                                            placeholder="画像を選ぶとURLが入ります（直接入力も可）" 
                                            value={form.photoUrl || ''} 
                                            onChange={e => setForm({...form, photoUrl: e.target.value})} 
                                            onBlur={e => {
                                                const val = e.target.value.trim();
                                                setForm(prev => ({ ...prev, photoUrl: toPhotoAssetUrl(val) }));
                                            }}
                                            style={{ flex: 1, fontSize: '0.8rem' }}
                                        />
                                        {form.photoUrl && (
                                            <>
                                                <img 
                                                    key={form.photoUrl}
                                                    src={encodePhotoUrl(form.photoUrl)} 
                                                    alt="preview" 
                                                    style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4, background: '#333' }} 
                                                    onError={(e: any) => { e.target.style.display = 'none'; }} 
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setForm(prev => ({ ...prev, photoUrl: '' }))}
                                                    title="写真を外す"
                                                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                >
                                                    ✕
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Pro 2 Comment - 5 Slots with Yellow Flag */}
                        <div style={{ background: 'rgba(0,0,0,0.25)', padding: 10, borderRadius: 8, marginBottom: 12, border: form.pro2IsYellow ? '1px solid rgba(255, 202, 40, 0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="flex-between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                                <label className="form-label" style={{ margin: 0, color: '#ffca28', fontWeight: 'bold' }}>
                                    💬 プロ2コメント (最大5個)
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', background: form.pro2IsYellow ? 'rgba(255, 202, 40, 0.2)' : 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 4, border: form.pro2IsYellow ? '1px solid #ffca28' : '1px solid transparent', userSelect: 'none' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={!!form.pro2IsYellow} 
                                        onChange={e => setForm({ ...form, pro2IsYellow: e.target.checked })} 
                                    />
                                    <span style={{ color: form.pro2IsYellow ? '#ffca28' : '#bbb' }}>🟨 黄色フラグ (全コメントが黄色デザインに変化)</span>
                                </label>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[0, 1, 2, 3, 4].map(idx => {
                                    const item = form.pro2List?.[idx] || { text: '', isYellow: false };
                                    const isRowYellow = form.pro2IsYellow || item.isYellow;
                                    return (
                                        <div key={idx} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                fontWeight: 'bold', 
                                                width: '24px', 
                                                textAlign: 'center', 
                                                padding: '2px', 
                                                borderRadius: 4, 
                                                background: isRowYellow ? '#ffca28' : 'rgba(255,255,255,0.1)', 
                                                color: isRowYellow ? '#000' : '#fff' 
                                            }}>
                                                #{idx + 1}
                                            </span>
                                            <input 
                                                className="form-input" 
                                                style={{ 
                                                    flex: 1, 
                                                    fontSize: '0.82rem', 
                                                    padding: '5px 8px',
                                                    color: isRowYellow ? '#ffca28' : '#fff',
                                                    fontWeight: isRowYellow ? 'bold' : 'normal',
                                                    borderColor: isRowYellow ? 'rgba(255, 202, 40, 0.5)' : undefined
                                                }}
                                                placeholder={idx === 0 ? "例: 俊足のサイドアタッカー (メイン)" : `プロ2コメント #${idx + 1}...`}
                                                value={item.text || ''} 
                                                onChange={e => handlePro2Change(idx, 'text', e.target.value)} 
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                            <button type="submit" className={`btn ${editingPlayerId ? 'btn-warning' : 'btn-primary'}`} style={{ flex: 1, padding: '10px' }}>
                                {editingPlayerId ? '💾 選手情報を更新' : '➕ 選手を登録'}
                            </button>
                            {editingPlayerId && (
                                <button type="button" className="btn btn-secondary" style={{ padding: '10px' }} onClick={handleCancelEdit}>
                                    キャンセル
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Player List Filtered by High School Name */}
                <div className="glass-panel" style={{ flex: 1 }}>
                    <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                        <h3 style={{ margin: 0 }}>登録選手一覧 ({selectedSchool})</h3>
                        
                        {/* School Selection Tabs */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {activeSchools.map(sch => {
                                const isOaLeft = sch === oaLeftTeam;
                                const isOaRight = sch === oaRightTeam;
                                return (
                                    <button 
                                        key={sch} 
                                        className={`btn ${selectedSchool === sch ? 'btn-primary' : 'btn-secondary'}`} 
                                        style={{ padding: '4px 12px', fontSize: '0.85rem', fontWeight: selectedSchool === sch ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: 6 }}
                                        onClick={() => {
                                            setSelectedSchool(sch);
                                            setForm(prev => ({ ...prev, schoolName: sch }));
                                        }}
                                    >
                                        <span>🏫 {sch}</span>
                                        {isOaLeft && <span style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: 4, background: '#198754', color: '#fff' }}>OA左</span>}
                                        {isOaRight && <span style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: 4, background: '#0dcaf0', color: '#000' }}>OA右</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>写真</th>
                                    <th>背番号</th>
                                    <th>Pos</th>
                                    <th>氏名</th>
                                    <th>学年</th>
                                    <th title="Todaysゴール / 大会通算ゴール">T.G / 通算</th>
                                    <th title="累積イエロー">Yel</th>
                                    <th>写真送出</th>
                                    <th>プロ2コメント</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.length === 0 && (
                                    <tr>
                                        <td colSpan={10} style={{ textAlign: 'center', opacity: 0.5, padding: '24px' }}>
                                            「{selectedSchool}」に登録されている選手はいません。
                                        </td>
                                    </tr>
                                )}
                                {filteredPlayers.sort((a,b) => parseInt(a.number, 10) - parseInt(b.number, 10)).map(p => (
                                    <tr key={p.id} style={{ background: editingPlayerId === p.id ? 'rgba(255, 202, 40, 0.15)' : 'transparent' }}>
                                        <td>
                                            {p.photoUrl ? (
                                                <img 
                                                    src={encodePhotoUrl(p.photoUrl)} 
                                                    alt={p.name} 
                                                    style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%', background: '#222' }} 
                                                    onError={(e: any) => { e.target.style.opacity = '0.3'; }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '1.2rem', opacity: 0.3 }}>👤</span>
                                            )}
                                        </td>
                                        <td style={{ fontWeight: 'bold', fontSize: '1rem' }}>#{p.number}</td>
                                        <td><span className="status-badge" style={{ padding: '2px 6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)' }}>{p.position}</span></td>
                                        <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                                        <td>{p.grade || '-'}</td>
                                        <td>
                                            <span style={{ color: '#ffca28', fontWeight: 'bold' }}>{p.todayGoals || '0'}</span>
                                            {' / '}
                                            <span style={{ color: '#4caf50' }}>{p.totalGoals || '0'}</span>
                                        </td>
                                        <td>{p.yellowCards || '0'}</td>
                                        <td>
                                            <button 
                                                className={`btn ${p.photoEnabled !== false ? 'btn-success' : 'btn-secondary'}`}
                                                style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                                                onClick={() => togglePlayerPhoto(p.id)}
                                                title="個別の顔写真送出ON/OFF"
                                            >
                                                {p.photoEnabled !== false ? 'ON' : 'OFF'}
                                            </button>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                                            {(() => {
                                                const list = (p.pro2List && p.pro2List.length > 0)
                                                    ? p.pro2List
                                                    : (p.pro2Comment ? [{ text: p.pro2Comment, isYellow: false }] : []);
                                                if (list.length === 0) return <span style={{ color: '#666' }}>-</span>;
                                                const isAllYellow = !!p.pro2IsYellow;
                                                return (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                        {isAllYellow && (
                                                            <span style={{ fontSize: '0.65rem', background: '#ffca28', color: '#000', padding: '1px 4px', borderRadius: 3, fontWeight: 'bold', width: 'fit-content' }}>
                                                                🟨 全て黄色フラグ
                                                            </span>
                                                        )}
                                                        {list.slice(0, 2).map((item, idx) => (
                                                            <div key={idx} style={{ 
                                                                overflow: 'hidden', 
                                                                textOverflow: 'ellipsis', 
                                                                whiteSpace: 'nowrap',
                                                                color: (isAllYellow || item.isYellow) ? '#ffca28' : '#ddd'
                                                            }}>
                                                                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>#{idx + 1}: </span>
                                                                {(isAllYellow || item.isYellow) && <span style={{ marginRight: 2 }}>🟨</span>}
                                                                {item.text}
                                                            </div>
                                                        ))}
                                                        {list.length > 2 && (
                                                            <span style={{ fontSize: '0.65rem', color: '#888' }}>他 {list.length - 2} 件...</span>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button 
                                                    className="btn btn-warning" 
                                                    style={{ padding: '3px 8px', fontSize: '0.75rem' }} 
                                                    onClick={() => handleStartEdit(p)}
                                                >
                                                    編集
                                                </button>
                                                <button 
                                                    className="btn btn-danger" 
                                                    style={{ padding: '3px 8px', fontSize: '0.75rem' }} 
                                                    onClick={() => handleDelete(p.id)}
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
