import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../../api/axiosInstance'; 
import '../layout/calculator/CalculatorExpectation.css';

const BossScheduler = () => {
    const [bosses, setBosses] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [clearLogs, setClearLogs] = useState({}); 
    
    const [newCharName, setNewCharName] = useState('');
    const [newCharJob, setNewCharJob] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('http://localhost:8080/api/boss/data');
            const sortedBosses = response.data.bosses.sort((a, b) => b.crystalPrice - a.crystalPrice);
            
            setBosses(sortedBosses);
            setCharacters(response.data.characters);
            setClearLogs(response.data.clearLogs || {});
        } catch (error) {
            console.error("보스 데이터를 불러오는데 실패했습니다:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalWeeklyProfit = useMemo(() => {
        let total = 0;
        Object.keys(clearLogs).forEach(charId => {
            Object.entries(clearLogs[charId]).forEach(([bossIdStr, partySize]) => {
                const bossInfo = bosses.find(b => b.id === parseInt(bossIdStr));
                if (bossInfo) {
                    total += Math.floor(bossInfo.crystalPrice / partySize); // 파티 분배
                }
            });
        });
        return total;
    }, [clearLogs, bosses]);

    const handleAddCharacter = async () => {
        if (!newCharName.trim() || !newCharJob.trim()) {
            alert("캐릭터 이름과 직업을 모두 입력해주세요.");
            return;
        }
        try {
            await axiosInstance.post('http://localhost:8080/api/boss/character', {
                characterName: newCharName,
                job: newCharJob
            });
            setNewCharName('');
            setNewCharJob('');
            fetchData(); 
        } catch (error) {
            alert("캐릭터 추가에 실패했습니다.");
        }
    };

    const handleUpdateBoss = async (characterId, bossId, isCleared, partySize) => {
        // UI 즉각 반영 (Optimistic UI)
        setClearLogs(prevLogs => {
            const charLogs = { ...(prevLogs[characterId] || {}) };
            if (!isCleared) {
                delete charLogs[bossId]; // 해제 시 삭제
            } else {
                charLogs[bossId] = partySize; // 체크/변경 시 파티 인원 업데이트
            }
            return { ...prevLogs, [characterId]: charLogs };
        });

        // 서버 전송
        try {
            await axiosInstance.post('http://localhost:8080/api/boss/update', { 
                characterId, bossId, isCleared, partySize 
            });
        } catch (error) {
            console.error("상태 변경 실패:", error);
            fetchData(); // 실패 시 롤백
        }
    };

    // 캐릭터별 개별 수익 계산 (파티 분배 적용)
    const getCharacterProfit = (characterId) => {
        const charLogs = clearLogs[characterId] || {};
        let total = 0;
        Object.entries(charLogs).forEach(([bossIdStr, partySize]) => {
            const boss = bosses.find(b => b.id === parseInt(bossIdStr));
            if (boss) total += Math.floor(boss.crystalPrice / partySize);
        });
        return total;
    };

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">주간 보스 수익 스케줄러 ⚔️</h2>
            <p className="page-subtitle">다캐릭 주보돌이 수익(파티 격파 포함)을 관리하세요.</p>

            <div className="toss-card result-card" style={{ border: '2px solid var(--color-primary)' }}>
                <h3 className="card-title" style={{ marginBottom: '10px' }}>💰 이번 주 총 결정석 수익</h3>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                    {totalWeeklyProfit.toLocaleString()} <span style={{ fontSize: '1.2rem', color: 'var(--color-text)' }}>메소</span>
                </div>
            </div>

            <div className="toss-card">
                <h3 className="card-title">새 캐릭터 등록</h3>
                <div className="input-grid">
                    <div className="input-group">
                        <label>캐릭터 이름</label>
                        <input type="text" value={newCharName} onChange={(e) => setNewCharName(e.target.value)} placeholder="예: 타락파워전사" />
                    </div>
                    <div className="input-group">
                        <label>직업</label>
                        <input type="text" value={newCharJob} onChange={(e) => setNewCharJob(e.target.value)} placeholder="예: 히어로" />
                    </div>
                </div>
                <button className="primary-calc-btn" onClick={handleAddCharacter} style={{ marginTop: '16px' }}>캐릭터 추가하기</button>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>데이터를 불러오는 중입니다...</div>
            ) : (
                characters.map(character => (
                    <div key={character.id} className="toss-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 'bold' }}>{character.job}</span>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-text)' }}>{character.characterName}</h3>
                            </div>
                            <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                {getCharacterProfit(character.id).toLocaleString()} 메소
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '12px' }}>
                            {bosses.map(boss => {
                                const charLogs = clearLogs[character.id] || {};
                                const isCleared = charLogs.hasOwnProperty(boss.id);
                                const partySize = isCleared ? charLogs[boss.id] : 1;

                                return (
                                    <div 
                                        key={boss.id}
                                        style={{
                                            display: 'flex', flexDirection: 'column', padding: '12px', borderRadius: '12px',
                                            border: `1px solid ${isCleared ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                            backgroundColor: isCleared ? 'var(--color-primary-soft)' : 'var(--color-surface-soft)',
                                            cursor: 'pointer', transition: 'all 0.2s ease'
                                        }}
                                        // 바탕 클릭 시 토글 (1인 격파 기준)
                                        onClick={() => handleUpdateBoss(character.id, boss.id, !isCleared, isCleared ? 1 : 1)}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 'bold', color: isCleared ? 'var(--color-primary)' : 'var(--color-text)', fontSize: '14px' }}>
                                                {boss.name} <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({boss.difficulty})</span>
                                            </span>
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '4px',
                                                border: `2px solid ${isCleared ? 'var(--color-primary)' : 'var(--color-placeholder)'}`,
                                                backgroundColor: isCleared ? 'var(--color-primary)' : 'transparent',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                {isCleared && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                                {Math.floor(boss.crystalPrice / partySize).toLocaleString()} 메소
                                            </div>
                                            
                                            {/* 보스를 체크했을 때만 나타나는 파티 인원 선택 창 */}
                                            {isCleared && (
                                                <select 
                                                    value={partySize}
                                                    onChange={(e) => handleUpdateBoss(character.id, boss.id, true, parseInt(e.target.value))}
                                                    onClick={(e) => e.stopPropagation()} // 클릭 시 보스 토글 방지
                                                    style={{ 
                                                        width: '55px', padding: '2px 4px', fontSize: '11px', 
                                                        backgroundColor: 'var(--color-surface)', borderRadius: '4px', border: '1px solid var(--color-border)' 
                                                    }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                                        <option key={num} value={num}>{num}인</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default BossScheduler;