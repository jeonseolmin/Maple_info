import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../layout/calculator/CalculatorLayout';

const CUBE_TYPES = [
    { id: 'RED', name: '레드 큐브' },
    { id: 'BLACK', name: '블랙 큐브' },
    { id: 'ADDITIONAL', name: '에디셔널 큐브' },
    { id: 'STRANGE', name: '수상한 큐브' },
    { id: 'ARTISAN', name: '장인의 큐브' },
    { id: 'SILVER', name: '명장의 큐브' }
];

// 💡 레벨을 떼어내고 누락된 전체 장비 부위를 추가했습니다.
const ITEM_PARTS = [
    "무기", "엠블렘", "보조무기", "모자", "상의", "하의", "전신옷", 
    "장갑", "신발", "어깨장식", "얼굴장식", "눈장식", "귀고리", 
    "반지", "펜던트", "벨트", "망토", "기계심장"
];

const TIERS = ["레어", "에픽", "유니크", "레전드리"];
const STRANGE_TIERS = ["레어", "에픽"]; 

const CubeExpectation = () => {
    const [formData, setFormData] = useState({
        cubeType: 'RED',
        itemPart: '무기',
        level: 150, // 💡 직접 입력받을 장비 레벨 (기본값 150)
        tier: '레전드리',
        targetOption1: '',
        targetOption2: '',
        targetOption3: ''
    });

    const [availableTiers, setAvailableTiers] = useState(TIERS);
    const [dbOptions, setDbOptions] = useState([]); 
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'level' ? Number(value) : value 
        }));
    };

    // [등급 제어] 수상한 큐브 에픽 제한
    useEffect(() => {
        if (formData.cubeType.includes('STRANGE')) {
            setAvailableTiers(STRANGE_TIERS);
            if (formData.tier === '유니크' || formData.tier === '레전드리') {
                setFormData(prev => ({ ...prev, tier: '에픽' }));
            }
        } else {
            setAvailableTiers(TIERS);
        }
    }, [formData.cubeType, formData.tier]);

    // 💡 [핵심] 레벨, 등급, 큐브 종류에 맞춰 정확한 퍼센트를 산출해 내는 모의 로직
    useEffect(() => {
        const isAddi = formData.cubeType === 'ADDITIONAL';
        const level = formData.level;
        const tier = formData.tier;
        let options = [];

        // 1. 레벨과 등급에 따른 '주요 스탯 퍼센트' 계산 로직 (71레벨 이상 기준 예시)
        const getStatPercent = (type) => {
            let val = 0;
            if (isAddi) {
                if (tier === '레전드리') val = level >= 71 ? 7 : 5;
                else if (tier === '유니크') val = level >= 71 ? 5 : 4;
                else if (tier === '에픽') val = level >= 71 ? 4 : 3;
                else val = 2; // 레어
            } else {
                if (tier === '레전드리') val = level >= 71 ? 12 : 9;
                else if (tier === '유니크') val = level >= 71 ? 9 : 6;
                else if (tier === '에픽') val = level >= 71 ? 6 : 3;
                else val = 3; // 레어
            }
            return `${type} : +${val}%`;
        };

        const getBossDmg = () => {
            if (tier !== '레전드리' && tier !== '유니크') return null; // 보공은 유니크 이상
            if (isAddi) return tier === '레전드리' ? "보스 몬스터 공격 시 데미지 : +18%" : "보스 몬스터 공격 시 데미지 : +12%";
            return tier === '레전드리' ? "보스 몬스터 공격 시 데미지 : +40%" : "보스 몬스터 공격 시 데미지 : +30%";
        };

        // 2. 부위별 옵션 배열 생성
        if (formData.itemPart === '무기' || formData.itemPart === '엠블렘' || formData.itemPart === '보조무기') {
            options.push(getStatPercent("공격력"));
            options.push(getStatPercent("마력"));
            options.push(getStatPercent("데미지"));
            
            const bossOpt = getBossDmg();
            if (bossOpt) options.push(bossOpt);
            
            if (!isAddi && tier === '레전드리') options.push("몬스터 방어율 무시 : +40%");
            if (!isAddi && tier === '유니크') options.push("몬스터 방어율 무시 : +30%");
        } else {
            // 방어구 & 장신구 공통
            options.push(getStatPercent("STR"));
            options.push(getStatPercent("DEX"));
            options.push(getStatPercent("INT"));
            options.push(getStatPercent("LUK"));
            options.push(getStatPercent("올스탯"));
            options.push(getStatPercent("최대 HP"));

            // ⭐ [레전드리 전용 & 특수 부위] 장갑 크뎀 로직
            if (formData.itemPart === '장갑' && tier === '레전드리') {
                options.push(isAddi ? "크리티컬 데미지 : +3%" : "크리티컬 데미지 : +8%");
            }

            // ⭐ [레전드리 전용 & 특수 부위] 모자 쿨감 로직
            if (formData.itemPart === '모자' && tier === '레전드리') {
                options.push(isAddi ? "모든 스킬의 재사용 대기시간 : -1초" : "모든 스킬의 재사용 대기시간 : -2초");
            }
        }

        // 옵션 목록 업데이트 및 타겟 옵션 초기화
        setDbOptions(options);
        setFormData(prev => ({
            ...prev,
            targetOption1: '', targetOption2: '', targetOption3: ''
        }));

    }, [formData.cubeType, formData.itemPart, formData.tier, formData.level]); 

    const handleCalculate = () => {
        if (!formData.targetOption1 && !formData.targetOption2 && !formData.targetOption3) {
            alert("최소 한 줄 이상의 목표 옵션을 선택해주세요!");
            return;
        }
        setResult("약 230개 (2억 7천만 메소)");
    };

    return (
        <CalculatorLayout title="잠재능력 기댓값 계산기" icon="💎">
            
            <div className="input-group">
                <label>장비 레벨 🎯</label>
                <input 
                    type="number" 
                    className="input-control" 
                    name="level" 
                    value={formData.level} 
                    onChange={handleInputChange} 
                    min="10" 
                    max="250" 
                    step="10"
                />
            </div>

            <div className="input-group">
                <label>큐브 종류</label>
                <select className="input-control" name="cubeType" value={formData.cubeType} onChange={handleInputChange}>
                    {CUBE_TYPES.map(cube => (
                        <option key={cube.id} value={cube.id}>{cube.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="input-group">
                <label>장비 부위</label>
                <select className="input-control" name="itemPart" value={formData.itemPart} onChange={handleInputChange}>
                    {ITEM_PARTS.map(part => (
                        <option key={part} value={part}>{part}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label>현재 등급</label>
                <select className="input-control" name="tier" value={formData.tier} onChange={handleInputChange}>
                    {availableTiers.map(tier => (
                        <option key={tier} value={tier}>{tier}</option>
                    ))}
                </select>
            </div>

            <div className="input-group" style={{ marginTop: '10px' }}>
                <label style={{ color: '#e74c3c' }}>🎯 목표 잠재능력 (최대 3줄)</label>
                
                {[1, 2, 3].map(num => (
                    <select 
                        key={num} 
                        className="input-control" 
                        name={`targetOption${num}`} 
                        value={formData[`targetOption${num}`]} 
                        onChange={handleInputChange} 
                        style={{ marginBottom: num < 3 ? '5px' : '0' }}
                    >
                        <option value="">-- {num}번째 줄 선택 (상관없음) --</option>
                        {dbOptions.map((opt, idx) => (
                            <option key={`opt${num}-${idx}`} value={opt}>{opt}</option>
                        ))}
                    </select>
                ))}
            </div>

            <button className="action-btn" onClick={handleCalculate} style={{ marginTop: '15px' }}>기댓값 계산하기</button>

            {result && (
                <div className="result-panel">
                    목표 옵션 조합 등장까지 필요한 평균 기댓값
                    <span className="result-highlight">{result}</span>
                </div>
            )}
            
        </CalculatorLayout>
    );
};

export default CubeExpectation;