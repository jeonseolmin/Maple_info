import { useState, useEffect, useMemo } from 'react';
import '../layout/calculator/CalculatorExpectation.css';

// --- 우측: 개별 불꽃 결과 카드 컴포넌트 ---
const ResultCard = ({ title, probability, isCalculating }) => {
    const averageTries = probability > 0 ? (100 / probability) : 0;

    return (
        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(128, 128, 128, 0.2)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{title}</h4>
            <div style={{ fontSize: '0.95rem' }}>
                {isCalculating ? (
                    <span style={{ color: '#7c8cfa', fontWeight: 'bold' }}>계산 중...</span>
                ) : (
                    <>
                        <div style={{ marginBottom: '4px', opacity: 0.8 }}>확률: {probability.toFixed(6)}%</div>
                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>평균: {averageTries.toFixed(2)}회</div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- 메인 컴포넌트 ---
const FlameCalculator = () => {
    const [equipType, setEquipType] = useState('방어구');
    const [isBossDrop, setIsBossDrop] = useState(true);
    const [equipLevel, setEquipLevel] = useState(200);
    const [weaponTier, setWeaponTier] = useState('선택안함');
    const [targetScore, setTargetScore] = useState(131);

    const [isEffModalOpen, setIsEffModalOpen] = useState(false);
    const [eff, setEff] = useState({
        str: 1, dex: 0.1, int: '', luk: '', hp: '', 
        allStat: 10, attack: 4, magic: '', damage: ''
    });

    const [currentStats, setCurrentStats] = useState({
        str: '', dex: '', int: '', luk: '', hp: '', 
        allStat: '', attack: '', magic: '', damage: ''
    });

    const [probabilities, setProbabilities] = useState({ kang: 0, young: 0, shim: 0 });
    const [isCalculating, setIsCalculating] = useState(false);

    const handleEffChange = (e) => setEff({ ...eff, [e.target.name]: e.target.value });
    const handleStatChange = (e) => setCurrentStats({ ...currentStats, [e.target.name]: e.target.value });

    // 실시간 내 템 환산 점수 계산
    const currentScore = useMemo(() => {
        let total = 0;
        Object.keys(currentStats).forEach(key => {
            const val = Number(currentStats[key]) || 0;
            const multiplier = Number(eff[key]) || 0;
            total += (val * multiplier);
        });
        return total.toFixed(1);
    }, [currentStats, eff]);

    // 확률 시뮬레이션 로직
    useEffect(() => {
        if (!targetScore || equipLevel < 100) {
            setProbabilities({ kang: 0, young: 0, shim: 0 });
            return;
        }

        setIsCalculating(true);

        const timer = setTimeout(() => {
            const single = Math.floor(equipLevel / 20) + 1;
            const double = Math.floor(equipLevel / 40) + 1;
            
            const M = [
                single * (Number(eff.str) || 0),
                single * (Number(eff.dex) || 0),
                single * (Number(eff.int) || 0),
                single * (Number(eff.luk) || 0),
                double * (Number(eff.str) || 0) + double * (Number(eff.dex) || 0),
                double * (Number(eff.str) || 0) + double * (Number(eff.int) || 0),
                double * (Number(eff.str) || 0) + double * (Number(eff.luk) || 0),
                double * (Number(eff.dex) || 0) + double * (Number(eff.int) || 0),
                double * (Number(eff.dex) || 0) + double * (Number(eff.luk) || 0),
                double * (Number(eff.int) || 0) + double * (Number(eff.luk) || 0),
                0, 0, 0, 0, 
                1 * (Number(eff.attack) || 0),
                1 * (Number(eff.magic) || 0),
                0, 0,
                1 * (Number(eff.allStat) || 0)
            ];

            const kangRates = [0.20, 0.30, 0.36, 0.14, 0];
            const youngRates = [0, 0.29, 0.45, 0.25, 0.01];
            const shimRates = [0, 0.10, 0.40, 0.40, 0.10]; 
            const tiers = [3, 4, 5, 6, 7];

            const tierCombos = [];
            for (let t1 = 0; t1 < 5; t1++) {
                for (let t2 = 0; t2 < 5; t2++) {
                    for (let t3 = 0; t3 < 5; t3++) {
                        for (let t4 = 0; t4 < 5; t4++) {
                            tierCombos.push({
                                t1: tiers[t1], t2: tiers[t2], t3: tiers[t3], t4: tiers[t4],
                                kangProb: kangRates[t1] * kangRates[t2] * kangRates[t3] * kangRates[t4],
                                youngProb: youngRates[t1] * youngRates[t2] * youngRates[t3] * youngRates[t4],
                                shimProb: shimRates[t1] * shimRates[t2] * shimRates[t3] * shimRates[t4],
                            });
                        }
                    }
                }
            }

            let kangSuccess = 0, youngSuccess = 0, shimSuccess = 0;

            for (let i = 0; i < 16; i++) {
                for (let j = i + 1; j < 17; j++) {
                    for (let k = j + 1; k < 18; k++) {
                        for (let l = k + 1; l < 19; l++) {
                            for (let c = 0; c < 625; c++) {
                                const combo = tierCombos[c];
                                const score = M[i]*combo.t1 + M[j]*combo.t2 + M[k]*combo.t3 + M[l]*combo.t4;
                                
                                if (score >= targetScore) {
                                    kangSuccess += combo.kangProb;
                                    youngSuccess += combo.youngProb;
                                    shimSuccess += combo.shimProb;
                                }
                            }
                        }
                    }
                }
            }

            setProbabilities({
                kang: (kangSuccess / 3876) * 100,
                young: (youngSuccess / 3876) * 100,
                shim: (shimSuccess / 3876) * 100
            });
            setIsCalculating(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [equipLevel, targetScore, eff]);

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* 좌측 영역 */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div className="toss-card">
                    <h2 style={{ color: '#7c8cfa', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>설정</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label>장비 종류</label>
                            <select value={equipType} onChange={(e) => setEquipType(e.target.value)}>
                                <option>방어구</option>
                                <option>무기</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '15px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', color: '#7c8cfa', fontWeight: 'bold', cursor: 'pointer' }}>
                                <input type="checkbox" checked={isBossDrop} onChange={(e) => setIsBossDrop(e.target.checked)} style={{ marginRight: '8px', accentColor: '#7c8cfa', width: '18px', height: '18px' }} />
                                보스 드랍
                            </label>
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label>장비 레벨</label>
                            <input type="number" value={equipLevel} onChange={(e) => setEquipLevel(Number(e.target.value))} />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                            <label style={{ opacity: 0.5 }}>무기 추옵 등급</label>
                            <select disabled style={{ opacity: 0.5 }}>
                                <option>선택안함</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label>목표 추가옵션 값</label>
                        <input type="number" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} placeholder="예: 131" />
                    </div>
                    <button 
                        onClick={() => setIsEffModalOpen(true)} 
                        style={{ width: '100%', padding: '15px', backgroundColor: '#7c8cfa', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                    >
                        스탯 효율 세팅
                    </button>
                </div>

                <div className="toss-card">
                    <h2 style={{ color: '#7c8cfa', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 20px 0' }}>스탯 환산치 계산</h2>
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <span style={{ fontSize: '3rem', color: '#7c8cfa', fontWeight: 'bold' }}>{currentScore}</span>
                        <span style={{ fontSize: '1.2rem', marginLeft: '5px', opacity: 0.8 }}>급</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        {['str', 'dex', 'int', 'luk', 'hp', 'allStat', 'attack', 'magic', 'damage'].map((key) => {
                            const labelMap = { str: 'STR', dex: 'DEX', int: 'INT', luk: 'LUK', hp: 'HP', allStat: '올스탯 %', attack: '공격력', magic: '마력', damage: '데미지 %' };
                            const isActive = Number(currentStats[key]) > 0;
                            return (
                                <div className="input-group" key={key} style={{ marginBottom: 0 }}>
                                    <label style={{ color: isActive ? '#7c8cfa' : 'inherit' }}>{labelMap[key]}</label>
                                    <input 
                                        name={key} type="number" value={currentStats[key]} onChange={handleStatChange} 
                                        style={isActive ? { border: '1px solid #7c8cfa' } : {}}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 우측 영역 */}
            <div className="toss-card" style={{ flex: '1 1 400px', alignSelf: 'flex-start' }}>
                <h2 style={{ color: '#7c8cfa', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 25px 0' }}>계산 결과</h2>
                <ResultCard title="강력한 환생의 불꽃" probability={probabilities.kang} isCalculating={isCalculating} />
                <ResultCard title="영원한 환생의 불꽃" probability={probabilities.young} isCalculating={isCalculating} />
                <ResultCard title="심연의 환생의 불꽃" probability={probabilities.shim} isCalculating={isCalculating} />
            </div>

            {/* 스탯 효율 모달 */}
            {isEffModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="toss-card" style={{ width: '420px', position: 'relative' }}>
                        <button onClick={() => setIsEffModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.6 }}>✕</button>
                        <h3 style={{ margin: '0 0 25px 0', textAlign: 'center', fontSize: '1.3rem' }}>스탯 효율 입력</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            {['str', 'dex', 'int', 'luk', 'hp', 'allStat', 'attack', 'magic', 'damage'].map((key) => {
                                const labelMap = { str: 'STR', dex: 'DEX', int: 'INT', luk: 'LUK', hp: 'HP', allStat: '올스탯 %', attack: '공격력', magic: '마력', damage: '데미지 %' };
                                const isActive = Number(eff[key]) > 0;
                                return (
                                    <div className="input-group" key={`eff-${key}`} style={{ marginBottom: 0, ...(key === 'damage' ? { gridColumn: '1 / -1' } : {}) }}>
                                        <label style={{ color: isActive ? '#7c8cfa' : 'inherit' }}>{labelMap[key]}</label>
                                        <input 
                                            name={key} type="number" value={eff[key]} onChange={handleEffChange} 
                                            style={isActive ? { border: '1px solid #7c8cfa' } : {}}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlameCalculator;