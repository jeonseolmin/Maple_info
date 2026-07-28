// src/components/starforceCalculator/StarforceExpectation.jsx
import React, { useState } from 'react';
import CalculatorLayout from '../layout/calculator/CalculatorLayout';

const StarforceExpectation = () => {
    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        // TODO: 백엔드 API 호출 로직 (기댓값 계산)
        setResult("약 15억 3천만 메소");
    };

    return (
        <CalculatorLayout title="스타포스 기댓값 계산기" icon="⭐">
            <div className="input-group">
                <label>장비 레벨</label>
                <input type="number" className="input-control" defaultValue={150} />
            </div>

            <div className="input-group">
                <label>현재 스타포스</label>
                <select className="input-control">
                    <option>15성</option>
                    <option>17성</option>
                </select>
            </div>

            <div className="input-group">
                <label>목표 스타포스</label>
                <select className="input-control">
                    <option>17성</option>
                    <option>22성</option>
                </select>
            </div>

            <button className="action-btn" onClick={handleCalculate}>평균 소모 메소 계산하기</button>

            {result && (
                <div className="result-panel">
                    목표 스타포스 도달까지 필요한 평균 기댓값
                    <span className="result-highlight">{result}</span>
                </div>
            )}
        </CalculatorLayout>
    );
};

export default StarforceExpectation;