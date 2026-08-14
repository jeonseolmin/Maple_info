import { useState } from 'react';
import '../layout/calculator/CalculatorExpectation.css';

// VIP 사우나 1시간당 경험치 효율표 (%)
const SAUNA_EXP_RATES = {
    299: 0.031, 298: 0.046, 297: 0.050, 296: 0.054, 295: 0.059, 294: 0.106, 293: 0.116, 292: 0.126, 291: 0.137, 290: 0.149,
    289: 0.267, 288: 0.290, 287: 0.315, 286: 0.342, 285: 0.372, 284: 0.669, 283: 0.727, 282: 0.790, 281: 0.858, 280: 0.931,
    279: 1.675, 278: 1.818, 277: 1.975, 276: 2.142, 275: 2.327, 274: 4.182, 273: 4.164, 272: 4.152, 271: 4.140, 270: 4.120,
    269: 8.133, 268: 8.106, 267: 8.065, 266: 8.037, 265: 8.007, 264: 9.252, 263: 9.201, 262: 9.164, 261: 9.125, 260: 9.086,
    259: 15.434, 258: 15.667, 257: 15.875, 256: 16.112, 255: 16.349, 254: 16.588, 253: 16.827, 252: 17.068, 251: 17.256, 250: 17.552,
    249: 19.925, 248: 20.198, 247: 20.471, 246: 20.745, 245: 21.019, 244: 24.807, 243: 25.125, 242: 25.494, 241: 25.813, 240: 25.778,
    239: 30.397, 238: 30.761, 237: 31.122, 236: 31.546, 235: 31.905, 234: 37.583, 233: 37.994, 232: 38.482, 231: 38.888, 230: 39.286,
    229: 44.426, 228: 46.610, 227: 48.877, 226: 51.362, 225: 53.839, 224: 63.279, 223: 66.446, 222: 69.599, 221: 73.049, 220: 76.471,
    219: 62.653, 218: 66.774, 217: 71.318, 216: 75.962, 215: 81.078, 214: 95.013, 213: 103.208, 212: 112.078, 211: 121.357, 210: 131.695,
    209: 79.221, 208: 86.680, 207: 94.800, 206: 103.376, 205: 112.965, 204: 123.403, 203: 134.739, 202: 146.648, 201: 159.967, 200: 174.425
};

const AfkExperience = () => {
    const [formData, setFormData] = useState({
        level: '260',
        currentExp: '',
        afkHours: '8'
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'currentExp' || name === 'afkHours') {
            const validValue = value.replace(/[^0-9.]/g, ''); // 숫자와 소수점만 허용
            setFormData(prev => ({ ...prev, [name]: validValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCalculate = () => {
        let currentLevel = parseInt(formData.level, 10);
        let currentPercent = parseFloat(formData.currentExp) || 0;
        let remainingHours = parseFloat(formData.afkHours) || 0;

        if (remainingHours <= 0) {
            alert("잠수 시간을 입력해주세요.");
            return;
        }

        const startLevel = currentLevel;
        const startPercent = currentPercent;

        // 잠수 도중 레벨업을 하는 경우를 처리하기 위한 로직
        while (remainingHours > 0 && currentLevel < 300) {
            let hourlyRate = SAUNA_EXP_RATES[currentLevel] || 0;
            if (hourlyRate === 0) break; // 데이터가 없는 레벨이면 중단

            let percentToNextLevel = 100 - currentPercent;
            let hoursToNextLevel = percentToNextLevel / hourlyRate;

            if (remainingHours >= hoursToNextLevel) {
                // 잠수 시간이 레벨업 필요 시간보다 길 경우 (레벨업 발생)
                remainingHours -= hoursToNextLevel;
                currentLevel++;
                currentPercent = 0; // 다음 레벨 0%에서 다시 시작
            } else {
                // 레벨업을 하지 않고 잠수가 끝날 경우
                currentPercent += hourlyRate * remainingHours;
                remainingHours = 0;
            }
        }

        setResult({
            startLevel,
            startPercent,
            finalLevel: currentLevel,
            finalPercent: currentPercent.toFixed(3) // 소수점 3자리까지 표시
        });
    };

    // 200~299 레벨 옵션 생성
    const levelOptions = Array.from({ length: 100 }, (_, i) => 200 + i).reverse();

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">잠수맵 경험치 계산기 💤</h2>
            <p className="page-subtitle">VIP 사우나 / MVP 리조트에서 잠수 시 얻는 경험치를 계산합니다.</p>

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
                        <label>잠수 시간 (시간)</label>
                        <input 
                            type="text" 
                            name="afkHours" 
                            value={formData.afkHours} 
                            onChange={handleChange}
                            placeholder="예: 8"
                        />
                        <small style={{ color: '#8b95a1', marginTop: '5px', display: 'block' }}>
                            💡 보통 주무실 때 8시간 정도 세워둡니다. (소수점 입력 가능)
                        </small>
                    </div>
                </div>
            </div>

            <button className="primary-calc-btn" onClick={handleCalculate}>잠수 결과 확인하기</button>

            {result && (
                <div className="toss-card result-card" style={{ marginTop: '20px' }}>
                    <h3 className="card-title">기상 후 도달하는 레벨 ☀️</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4e5968' }}>
                            <span>기존 레벨 / 경험치</span>
                            <span>Lv.{result.startLevel} ({result.startPercent}%)</span>
                        </div>
                        
                        <hr style={{ borderTop: '1px solid #d1d6db', margin: '5px 0' }} />
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>최종 예상 레벨</span>
                            <span style={{ color: '#3182f6' }}>
                                Lv.{result.finalLevel} ({result.finalPercent}%)
                            </span>
                        </div>
                        
                        {result.finalLevel > result.startLevel && (
                            <div style={{ textAlign: 'right', color: '#e15241', fontWeight: 'bold', marginTop: '5px' }}>
                                🆙 {result.finalLevel - result.startLevel} 레벨 업!
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AfkExperience;