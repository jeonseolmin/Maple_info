import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import '../layout/calculator/CalculatorExpectation.css';

const CUBE_TYPES = [
    { value: 'RED', label: '레드 큐브 (단종/캐시)' },
    { value: 'BLACK', label: '잠재능력 재설정 (메소)' }, 
    { value: 'ADDITIONAL', label: '에디셔널 재설정 (메소)' },
    { value: 'STRANGE', label: '수상한 큐브' },
    { value: 'SILVER', label: '장인의 큐브' },
    { value: 'ARTISAN', label: '명장의 큐브' },
    { value: 'STRANGEADDI', label: '수상한 에디셔널 큐브' }
];

const ITEM_PARTS = [
    '무기', '모자', '상의', '하의', '한벌옷', '신발', '장갑', '망토',
    '어깨장식', '얼굴장식', '눈장식', '귀고리', '펜던트', '벨트', '반지',
    '엠블렘', '보조무기(포스실드, 소울링 제외)','포스실드, 소울링','방패', '기계심장'
];

const LEVELS = Array.from({ length: 25 }, (_, i) => (i + 1) * 10);

const CubeExpectation = () => {
    const [formData, setFormData] = useState({
        cubeType: 'BLACK',
        itemPart: '무기',
        level: '150',
        tier: '레전드리',
        targetOption1: '',
        targetOption2: '',
        targetOption3: '',
        cubePrice: '40000000' 
    });

    const [dbOptions, setDbOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resultData, setResultData] = useState(null);

    // 공식 재설정 비용표 기반 자동 계산 로직
    useEffect(() => {
        if (formData.cubeType === 'BLACK' || formData.cubeType === 'ADDITIONAL') {
            const level = parseInt(formData.level, 10);
            const tier = formData.tier;
            let calculatedPrice = 0;

            // 1. 일반 잠재능력 재설정 (블랙 큐브 동일 기능)
            if (formData.cubeType === 'BLACK') {
                if (level >= 250) { // 구간 1 (250~300)
                    if (tier === '레어') calculatedPrice = 5000000;
                    else if (tier === '에픽') calculatedPrice = 20000000;
                    else if (tier === '유니크') calculatedPrice = 42500000;
                    else if (tier === '레전드리') calculatedPrice = 50000000;
                } else if (level >= 200) { // 구간 2 (200~249)
                    if (tier === '레어') calculatedPrice = 4500000;
                    else if (tier === '에픽') calculatedPrice = 18000000;
                    else if (tier === '유니크') calculatedPrice = 38250000;
                    else if (tier === '레전드리') calculatedPrice = 45000000;
                } else if (level >= 160) { // 구간 3 (160~199)
                    if (tier === '레어') calculatedPrice = 4250000;
                    else if (tier === '에픽') calculatedPrice = 17000000;
                    else if (tier === '유니크') calculatedPrice = 36125000;
                    else if (tier === '레전드리') calculatedPrice = 42500000;
                } else { // 구간 4 (1~159)
                    if (tier === '레어') calculatedPrice = 4000000;
                    else if (tier === '에픽') calculatedPrice = 16000000;
                    else if (tier === '유니크') calculatedPrice = 34000000;
                    else if (tier === '레전드리') calculatedPrice = 40000000;
                }
            } 
            // 2. 에디셔널 잠재능력 재설정 (화이트 에디셔널 동일 기능)
            else if (formData.cubeType === 'ADDITIONAL') {
                if (level >= 250) { // 구간 1 (250~300)
                    if (tier === '레어') calculatedPrice = 12250000;
                    else if (tier === '에픽') calculatedPrice = 34300000;
                    else if (tier === '유니크') calculatedPrice = 83300000;
                    else if (tier === '레전드리') calculatedPrice = 98000000;
                } else if (level >= 200) { // 구간 2 (200~249)
                    if (tier === '레어') calculatedPrice = 11000000;
                    else if (tier === '에픽') calculatedPrice = 30800000;
                    else if (tier === '유니크') calculatedPrice = 74800000;
                    else if (tier === '레전드리') calculatedPrice = 88000000;
                } else if (level >= 160) { // 구간 3 (160~199)
                    if (tier === '레어') calculatedPrice = 10375000;
                    else if (tier === '에픽') calculatedPrice = 29050000;
                    else if (tier === '유니크') calculatedPrice = 70550000;
                    else if (tier === '레전드리') calculatedPrice = 83000000;
                } else { // 구간 4 (1~159)
                    if (tier === '레어') calculatedPrice = 9750000;
                    else if (tier === '에픽') calculatedPrice = 27300000;
                    else if (tier === '유니크') calculatedPrice = 66300000;
                    else if (tier === '레전드리') calculatedPrice = 78000000;
                }
            }
            
            // 계산된 값을 가격 input에 적용
            setFormData(prev => ({ ...prev, cubePrice: calculatedPrice.toString() }));
        } else if (formData.cubeType === 'RED') {
            // 그 외 큐브는 0으로 처리 (유저가 직접 수정 가능)
            setFormData(prev => ({ ...prev, cubePrice: '0' }));
        }
    }, [formData.cubeType, formData.level, formData.tier]);

    // (옵션 목록 불러오기)
    useEffect(() => {
        const fetchRealOptions = async () => {
            setIsLoading(true);
            try {
                const formattedPartName = `${formData.itemPart} (${formData.level}레벨)`;
                
                const response = await axiosInstance.get('http://localhost:8080/api/cube/options', {
                    params: {
                        cubeType: formData.cubeType,
                        partName: formattedPartName,
                        tier: formData.tier
                    }
                });

                setDbOptions(response.data);
                
                setFormData(prev => ({
                    ...prev,
                    targetOption1: '',
                    targetOption2: '',
                    targetOption3: ''
                }));
            } catch (error) {
                console.error("❌ DB 조회 실패:", error);
                setDbOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRealOptions();
    }, [formData.cubeType, formData.itemPart, formData.level, formData.tier]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'cubePrice') {
            const numValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: numValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCalculate = async () => {
        setIsLoading(true);
        setResultData(null);
        
        try {
            const optionsArray = [formData.targetOption1, formData.targetOption2, formData.targetOption3].filter(opt => opt !== '');
            
            if (optionsArray.length === 0) {
                alert("최소 1개의 목표 옵션을 선택해주세요!");
                setIsLoading(false);
                return;
            }

            const requestPayload = {
                cubeType: formData.cubeType,
                itemPart: `${formData.itemPart} (${formData.level}레벨)`,
                tier: formData.tier,
                selectedOptions: optionsArray,
                cubePrice: Number(formData.cubePrice) || 0 
            };

            const response = await axiosInstance.post('http://localhost:8080/api/cube/calculate', requestPayload);
            setResultData(response.data);
            
        } catch (error) {
            console.error("큐브 계산 중 오류 발생:", error);
            alert("서버 내부 오류(500)가 발생했습니다. 백엔드 로그를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">잠재능력 기댓값 계산기 🎲</h2>
            <p className="page-subtitle">원하는 잠재능력을 띄우기 위해 필요한 횟수와 예상 메소를 확인하세요.</p>

            <div className="toss-card">
                <h3 className="card-title">장비 및 시스템 설정</h3>
                <div className="input-grid">
                    
                    <div className="input-group">
                        <label>잠재능력 설정 방식</label>
                        <select name="cubeType" value={formData.cubeType} onChange={handleChange}>
                            {CUBE_TYPES.map(cube => (
                                <option key={cube.value} value={cube.value}>{cube.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>장비 부위</label>
                        <select name="itemPart" value={formData.itemPart} onChange={handleChange}>
                            {ITEM_PARTS.map(part => (
                                <option key={part} value={part}>{part}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label>착용 레벨</label>
                        <select name="level" value={formData.level} onChange={handleChange}>
                            {LEVELS.map(lv => (
                                <option key={lv} value={lv}>{lv} 레벨</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>현재 등급</label>
                        <select name="tier" value={formData.tier} onChange={handleChange}>
                            <option value="레어">레어</option>
                            <option value="에픽">에픽</option>
                            <option value="유니크">유니크</option>
                            <option value="레전드리">레전드리</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>1회 재설정 비용 (메소)</label>
                        <input 
                            type="text" 
                            name="cubePrice" 
                            value={Number(formData.cubePrice).toLocaleString()} 
                            onChange={handleChange}
                            placeholder="예: 40000000"
                        />
                        <small style={{ color: '#8b95a1', marginTop: '5px', display: 'block' }}>
                            💡 레벨과 등급에 맞춰 공식 1회 재설정 비용이 자동 입력됩니다.
                        </small>
                    </div>
                </div>
            </div>

            <div className="toss-card">
                <h3 className="card-title">목표 옵션 선택</h3>
                <div className="options-stack">
                    {[1, 2, 3].map((num) => (
                        <div className="option-row" key={`target-${num}`}>
                            <span className="option-number">{num}</span>
                            <select 
                                name={`targetOption${num}`}
                                value={formData[`targetOption${num}`]}
                                onChange={handleChange}
                                disabled={isLoading || dbOptions.length === 0}
                                className={isLoading ? "loading-select" : ""}
                            >
                                <option value="">
                                    {isLoading ? "불러오는 중..." : (dbOptions.length === 0 ? "해당 조건의 옵션이 없습니다" : `-- ${num}번째 옵션 선택 --`)}
                                </option>
                                {dbOptions.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                className="primary-calc-btn" 
                onClick={handleCalculate} 
                disabled={isLoading}
            >
                {isLoading ? "계산 중..." : "기댓값 계산하기"}
            </button>

            {resultData && (
                <div className="toss-card result-card" style={{ marginTop: '20px', backgroundColor: '#f2f4f6' }}>
                    <h3 className="card-title" style={{ color: '#3182f6' }}>계산 완료! 🎉</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                            <span>선택한 옵션 동시 등장 확률</span>
                            <strong>{resultData.totalProbability.toFixed(8)}%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                            <span>예상 소모 횟수 (기댓값)</span>
                            <strong>{resultData.expectedCubeCount.toLocaleString()} 회</strong>
                        </div>
                        
                        <hr style={{ borderTop: '1px solid #d1d6db', margin: '5px 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>최종 예상 소모 메소</span>
                            <span style={{ color: '#e15241' }}>{resultData.expectedMeso.toLocaleString()} 메소</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CubeExpectation;