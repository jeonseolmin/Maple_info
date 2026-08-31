import { useState } from 'react';
import './HuntingOptimization.css';

const huntingGrounds = [
    { region: "세르니움", map: "해변 암석 지대 1~4", mobLevel: 260, reqAut: 30 },
    { region: "세르니움", map: "세르니움 서쪽 성벽 1~3", mobLevel: 260, reqAut: 30 },
    { region: "세르니움", map: "세르니움 동쪽 성벽 1~3, 왕립 도서관 1~6", mobLevel: 261, reqAut: 30 },

    { region: "불타는 세르니움", map: "격전의 서쪽 성벽 1~4", mobLevel: 262, reqAut: 50 },
    { region: "불타는 세르니움", map: "격전의 동쪽 성벽 1~6", mobLevel: 263, reqAut: 50 },
    { region: "불타는 세르니움", map: "불타는 왕립 도서관 1~6", mobLevel: 264, reqAut: 50 },

    { region: "호텔 아르크스", map: "무법자들이 지배하는 황야 1~4", mobLevel: 265, reqAut: 70 },
    { region: "호텔 아르크스", map: "낭만이 저무는 자동차 극장 1~3", mobLevel: 266, reqAut: 70 },
    { region: "호텔 아르크스", map: "낭만이 저무는 자동차 극장 4~6", mobLevel: 267, reqAut: 70 },
    { region: "호텔 아르크스", map: "종착지 없는 횡단열차 1~3", mobLevel: 268, reqAut: 100 },
    { region: "호텔 아르크스", map: "종착지 없는 횡단열차 4~6", mobLevel: 269, reqAut: 100 },

    { region: "오디움", map: "성문으로 가는 길 1~5", mobLevel: 270, reqAut: 130 },
    { region: "오디움", map: "점령당한 골목 1~4", mobLevel: 271, reqAut: 160 },
    { region: "오디움", map: "볕 드는 실험실 1~3", mobLevel: 272, reqAut: 180 },
    { region: "오디움", map: "잠긴 문 뒤 실험실 1~2", mobLevel: 273, reqAut: 200 },
    { region: "오디움", map: "잠긴 문 뒤 실험실 2~4", mobLevel: 274, reqAut: 200 },

    { region: "도원경", map: "생기가 돌아오는 봄 1~5", mobLevel: 275, reqAut: 230 },
    { region: "도원경", map: "빛이 약한 여름 1~5", mobLevel: 276, reqAut: 260 },
    { region: "도원경", map: "색깔이 옅은 가을 1~5", mobLevel: 277, reqAut: 280 },
    { region: "도원경", map: "참혹한 흔적의 겨울 1~2", mobLevel: 278, reqAut: 300 },
    { region: "도원경", map: "참혹한 흔적의 겨울 2~5", mobLevel: 279, reqAut: 300 },

    { region: "아르테리아", map: "퀸스로드 (북/남/동/서, 외곽 전투지역)", mobLevel: 280, reqAut: 330 },
    { region: "아르테리아", map: "최하층 통로 1~3", mobLevel: 282, reqAut: 360 },
    { region: "아르테리아", map: "최하층 통로 4~6", mobLevel: 283, reqAut: 360 },
    { region: "아르테리아", map: "최상층 통로 1~8", mobLevel: 284, reqAut: 400 },

    { region: "카르시온", map: "거대 산호 군락 1~2", mobLevel: 285, reqAut: 430 },
    { region: "카르시온", map: "거대 산호 군락 3, 잔잔한 해안가 1~3", mobLevel: 286, reqAut: 430 },
    { region: "카르시온", map: "휘감기는 숲 1~2", mobLevel: 287, reqAut: 460 },
    { region: "카르시온", map: "휘감기는 숲 3, 어둠이 내리는 나무줄기 1~3", mobLevel: 288, reqAut: 460 },
    { region: "카르시온", map: "숨이 멎어드는 동굴 1~4, 가라앉은 유적지 1~4", mobLevel: 289, reqAut: 500 },

    { region: "탈라하트", map: "재와 침묵의 땅 1~3", mobLevel: 290, reqAut: 630 },
    { region: "탈라하트", map: "재와 침묵의 땅 3~5 (침묵을 삼키는 사념)", mobLevel: 291, reqAut: 630 },
    { region: "탈라하트", map: "섭리와 운명의 전쟁터 1~3", mobLevel: 291, reqAut: 660 },
    { region: "탈라하트", map: "심판과 운명의 전쟁터 1~3", mobLevel: 292, reqAut: 660 },
    { region: "탈라하트", map: "영원과 운명의 전쟁터 1~3", mobLevel: 293, reqAut: 660 },
    { region: "탈라하트", map: "밤의 길 1~4", mobLevel: 294, reqAut: 700 },
    { region: "탈라하트", map: "환영의 길 1~4", mobLevel: 294, reqAut: 700 },

    { region: "기어드락", map: "지하 1층, 지하 2층 1~2구역", mobLevel: 295, reqAut: 740 },
    { region: "기어드락", map: "지하 3층 1구역, 지하 2층 3구역, 지하 4층", mobLevel: 296, reqAut: 740 },
    { region: "기어드락", map: "로봇 창고 1~4", mobLevel: 297, reqAut: 770 },
    { region: "기어드락", map: "로봇 창고 5~8", mobLevel: 298, reqAut: 770 },
    { region: "기어드락", map: "고브의 작업실 1~4", mobLevel: 299, reqAut: 810 },
    { region: "기어드락", map: "고브의 작업실 5~8", mobLevel: 299, reqAut: 810 }
];

const HuntingOptimization = () => {
    const [userLevel, setUserLevel] = useState(260);
    const [userAut, setUserAut] = useState(50);

    const calculateExpMultiplier = (mobLevel, uLevel) => {
        const diff = uLevel - mobLevel;
        if (diff >= -1 && diff <= 1) return 120;
        if (diff >= -4 && diff <= -2) return 110;
        if (diff >= -9 && diff <= -5) return 105;
        if (diff >= 2 && diff <= 4) return 110;
        if (diff >= 5 && diff <= 9) return 105;
        if (diff >= 10 && diff <= 20) return 100;
        if (diff < -20) return 0; 
        return 100; 
    };

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
        return 10; 
    };

    return (
        <div className="modern-calc-container">
            <h2 className="page-title">사냥터 효율 분석기</h2>
            <p className="page-subtitle">현재 레벨과 포스를 입력하면 최적의 사냥터를 추천합니다.</p>

            <div className="toss-card input-row">
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

            <div className="hunting-table-wrapper">
                <table className="hunting-table">
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
                            
                            let recommendBadge = null;
                            if (exp === 120 && dmg >= 100) {
                                recommendBadge = <span className="badge badge-recommend">강력 추천</span>;
                            } else if (dmg < 100) {
                                recommendBadge = <span className="badge badge-warning">포스 부족</span>;
                            } else {
                                recommendBadge = <span className="badge badge-normal">보통</span>;
                            }

                            // 테이블 셀 색상 처리용 클래스 할당
                            const expClass = exp === 120 ? 'text-exp-high' : '';
                            let dmgClass = '';
                            if (dmg > 100) dmgClass = 'text-dmg-high';
                            else if (dmg < 100) dmgClass = 'text-dmg-low';

                            return (
                                <tr key={index}>
                                    <td className="text-bold">{ground.region}</td>
                                    <td>{ground.map}</td>
                                    <td>Lv. {ground.mobLevel}</td>
                                    <td>{ground.reqAut}</td>
                                    <td className={expClass}>{exp}%</td>
                                    <td className={dmgClass}>{dmg}%</td>
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