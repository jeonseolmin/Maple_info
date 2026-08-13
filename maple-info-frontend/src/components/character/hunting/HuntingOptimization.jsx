import { useState } from 'react';
import '../../mulungDojo/MuLungDojo.css';

const huntingGrounds = [
    // --- 세르니움 ---
    { region: "세르니움", map: "해변 암석 지대 1~4", mobLevel: 260, reqAut: 50 },
    { region: "세르니움", map: "세르니움 서쪽 성벽 1~3", mobLevel: 260, reqAut: 50 },
    { region: "세르니움", map: "세르니움 동쪽 성벽 1~3, 왕립 도서관 1~6", mobLevel: 261, reqAut: 50 },

    // --- 불타는 세르니움 ---
    { region: "불타는 세르니움", map: "격전의 서쪽 성벽 1~4", mobLevel: 262, reqAut: 50 },
    { region: "불타는 세르니움", map: "격전의 동쪽 성벽 1~6", mobLevel: 263, reqAut: 50 },
    { region: "불타는 세르니움", map: "불타는 왕립 도서관 1~6", mobLevel: 264, reqAut: 50 },

    // --- 호텔 아르크스 ---
    { region: "호텔 아르크스", map: "무법자들이 지배하는 황야 1~4", mobLevel: 265, reqAut: 130 },
    { region: "호텔 아르크스", map: "낭만이 저무는 자동차 극장 1~3", mobLevel: 266, reqAut: 130 },
    { region: "호텔 아르크스", map: "낭만이 저무는 자동차 극장 4~6", mobLevel: 267, reqAut: 130 },
    { region: "호텔 아르크스", map: "종착지 없는 횡단열차 1~3", mobLevel: 268, reqAut: 130 },
    { region: "호텔 아르크스", map: "종착지 없는 횡단열차 4~6", mobLevel: 269, reqAut: 130 },

    // --- 오디움 ---
    { region: "오디움", map: "성문으로 가는 길 1~5", mobLevel: 270, reqAut: 230 },
    { region: "오디움", map: "점령당한 골목 1~4", mobLevel: 271, reqAut: 230 },
    { region: "오디움", map: "볕 드는 실험실 1~3", mobLevel: 272, reqAut: 260 },
    { region: "오디움", map: "잠긴 문 뒤 실험실 1~2", mobLevel: 273, reqAut: 260 },
    { region: "오디움", map: "잠긴 문 뒤 실험실 2~4", mobLevel: 274, reqAut: 260 },

    // --- 도원경 ---
    { region: "도원경", map: "생기가 돌아오는 봄 1~5", mobLevel: 275, reqAut: 300 },
    { region: "도원경", map: "빛이 약한 여름 1~5", mobLevel: 276, reqAut: 300 },
    { region: "도원경", map: "색깔이 옅은 가을 1~5", mobLevel: 277, reqAut: 330 },
    { region: "도원경", map: "참혹한 흔적의 겨울 1~2", mobLevel: 278, reqAut: 330 },
    { region: "도원경", map: "참혹한 흔적의 겨울 2~5", mobLevel: 279, reqAut: 330 },

    // --- 아르테리아 ---
    { region: "아르테리아", map: "북쪽/남쪽/동쪽/서쪽 외곽지역, 외곽 전투지역 1~2", mobLevel: 280, reqAut: 330 },
    { region: "아르테리아", map: "최하층 통로 1~3", mobLevel: 282, reqAut: 360 },
    { region: "아르테리아", map: "최하층 통로 4~6", mobLevel: 283, reqAut: 360 },
    { region: "아르테리아", map: "최상층 통로 1~8", mobLevel: 284, reqAut: 360 },

    // --- 카르시온 ---
    { region: "카르시온", map: "거대 산호 군락 1~2", mobLevel: 285, reqAut: 380 },
    { region: "카르시온", map: "거대 산호 군락 3, 잔잔한 해안가 1~3", mobLevel: 286, reqAut: 380 },
    { region: "카르시온", map: "휘감기는 숲 1~2", mobLevel: 287, reqAut: 400 },
    { region: "카르시온", map: "휘감기는 숲 3, 어둠이 내리는 나무줄기 1~3", mobLevel: 288, reqAut: 400 },
    { region: "카르시온", map: "숨이 멎어드는 동굴 1~4, 가라앉은 유적지 1~4", mobLevel: 289, reqAut: 400 },

    // --- 탈라하트 ---
    { region: "탈라하트", map: "재와 침묵의 땅 1~3", mobLevel: 290, reqAut: 430 },
    { region: "탈라하트", map: "재와 침묵의 땅 3~5, 섭리와 운명의 전쟁터 1~3", mobLevel: 291, reqAut: 430 },
    { region: "탈라하트", map: "심판과 운명의 전쟁터 1~3", mobLevel: 292, reqAut: 430 },
    { region: "탈라하트", map: "영원과 운명의 전쟁터 1~3", mobLevel: 293, reqAut: 460 },
    { region: "탈라하트", map: "밤의 길 1~4, 환영의 길 1~4", mobLevel: 294, reqAut: 460 },

    // --- 기어드락 ---
    { region: "기어드락", map: "지하 1층, 지하 2층 1~2구역", mobLevel: 295, reqAut: 480 },
    { region: "기어드락", map: "지하 3층 1구역, 지하 2층 3구역, 지하 4층", mobLevel: 296, reqAut: 480 },
    { region: "기어드락", map: "로봇 창고 1~4", mobLevel: 297, reqAut: 480 },
    { region: "기어드락", map: "로봇 창고 5~8", mobLevel: 298, reqAut: 510 },
    { region: "기어드락", map: "고브의 작업실 1~8", mobLevel: 299, reqAut: 510 }
];

const HuntingOptimization = () => {
    // 유저 입력 상태 관리
    const [userLevel, setUserLevel] = useState(260);
    const [userAut, setUserAut] = useState(50);

    // 경험치 배율 계산 공식 (레벨 차이 기반)
    const calculateExpMultiplier = (mobLevel, uLevel) => {
        const diff = uLevel - mobLevel;
        if (diff >= -1 && diff <= 1) return 120;
        if (diff >= -4 && diff <= -2) return 110;
        if (diff >= -9 && diff <= -5) return 105;
        if (diff >= 2 && diff <= 4) return 110;
        if (diff >= 5 && diff <= 9) return 105;
        if (diff >= 10 && diff <= 20) return 100;
        if (diff < -20) return 0; // 페널티 심함
        return 100; // 기타 범위
    };

    // 데미지 배율 계산 공식 (어센틱포스 차이 기반)
    const calculateDmgMultiplier = (reqAut, uAut) => {
        const diff = uAut - reqAut;
        if (diff >= 50) return 125;
        if (diff >= 40) return 120;
        if (diff >= 30) return 115;
        if (diff >= 20) return 110;
        if (diff >= 10) return 105;
        if (diff >= 0) return 100;
        if (diff >= -10) return 90;
        if (diff >= -20) return 80;
        if (diff >= -30) return 70;
        return 10; // 포스 부족 페널티
    };

    return (
        <div className="mulung-container">
            <h2 className="page-title">사냥터 효율 분석기 ⚔️</h2>
            <p className="page-subtitle">현재 레벨과 포스를 입력하면 최적의 사냥터를 추천합니다.</p>

            {/* 입력 폼 */}
            <div className="toss-card" style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <div className="input-group">
                    <label>내 캐릭터 레벨</label>
                    <input 
                        type="number" 
                        value={userLevel} 
                        onChange={(e) => setUserLevel(Number(e.target.value))} 
                        min="260" max="300" 
                    />
                </div>
                <div className="input-group">
                    <label>내 어센틱포스 (AUT)</label>
                    <input 
                        type="number" 
                        value={userAut} 
                        onChange={(e) => setUserAut(Number(e.target.value))} 
                        min="0" step="10" 
                    />
                </div>
            </div>

            {/* 결과 테이블 */}
            <div className="mulung-table-wrapper">
                <table className="mulung-table">
                    <thead>
                        <tr>
                            <th>지역</th>
                            <th>대표 사냥터</th>
                            <th>몬스터 레벨</th>
                            <th>필요 포스</th>
                            <th>경험치 획득량</th>
                            <th>가하는 데미지</th>
                            <th>추천도</th>
                        </tr>
                    </thead>
                    <tbody>
                        {huntingGrounds.map((ground, index) => {
                            const exp = calculateExpMultiplier(ground.mobLevel, userLevel);
                            const dmg = calculateDmgMultiplier(ground.reqAut, userAut);
                            
                            // 추천도 판별 로직: 경험치 120% 이거나 데미지 100% 이상일 때
                            let recommendBadge = null;
                            if (exp === 120 && dmg >= 100) {
                                recommendBadge = <span className="badge badge-element" style={{backgroundColor: '#48bb78'}}>강력 추천</span>;
                            } else if (dmg < 100) {
                                recommendBadge = <span className="badge badge-armor-high">포스 부족</span>;
                            } else {
                                recommendBadge = <span className="badge" style={{backgroundColor: '#a0aec0', color: 'white'}}>보통</span>;
                            }

                            return (
                                <tr key={index}>
                                    <td style={{ fontWeight: 'bold' }}>{ground.region}</td>
                                    <td>{ground.map}</td>
                                    <td>Lv. {ground.mobLevel}</td>
                                    <td>{ground.reqAut}</td>
                                    <td style={{ color: exp === 120 ? '#f6ad55' : 'inherit', fontWeight: exp === 120 ? 'bold' : 'normal' }}>
                                        {exp}%
                                    </td>
                                    <td style={{ color: dmg > 100 ? '#48bb78' : (dmg < 100 ? '#fc8181' : 'inherit'), fontWeight: 'bold' }}>
                                        {dmg}%
                                    </td>
                                    <td>{recommendBadge}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HuntingOptimization;