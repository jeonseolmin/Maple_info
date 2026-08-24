import { useState } from 'react';
import './MuLungDojo.css';
import '../layout/calculator/CalculatorExpectation.css';

const muLungData = [
    { floor: 1, name: "마노", level: 100, hp: "5,200,000", accHp: "5,200,000", armor: "50%", note: "" },
    { floor: 2, name: "머쉬맘", level: 102, hp: "5,740,800", accHp: "10,940,800", armor: "50%", note: "" },
    { floor: 3, name: "스텀피", level: 104, hp: "6,307,200", accHp: "17,248,000", armor: "50%", note: "" },
    { floor: 4, name: "블루 머쉬맘", level: 106, hp: "6,930,000", accHp: "24,178,000", armor: "50%", note: "" },
    { floor: 5, name: "좀비 머쉬맘", level: 108, hp: "7,549,200", accHp: "31,727,200", armor: "50%", note: "" },
    { floor: 6, name: "킹슬라임", level: 110, hp: "12,342,000", accHp: "44,069,200", armor: "50%", note: "" },
    { floor: 7, name: "다일", level: 113, hp: "13,923,000", accHp: "57,992,200", armor: "50%", note: "" },
    { floor: 8, name: "킹크랑", level: 115, hp: "15,105,000", accHp: "73,097,200", armor: "50%", note: "" },
    { floor: 9, name: "파우스트", level: 118, hp: "16,846,000", accHp: "89,943,200", armor: "50%", note: "" },
    { floor: 10, name: "반 레온", level: 120, hp: "100,000,000", accHp: "280,419,390", armor: "50%", note: "모든 속성 반감" },
    { floor: 11, name: "메탈 골렘", level: 120, hp: "40,824,000", accHp: "321,243,390", armor: "50%", note: "" },
    { floor: 12, name: "포장마차", level: 123, hp: "45,404,550", accHp: "366,647,940", armor: "50%", note: "" },
    { floor: 13, name: "주니어 발록", level: 125, hp: "48,593,250", accHp: "415,241,190", armor: "50%", note: "" },
    { floor: 14, name: "엘리쟈", level: 128, hp: "55,350,000", accHp: "470,591,190", armor: "50%", note: "" },
    { floor: 15, name: "크림슨 발록", level: 130, hp: "61,600,500", accHp: "532,191,690", armor: "50%", note: "" },
    { floor: 16, name: "설산의 마녀", level: 132, hp: "68,121,000", accHp: "600,312,690", armor: "50%", note: "" },
    { floor: 17, name: "세르프", level: 138, hp: "78,840,000", accHp: "679,152,690", armor: "50%", note: "" },
    { floor: 18, name: "데우", level: 138, hp: "90,011,250", accHp: "769,163,940", armor: "50%", note: "" },
    { floor: 19, name: "파파픽시", level: 140, hp: "97,902,000", accHp: "867,065,940", armor: "50%", note: "" },
    { floor: 20, name: "힐라", level: 143, hp: "1,500,000,000", accHp: "3,724,208,798", armor: "50%", note: "모든 속성 반감" },
    { floor: 21, name: "디트와 로이 + 네오 휴로이드", level: 145, hp: "130,536,000", accHp: "3,854,744,798", armor: "50%/10%", note: "" },
    { floor: 22, name: "키메라 + 호문스큘러", level: 148, hp: "159,138,000", accHp: "4,013,882,798", armor: "50%/10%", note: "" },
    { floor: 23, name: "프랑켄로이드 + 미스릴 뮤테", level: 150, hp: "190,350,000", accHp: "4,204,232,798", armor: "50%/10%", note: "" },
    { floor: 24, name: "차우 + 원시멧돼지", level: 153, hp: "242,424,000", accHp: "4,446,656,798", armor: "50%/10%", note: "" },
    { floor: 25, name: "에피네아 + 샤이닝 페어리", level: 155, hp: "405,504,000", accHp: "4,852,160,798", armor: "50%/10%", note: "" },
    { floor: 26, name: "롬바드 + 킹 블록골렘", level: 158, hp: "497,040,000", accHp: "5,349,200,798", armor: "50%/10%", note: "" },
    { floor: 27, name: "타이머 + 틱톡", level: 160, hp: "596,496,000", accHp: "5,945,696,798", armor: "50%/10%", note: "" },
    { floor: 28, name: "마스터 스펙터 + 사신 스펙터", level: 163, hp: "706,176,000", accHp: "6,651,872,798", armor: "50%/10%", note: "" },
    { floor: 29, name: "마스터 버크 + 듀얼 버크", level: 165, hp: "824,256,000", accHp: "7,476,128,798", armor: "50%/10%", note: "" },
    { floor: 30, name: "아카이럼", level: 168, hp: "3,000,000,000", accHp: "13,190,414,512", armor: "50%", note: "모든 속성 반감" },
    { floor: 31, name: "마뇽 × 2", level: 170, hp: "2,108,240,000 × 2", accHp: "17,406,894,512", armor: "50%", note: "" },
    { floor: 32, name: "그리프 × 2", level: 175, hp: "2,526,520,000 × 2", accHp: "22,459,934,512", armor: "50%", note: "" },
    { floor: 33, name: "크세르크세스 × 2", level: 180, hp: "2,976,000,000 × 2", accHp: "28,411,934,512", armor: "50%", note: "" },
    { floor: 34, name: "파풀라투스 × 2", level: 185, hp: "3,464,920,000 × 2", accHp: "35,341,774,512", armor: "50%", note: "" },
    { floor: 35, name: "알리샤르 × 2", level: 190, hp: "3,986,640,000 × 2", accHp: "43,315,054,512", armor: "50%", note: "" },
    { floor: 36, name: "스노우맨 × 2", level: 195, hp: "4,551,000,000 × 2", accHp: "52,417,054,512", armor: "50%", note: "" },
    { floor: 37, name: "리치 × 2", level: 200, hp: "5,149,760,000 × 2", accHp: "62,716,574,512", armor: "50%", note: "" },
    { floor: 38, name: "아니 × 3", level: 205, hp: "6,474,960,000 × 3", accHp: "82,141,454,512", armor: "50%", note: "" },
    { floor: 39, name: "킹 오멘 × 3", level: 210, hp: "7,971,840,000 × 3", accHp: "106,056,974,512", armor: "50%", note: "" },
    { floor: 40, name: "매그너스", level: 215, hp: "8,000,000,000", accHp: "121,295,069,750", armor: "50%", note: "모든 속성 반감" },
    { floor: 41, name: "타르가", level: 220, hp: "42,000,000,000", accHp: "163,295,069,750", armor: "50%", note: "" },
    { floor: 42, name: "스칼리온", level: 220, hp: "63,000,000,000", accHp: "226,295,069,750", armor: "50%", note: "" },
    { floor: 43, name: "요괴선사", level: 220, hp: "84,000,000,000", accHp: "310,295,069,750", armor: "50%", note: "" },
    { floor: 44, name: "데비존", level: 220, hp: "105,000,000,000", accHp: "415,295,069,750", armor: "50%", note: "" },
    { floor: 45, name: "라바나", level: 220, hp: "105,000,000,000", accHp: "520,295,069,750", armor: "50%", note: "" },
    { floor: 46, name: "레비아탄", level: 230, hp: "210,000,000,000", accHp: "730,295,069,750", armor: "50%", note: "" },
    { floor: 47, name: "도도", level: 230, hp: "315,000,000,000", accHp: "1,045,295,069,750", armor: "50%", note: "" },
    { floor: 48, name: "릴리노흐", level: 230, hp: "420,000,000,000", accHp: "1,465,295,069,750", armor: "50%", note: "" },
    { floor: 49, name: "라이카", level: 230, hp: "525,000,000,000", accHp: "1,990,295,069,750", armor: "50%", note: "" },
    { floor: 50, name: "핑크빈", level: 230, hp: "525,000,000,000", accHp: "2,990,295,069,750", armor: "50%", note: "모든 속성 반감" },
    { floor: 51, name: "락 스피릿", level: 240, hp: "630,000,000,000", accHp: "3,620,295,069,750", armor: "50%", note: "" },
    { floor: 52, name: "타란튤로스", level: 240, hp: "735,000,000,000", accHp: "4,355,295,069,750", armor: "50%", note: "" },
    { floor: 53, name: "드래고니카", level: 240, hp: "840,000,000,000", accHp: "5,195,295,069,750", armor: "50%", note: "" },
    { floor: 54, name: "드래곤라이더", level: 240, hp: "945,000,000,000", accHp: "6,140,295,069,750", armor: "50%", note: "" },
    { floor: 55, name: "호크아이", level: 240, hp: "1,050,000,000,000", accHp: "7,190,295,069,750", armor: "50%", note: "" },
    { floor: 56, name: "이카르트", level: 245, hp: "1,155,000,000,000", accHp: "8,345,295,069,750", armor: "50%", note: "" },
    { floor: 57, name: "이리나", level: 245, hp: "1,260,000,000,000", accHp: "9,605,295,069,750", armor: "50%", note: "" },
    { floor: 58, name: "오즈", level: 245, hp: "1,365,000,000,000", accHp: "10,970,295,069,750", armor: "50%", note: "" },
    { floor: 59, name: "미하일", level: 245, hp: "1,470,000,000,000", accHp: "12,440,295,069,750", armor: "50%", note: "" },
    { floor: 60, name: "시그너스", level: 245, hp: "1,575,000,000,000", accHp: "15,440,295,069,750", armor: "100%", note: "모든 속성 반감" },
    { floor: 61, name: "피아누스", level: 250, hp: "1,680,000,000,000", accHp: "17,120,295,069,750", armor: "100%", note: "" },
    { floor: 62, name: "렉스", level: 250, hp: "1,785,000,000,000", accHp: "18,905,295,069,750", armor: "100%", note: "" },
    { floor: 63, name: "카웅", level: 250, hp: "1,890,000,000,000", accHp: "20,795,295,069,750", armor: "100%", note: "" },
    { floor: 64, name: "변형된 스텀피", level: 250, hp: "1,911,000,000,000", accHp: "22,706,295,069,750", armor: "100%", note: "" },
    { floor: 65, name: "하늘 수호령", level: 250, hp: "1,932,000,000,000", accHp: "24,638,295,069,750", armor: "100%", note: "" },
    { floor: 66, name: "게오르크", level: 255, hp: "1,953,000,000,000", accHp: "26,591,295,069,750", armor: "100%", note: "" },
    { floor: 67, name: "타락마족 강화늑대기수", level: 255, hp: "1,974,000,000,000", accHp: "28,565,295,069,750", armor: "100%", note: "" },
    { floor: 68, name: "아르마", level: 255, hp: "1,995,000,000,000", accHp: "30,560,295,069,750", armor: "100%", note: "" },
    { floor: 69, name: "츄릅나무", level: 255, hp: "2,016,000,000,000", accHp: "32,576,295,069,750", armor: "100%", note: "" },
    { floor: 70, name: "스우", level: 255, hp: "2,100,000,000,000", accHp: "36,576,295,069,750", armor: "150%", note: "모든 속성 반감" },
    { floor: 71, name: "클리너", level: 260, hp: "2,310,000,000,000", accHp: "38,886,295,069,750", armor: "150%", note: "" },
    { floor: 72, name: "악화된 조화의 정령", level: 260, hp: "2,625,000,000,000", accHp: "41,511,295,069,750", armor: "150%", note: "" },
    { floor: 73, name: "증발하는 에르다스", level: 260, hp: "2,940,000,000,000", accHp: "44,451,295,069,750", armor: "150%", note: "" },
    { floor: 74, name: "아랑", level: 260, hp: "3,255,000,000,000", accHp: "47,706,295,069,750", armor: "150%", note: "" },
    { floor: 75, name: "봉선", level: 260, hp: "3,570,000,000,000", accHp: "51,276,295,069,750", armor: "150%", note: "" },
    { floor: 76, name: "오공", level: 260, hp: "3,915,000,000,000", accHp: "55,191,295,069,750", armor: "150%", note: "" },
    { floor: 77, name: "송달", level: 260, hp: "4,210,000,000,000", accHp: "59,401,295,069,750", armor: "150%", note: "" },
    { floor: 78, name: "황룡", level: 260, hp: "4,535,000,000,000", accHp: "63,936,295,069,750", armor: "150%", note: "" },
    { floor: 79, name: "적호", level: 260, hp: "4,857,000,000,000", accHp: "68,793,295,069,750", armor: "150%", note: "" },
    { floor: 80, name: "무공", level: 260, hp: "5,257,300,000,000", accHp: "78,807,199,831,654", armor: "200%", note: "모든 속성 반감" },
    { floor: 81, name: "아라네아", level: 265, hp: "5,790,900,000,000", accHp: "84,598,099,831,654", armor: "200%", note: "" },
    { floor: 82, name: "빛의 집행자", level: 265, hp: "6,099,800,000,000", accHp: "90,697,899,831,654", armor: "200%", note: "" },
    { floor: 83, name: "히아데스", level: 265, hp: "6,400,000,000,000", accHp: "97,097,899,831,654", armor: "200%", note: "" },
    { floor: 84, name: "공허의 하수인", level: 265, hp: "6,800,000,000,000", accHp: "103,897,899,831,654", armor: "200%", note: "" },
    { floor: 85, name: "데미안", level: 265, hp: "7,600,000,000,000", accHp: "118,374,090,307,844", armor: "200%", note: "모든 속성 반감" },
    { floor: 86, name: "황혼의 하수인", level: 265, hp: "8,000,000,000,000", accHp: "126,374,090,307,844", armor: "200%", note: "" },
    { floor: 87, name: "거대한 골렘", level: 265, hp: "8,400,000,000,000", accHp: "134,774,090,307,844", armor: "200%", note: "" },
    { floor: 88, name: "리버스 다크 소울", level: 265, hp: "8,800,000,000,000", accHp: "143,574,090,307,844", armor: "200%", note: "" },
    { floor: 89, name: "절망의 칼날", level: 265, hp: "9,500,000,000,000", accHp: "153,074,090,307,844", armor: "200%", note: "" },
    { floor: 90, name: "윌", level: 265, hp: "10,300,000,000,000", accHp: "172,693,137,926,892", armor: "250%", note: "모든 속성 반감" },
    { floor: 91, name: "안세스티온", level: 270, hp: "11,300,000,000,000", accHp: "183,993,137,926,892", armor: "250%", note: "" },
    { floor: 92, name: "어센시온", level: 270, hp: "12,600,000,000,000", accHp: "196,593,137,926,892", armor: "250%", note: "" },
    { floor: 93, name: "엠브리온", level: 270, hp: "13,800,000,000,000", accHp: "210,393,137,926,892", armor: "250%", note: "" },
    { floor: 94, name: "각성한 아랑", level: 270, hp: "-", accHp: "-", armor: "250%", note: "" },
    { floor: 95, name: "각성한 봉선", level: 270, hp: "-", accHp: "-", armor: "250%", note: "" },
    { floor: 96, name: "각성한 오공", level: 270, hp: "-", accHp: "-", armor: "250%", note: "" },
    { floor: 97, name: "각성한 송달", level: 270, hp: "-", accHp: "-", armor: "250%", note: "" },
    { floor: 98, name: "각성한 황룡", level: 270, hp: "-", accHp: "-", armor: "250%", note: "" },
    { floor: 99, name: "각성한 적호", level: 270, hp: "-", accHp: "-", armor: "250%", note: "" },
    { floor: 100, name: "각성한 무공", level: 275, hp: "63,000,000,000,000", accHp: "-", armor: "300%", note: "모든 속성 반감" }
];

const MuLungDojo = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // 검색어(층수 또는 몬스터 이름)에 맞춰 데이터 필터링
    const filteredData = muLungData.filter(data => 
        data.name.includes(searchTerm) || 
        data.floor.toString().includes(searchTerm)
    );

    return (
        <div className="mulung-container">
            <h2 className="page-title">무릉도장 도감</h2>
            <p className="page-subtitle">각 층별 몬스터의 체력, 방어율 및 특이사항을 확인하세요.</p>

            {/* 검색창 구역 */}
            <div className="toss-card" style={{ marginBottom: '20px' }}>
                <div className="input-group">
                    <label>층수 또는 보스 이름 검색</label>
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        placeholder="예: 40, 매그너스" 
                    />
                </div>
            </div>

            <div className="mulung-table-wrapper">
                <table className="mulung-table">
                    <thead>
                        <tr>
                            <th>층수</th>
                            <th>몬스터</th>
                            <th>레벨</th>
                            <th>체력 (HP)</th>
                            <th>누적 체력</th>
                            <th>방어율</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((data, index) => {
                                // 10층 단위 보스층인지 확인
                                const isBossFloor = data.floor % 10 === 0;
                                // 방어율 100% 이상인지 확인 (문자열에서 % 제거 후 비교)
                                const isHighArmor = parseInt(data.armor.replace('%', '')) >= 100;

                                return (
                                    <tr key={index} className={isBossFloor ? "boss-floor" : ""}>
                                        <td>{data.floor}층</td>
                                        <td style={{ fontWeight: 'bold' }}>{data.name}</td>
                                        <td>{data.level}</td>
                                        <td style={{ color: '#fc8181' }}>{data.hp}</td>
                                        <td>{data.accHp}</td>
                                        <td>
                                            <span className={isHighArmor ? "badge badge-armor-high" : ""}>
                                                {data.armor}
                                            </span>
                                        </td>
                                        <td>
                                            {data.note.includes("모든 속성 반감") ? (
                                                <span className="badge badge-element">모든 속성 반감</span>
                                            ) : (
                                                data.note
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ padding: '40px', color: '#718096' }}>검색 결과가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MuLungDojo;