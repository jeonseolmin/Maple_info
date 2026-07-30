import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../layout/calculator/CalculatorExpectation.css';

const ExpCalculator = () => {
    const [expTable, setExpTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentLevel: '260',
        currentExpPercent: '',
        measuredTime: '6', // 기본 6분 측정
        gainedExp: ''      // 측정한 시간 동안 얻은 경험치
    });
    const [resultData, setResultData] = useState(null);

    // 1. 컴포넌트가 켜질 때 백엔드에서 경험치 표를 싹 가져옵니다.
    useEffect(() => {
        const fetchExpTable = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/exp/table');
                setExpTable(response.data);
            } catch (error) {
                console.error("경험치 표를 불러오는데 실패했습니다:", error);
            }
        };
        fetchExpTable();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // 숫자와 소수점만 입력 가능하도록 처리 (경험치 % 입력용)
        if (name === 'currentExpPercent' || name === 'gainedExp') {
            const validValue = value.replace(/[^0-9.]/g, '');
            setFormData(prev => ({ ...prev, [name]: validValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCalculate = () => {
        if (expTable.length === 0) {
            alert("서버에서 경험치 데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        const level = parseInt(formData.currentLevel, 10);
        const percent = parseFloat(formData.currentExpPercent) || 0;
        const time = parseInt(formData.measuredTime, 10);
        const gainedExp = parseFloat(formData.gainedExp) || 0;

        if (gainedExp <= 0) {
            alert("획득한 경험치를 입력해주세요!");
            return;
        }

        // 해당 레벨의 DB 데이터 찾기
        const levelData = expTable.find(d => d.level === level);
        if (!levelData) {
            alert("해당 레벨의 경험치 데이터가 존재하지 않습니다.");
            return;
        }

        // 1. 다음 레벨업까지 필요한 총 경험치량
        const totalRequiredExp = levelData.requiredExp;

        // 2. 현재 보유한 경험치량 (총 경험치 * 퍼센트)
        const currentExpRaw = totalRequiredExp * (percent / 100);

        // 3. 앞으로 채워야 할 남은 경험치량
        const remainingExp = totalRequiredExp - currentExpRaw;

        // 4. 1시간(60분) 기준 획득 예상 경험치
        const hourlyExp = gainedExp * (60 / time);

        // 5. 남은 시간 계산 (시간 단위)
        const hoursLeft = remainingExp / hourlyExp;
        
        const h = Math.floor(hoursLeft);
        const m = Math.floor((hoursLeft - h) * 60);

        setResultData({
            hourlyExp: Math.floor(hourlyExp),
            hoursLeft: h,
            minutesLeft: m,
            isMaxLevel: level >= 300 // 만렙 처리
        });
    };

    // 260~299 레벨 옵션 자동 생성
    const levelOptions = Array.from({ length: 40 }, (_, i) => 260 + i);

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">사냥 효율 & 레벨업 계산기 ⏱️</h2>
            <p className="page-subtitle">전투 분석 결과를 바탕으로 레벨업까지 남은 시간을 정확하게 예측합니다.</p>

            <div className="toss-card">
                <h3 className="card-title">현재 캐릭터 상태</h3>
                <div className="input-grid">
                    <div className="input-group">
                        <label>현재 레벨</label>
                        <select name="currentLevel" value={formData.currentLevel} onChange={handleChange}>
                            {levelOptions.map(lv => (
                                <option key={lv} value={lv}>{lv} 레벨</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>현재 경험치 (%)</label>
                        <input 
                            type="text" 
                            name="currentExpPercent" 
                            value={formData.currentExpPercent} 
                            onChange={handleChange}
                            placeholder="예: 45.23"
                        />
                    </div>
                </div>
            </div>

            <div className="toss-card">
                <h3 className="card-title">전투 분석(사냥) 결과 입력</h3>
                <div className="input-grid">
                    <div className="input-group">
                        <label>측정 시간 (분)</label>
                        <select name="measuredTime" value={formData.measuredTime} onChange={handleChange}>
                            <option value="6">6분 (추천)</option>
                            <option value="15">15분</option>
                            <option value="30">30분</option>
                            <option value="60">60분 (1시간)</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>획득한 경험치</label>
                        <input 
                            type="text" 
                            name="gainedExp" 
                            value={Number(formData.gainedExp).toLocaleString()} 
                            onChange={handleChange}
                            placeholder="숫자만 입력하세요"
                        />
                        <small style={{ color: '#8b95a1', marginTop: '5px', display: 'block' }}>
                            💡 인게임 전투분석 창에 찍힌 총 경험치를 입력하세요.
                        </small>
                    </div>
                </div>
            </div>

            <button 
                className="primary-calc-btn" 
                onClick={handleCalculate} 
                disabled={isLoading}
            >
                레벨업 시간 계산하기
            </button>

            {resultData && (
                <div className="toss-card result-card" style={{ marginTop: '20px', backgroundColor: '#f2f4f6' }}>
                    <h3 className="card-title" style={{ color: '#3182f6' }}>분석 완료! 🎯</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                            <span>1시간(재획) 예상 경험치</span>
                            <strong>{resultData.hourlyExp.toLocaleString()}</strong>
                        </div>
                        
                        <hr style={{ borderTop: '1px solid #d1d6db', margin: '5px 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>다음 레벨업까지 남은 시간</span>
                            {resultData.isMaxLevel ? (
                                <span style={{ color: '#e15241' }}>만렙입니다!</span>
                            ) : (
                                <span style={{ color: '#e15241' }}>약 {resultData.hoursLeft}시간 {resultData.minutesLeft}분</span>
                            )}
                        </div>
                        <small style={{ textAlign: 'right', color: '#8b95a1' }}>
                            (현재 사냥 속도를 꾸준히 유지했을 경우)
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpCalculator;