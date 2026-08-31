import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './ExpPointCalculator.css';

const ExpPointCalculator = () => {
    const [expTable, setExpTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        level: '260',
        currentExp: '',
        expPoints: ''
    });
    const [result, setResult] = useState(null);

    // 1. 서버에서 경험치 표 (requiredExp, expPointValue 포함) 불러오기
    useEffect(() => {
        const fetchExpTable = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('http://localhost:8080/api/exp/table');
                setExpTable(response.data);
            } catch (error) {
                console.error("경험치 표를 불러오는데 실패했습니다:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExpTable();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'currentExp') {
            const validValue = value.replace(/[^0-9.]/g, ''); // 경험치는 소수점 허용
            setFormData(prev => ({ ...prev, [name]: validValue }));
        } else if (name === 'expPoints') {
            const validValue = value.replace(/[^0-9]/g, ''); // 포인트는 정수만 허용
            setFormData(prev => ({ ...prev, [name]: validValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCalculate = () => {
        if (expTable.length === 0) {
            alert("서버에서 경험치 데이터를 불러오는 중입니다.");
            return;
        }

        let currentLevel = parseInt(formData.level, 10);
        let currentPercent = parseFloat(formData.currentExp) || 0;
        let remainingPoints = parseInt(formData.expPoints, 10) || 0;

        if (remainingPoints <= 0) {
            alert("사용할 EXP 포인트를 입력해주세요!");
            return;
        }

        const startLevel = currentLevel;
        const startPercent = currentPercent;

        let levelData = expTable.find(d => d.level === currentLevel);
        if (!levelData) {
            alert("해당 레벨의 데이터가 없습니다.");
            return;
        }

        let currentExpRaw = levelData.requiredExp * (currentPercent / 100);

        while (remainingPoints > 0 && currentLevel < 300) {
            levelData = expTable.find(d => d.level === currentLevel);
            
            if (!levelData || !levelData.expPointValue) {
                break;
            }

            let expNeeded = levelData.requiredExp - currentExpRaw;
            
            let pointsNeededForLevelUp = expNeeded / levelData.expPointValue;

            if (remainingPoints >= pointsNeededForLevelUp) {
                remainingPoints -= pointsNeededForLevelUp;
                currentLevel++;
                currentExpRaw = 0; // 레벨업 했으므로 경험치는 0으로 초기화
            } else {
                currentExpRaw += remainingPoints * levelData.expPointValue;
                remainingPoints = 0;
            }
        }

        levelData = expTable.find(d => d.level === currentLevel) || levelData;
        let finalPercent = (currentExpRaw / levelData.requiredExp) * 100;

        setResult({
            startLevel,
            startPercent,
            finalLevel: currentLevel,
            finalPercent: finalPercent.toFixed(3) // 소수점 3자리
        });
    };

    // 260~299 레벨 옵션 생성 (DB에 있는 구간)
    const levelOptions = Array.from({ length: 40 }, (_, i) => 260 + i);

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">EXP 포인트 계산기</h2>
            <p className="page-subtitle">이벤트로 얻은 EXP 교환권을 사용했을 때의 최종 레벨을 확인하세요.</p>

            <div className="toss-card">
                <div className="input-grid">
                    <div className="input-group">
                        <label>현재 레벨</label>
                        <select name="level" value={formData.level} onChange={handleChange}>
                            {levelOptions.map(lv => (
                                <option key={lv} value={lv}>{lv} 레벨</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>현재 경험치 (%)</label>
                        <input 
                            type="text" 
                            name="currentExp" 
                            value={formData.currentExp} 
                            onChange={handleChange}
                            placeholder="예: 45.23"
                        />
                    </div>
                    <div className="input-group">
                        <label>사용할 EXP 포인트</label>
                        <input 
                            type="text" 
                            name="expPoints" 
                            value={Number(formData.expPoints).toLocaleString() || ''} 
                            onChange={handleChange}
                            placeholder="예: 3000"
                        />
                        <small>
                            사용할 상급 EXP 쿠폰의 갯수를 입력하세요.
                        </small>
                    </div>
                </div>
            </div>

            <button 
                className="primary-calc-btn" 
                onClick={handleCalculate}
                disabled={isLoading}
            >
                {isLoading ? "경험치 데이터 불러오는 중..." : "결과 확인하기"}
            </button>

            {result && (
                <div className="toss-card result-card">
                    <h3 className="card-title">도달 레벨 예측 결과 🎯</h3>
                    
                    <div className="result-content">
                        <div className="result-row">
                            <span>기존 레벨 / 경험치</span>
                            <span>Lv.{result.startLevel} ({result.startPercent}%)</span>
                        </div>
                        
                        <hr className="result-divider" />
                        
                        <div className="result-total">
                            <span>최종 예상 레벨</span>
                            <span className="result-highlight">
                                Lv.{result.finalLevel} ({result.finalPercent}%)
                            </span>
                        </div>
                        
                        {result.finalLevel > result.startLevel && (
                            <div className="result-levelup">
                                🆙 {result.finalLevel - result.startLevel} 레벨 업!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpPointCalculator;