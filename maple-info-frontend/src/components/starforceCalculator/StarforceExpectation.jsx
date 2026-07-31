import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'; 
import '../layout/calculator/CalculatorExpectation.css'; 

const StarforceExpectation = () => {
    const [formData, setFormData] = useState({
        itemLevel: '150',
        currentStar: '0',
        targetStar: '22',
        spareCost: '0',
        mvp: 'NONE',
        safeguard: false,
        event: 'NONE'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [resultData, setResultData] = useState(null); 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        if (name === 'currentStar' || name === 'targetStar') {
            if (value !== '') {
                let numValue = parseInt(value, 10);
                if (numValue > 30) numValue = 30;
                else if (numValue < 0) numValue = 0;
                finalValue = numValue.toString();
            }
        }

        if (name === 'spareCost' && value !== '') {
            finalValue = value.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleCalculate = async () => {
        setIsLoading(true);
        setResultData(null);
        
        try {
            const response = await axiosInstance.post('http://localhost:8080/api/starforce/simulate', formData);
            setResultData(response.data);
        } catch (error) {
            console.error("스타포스 계산 중 오류 발생:", error);
            alert("계산 서버와 연결할 수 없습니다. 백엔드 로직을 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const totalSpareCost = resultData ? (Number(formData.spareCost) * (resultData.destroyedCount || 0)) : 0;
    const finalTotalCost = resultData ? (resultData.expectedMeso + totalSpareCost) : 0;

    // 차트에 마우스를 올렸을 때 말풍선을 예쁘게 띄워주는 컴포넌트
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #d1d6db', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#4e5968' }}>{`${label}억 메소 구간`}</p>
                    <p style={{ margin: 0, color: '#f6a831' }}>{`해당 유저 수: ${payload[0].value}명`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">스타포스 시뮬레이터 ⭐</h2>
            <p className="page-subtitle">파괴 확률과 스페어 비용을 포함한 실질적인 강화 비용을 확인하세요.</p>

            <div className="toss-card">
                <h3 className="card-title">장비 설정</h3>
                <div className="input-grid">
                    <div className="input-group">
                        <label>장비 레벨</label>
                        <input type="number" name="itemLevel" value={formData.itemLevel} onChange={handleChange} className="level-input" />
                    </div>
                    <div className="input-group">
                        <label>스페어 비용 (메소)</label>
                        <input type="text" name="spareCost" value={Number(formData.spareCost).toLocaleString()} onChange={handleChange} placeholder="빈칸이면 0메소로 계산" />
                    </div>
                    <div className="input-group">
                        <label>현재 스타포스</label>
                        <input type="number" name="currentStar" value={formData.currentStar} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label>목표 스타포스</label>
                        <input type="number" name="targetStar" value={formData.targetStar} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="toss-card">
                <h3 className="card-title">세부 설정 (이벤트 및 할인)</h3>
                <div className="input-grid">
                    <div className="input-group">
                        <label>선데이 메이플 이벤트</label>
                        <select name="event" value={formData.event} onChange={handleChange}>
                            <option value="NONE">이벤트 없음</option>
                            <option value="TEN_UNDER_ONE_PLUS_ONE">10성 이하 강화 시 1+1</option>
                            <option value="COST_THIRTY_DISCOUNT">스타포스 강화 비용 30% 할인</option>
                            <option value="DESTRUCTION_REDUCTION">21성 이하 파괴 확률 30% 감소</option>
                            <option value="SHINING">샤이닝 스타포스 (30% 할인 + 15/16 100%)</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label>MVP / PC방 할인</label>
                        <select name="mvp" value={formData.mvp} onChange={handleChange}>
                            <option value="NONE">할인 없음</option>
                            <option value="SILVER">실버 (3%)</option>
                            <option value="GOLD">골드 (5%)</option>
                            <option value="DIAMOND">다이아/레드 (10%)</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <input type="checkbox" name="safeguard" checked={formData.safeguard} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                            파괴 방지 사용 (15성~17성 구간)
                        </label>
                        <small style={{ color: '#8b95a1', marginLeft: '26px' }}>체크 시 해당 구간 강화 비용이 증가합니다.</small>
                    </div>
                </div>
            </div>

            <button className="primary-calc-btn" onClick={handleCalculate} disabled={isLoading}>
                {isLoading ? "시뮬레이션 실행 중..." : "결과 확인하기"}
            </button>

            {/* 결과 UI 및 차트 렌더링 부분 */}
            {resultData && (
                <>
                    {/* 1. 요약 결과 카드 */}
                    <div className="toss-card result-card" style={{ marginTop: '20px', backgroundColor: '#f2f4f6', border: 'none' }}>
                        <h3 className="card-title" style={{ color: '#3182f6', marginBottom: '15px' }}>시뮬레이션 평균 결과</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                                <span>강화 구간</span>
                                <strong>{resultData.section || `${formData.currentStar}성 -> ${formData.targetStar}성`}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                                <span>평균 파괴 횟수</span>
                                <strong style={{ color: '#e15241' }}>{resultData.destroyedCount ? resultData.destroyedCount.toFixed(2) : 0} 회</strong>
                            </div>
                            
                            <hr style={{ border: 'none', borderTop: '1px solid #d1d6db', margin: '10px 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                                <span>순수 강화 예상 메소</span>
                                <span>{resultData.expectedMeso.toLocaleString()} 메소</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                                <span>스페어 비용 합계</span>
                                <span>+ {totalSpareCost.toLocaleString()} 메소</span>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #d1d6db', margin: '10px 0' }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>최종 예상 소모 비용</span>
                                <span style={{ color: '#3182f6' }}>{finalTotalCost.toLocaleString()} 메소</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. 분포도 차트 영역 */}
                    {resultData.chartData && resultData.chartData.length > 0 ? (
                        <div className="toss-card" style={{ marginTop: '20px' }}>
                            <h3 className="card-title" style={{ marginBottom: '5px' }}>소모 비용 분포도</h3>
                            <p style={{ fontSize: '0.85rem', color: '#8b95a1', marginBottom: '20px' }}>
                                X축: 누적 비용 (억 메소) / Y축: 해당 비용 내에 성공한 유저 수
                            </p>
                            
                            {/* 차트 라이브러리 컴포넌트 렌더링 */}
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto' }}>
                                <BarChart width={700} height={300} data={resultData.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e8eb" />
                                    <XAxis dataKey="costRange" tick={{ fill: '#8b95a1', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fill: '#8b95a1', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="userCount" fill="#fbd17e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </div>
                        </div>
                    ) : (
                        <div className="toss-card" style={{ marginTop: '20px', textAlign: 'center', color: '#e15241' }}>
                            ⚠️ 차트 데이터를 불러오지 못했습니다. 백엔드 응답을 확인해주세요.
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StarforceExpectation;