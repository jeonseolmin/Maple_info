import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './SymbolCalculator.css';
import '../layout/calculator/CalculatorExpectation.css';

const SymbolCalculator = () => {
    const [type, setType] = useState('ARC');
    const [currentLevel, setCurrentLevel] = useState('');
    const [currentCount, setCurrentCount] = useState('');
    const [dailyYield, setDailyYield] = useState('20'); // 일일 획득량 기본값
    
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCalculate = async () => {
        if (!currentLevel || !currentCount || !dailyYield) {
            alert("모든 항목을 입력해주세요!");
            return;
        }

        setIsLoading(true);
        try {
            // 백엔드 API 통신
            const response = await axiosInstance.post('http://localhost:8080/api/symbol/calculate', {
                type: type,
                currentLevel: parseInt(currentLevel),
                currentCount: parseInt(currentCount),
                dailyYield: parseInt(dailyYield)
            });
            setResult(response.data);
        } catch (error) {
            console.error("심볼 계산 실패:", error);
            alert("계산 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="symbol-calc-container">
            <h2 className="page-title">심볼 졸업 계산기 </h2>
            <p className="page-subtitle">귀찮은 일퀘, 앞으로 며칠 남았는지 확인해 보세요.</p>

            <div className="symbol-toggle-group">
                <button 
                    className={`symbol-toggle-btn ${type === 'ARC' ? 'active arc' : ''}`}
                    onClick={() => { setType('ARC'); setResult(null); }}
                >
                    아케인 심볼 (ARC)
                </button>
                <button 
                    className={`symbol-toggle-btn ${type === 'AUT' ? 'active aut' : ''}`}
                    onClick={() => { setType('AUT'); setResult(null); }}
                >
                    어센틱 심볼 (AUT)
                </button>
            </div>

            <div className="toss-card">
                <div className="input-grid">
                    <div className="input-group">
                        <label>현재 레벨</label>
                        <input 
                            type="number" 
                            min="1" 
                            max={type === 'ARC' ? "20" : "11"} 
                            value={currentLevel} 
                            onChange={(e) => setCurrentLevel(e.target.value)} 
                            placeholder="예: 15" 
                        />
                    </div>
                    <div className="input-group">
                        <label>현재 보유 개수</label>
                        <input 
                            type="number" 
                            min="0" 
                            value={currentCount} 
                            onChange={(e) => setCurrentCount(e.target.value)} 
                            placeholder="예: 120" 
                        />
                    </div>
                    <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>하루 획득량 (일퀘 + 미니게임)</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={dailyYield} 
                            onChange={(e) => setDailyYield(e.target.value)} 
                        />
                    </div>
                </div>
                
                <button 
                    className="primary-calc-btn" 
                    onClick={handleCalculate} 
                    style={{ marginTop: '20px' }}
                    disabled={isLoading}
                >
                    {isLoading ? "계산 중..." : "졸업 일수 계산하기"}
                </button>
            </div>

            {result && (
                <div className="result-card">
                    <h3 style={{ color: 'var(--color-text)', marginBottom: '0' }}>졸업까지 남은 시간</h3>
                    <div className="d-day-text">
                        {result.remainingDays > 0 ? `D-${result.remainingDays}` : '🎉 졸업 완료!'}
                    </div>
                    
                    <div className="progress-container">
                        <div className="progress-rate-text">{result.progressRate}%</div>
                        <div className="progress-track">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${result.progressRate}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="result-detail-text">
                        앞으로 <strong style={{ color: 'var(--color-text)' }}>{result.remainingSymbols.toLocaleString()}개</strong>의 심볼을 더 모아야 합니다. <br/>
                        (누적: {result.accumulated.toLocaleString()} / 총 요구량: {result.totalRequired.toLocaleString()})
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymbolCalculator;