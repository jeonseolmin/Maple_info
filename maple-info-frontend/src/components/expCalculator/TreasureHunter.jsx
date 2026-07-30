import React, { useState } from 'react';
import '../layout/calculator/CalculatorExpectation.css';

const TREASURE_MULTIPLIERS = {
    GOLD: { '레어': 3000, '에픽': 6000, '유니크': 12000, '레전드리': 24000 },
    DIAMOND: { '레어': 30000, '에픽': 60000, '유니크': 120000, '레전드리': 240000 }
};

const TreasureHunter = () => {
    const [formData, setFormData] = useState({
        boxType: 'GOLD',
        tier: '레어',
        monsterExp: ''
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'monsterExp') {
            setFormData(prev => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCalculate = () => {
        if (!formData.monsterExp) {
            alert("몬스터 1마리당 경험치를 입력해주세요!");
            return;
        }
        
        const multiplier = TREASURE_MULTIPLIERS[formData.boxType][formData.tier];
        const totalExp = Number(formData.monsterExp) * multiplier;
        
        setResult({ totalExp, multiplier });
    };

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">트레저 헌터 보상 계산기 🗝️</h2>
            
            <div className="toss-card">
                <div className="input-grid">
                    <div className="input-group">
                        <label>포탈 종류</label>
                        <select name="boxType" value={formData.boxType} onChange={handleChange}>
                            <option value="GOLD">폴로/프리토 (골드 박스)</option>
                            <option value="DIAMOND">에스페시아 (다이아 박스)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>달성 등급 (점수)</label>
                        <select name="tier" value={formData.tier} onChange={handleChange}>
                            <option value="레어">레어 (3,000/30,000 마리)</option>
                            <option value="에픽">에픽 (6,000/60,000 마리)</option>
                            <option value="유니크">유니크 (12,000/120,000 마리)</option>
                            <option value="레전드리">레전드리 (24,000/240,000 마리)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>해당 지역 몬스터 1마리 경험치</label>
                        <input 
                            type="text" 
                            name="monsterExp" 
                            value={Number(formData.monsterExp).toLocaleString() || ''} 
                            onChange={handleChange}
                            placeholder="예: 500000"
                        />
                    </div>
                </div>
            </div>

            <button className="primary-calc-btn" onClick={handleCalculate}>계산하기</button>

            {result && (
                <div className="toss-card result-card" style={{ marginTop: '20px' }}>
                    <h3 className="card-title">보상 결과 🎉</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        <span>총 획득 경험치</span>
                        <span style={{ color: '#e15241' }}>{result.totalExp.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreasureHunter;