import { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import './UnionChampion.css';
import '../layout/calculator/CalculatorExpectation.css'; 

const UnionChampion = () => {
    // 단일 닉네임에서 여러 닉네임 입력(콤마 구분)을 받도록 변수명 변경
    const [namesInput, setNamesInput] = useState('');
    const [characterList, setCharacterList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!namesInput.trim()) {
            alert("캐릭터 닉네임을 입력해주세요!");
            return;
        }

        // 입력받은 문자열을 콤마(,) 기준으로 쪼개고 공백 제거
        const namesArray = namesInput.split(',').map(n => n.trim()).filter(n => n.length > 0);

        if (namesArray.length === 0) {
            alert("올바른 닉네임을 입력해주세요!");
            return;
        }

        setIsLoading(true);
        try {
            // Spring Boot가 List<String>으로 받을 수 있도록 쿼리 파라미터 조합 (names=캐릭터1&names=캐릭터2)
            const params = new URLSearchParams();
            namesArray.forEach(name => params.append('names', name));

            const response = await axiosInstance.get(`/characters/champion?${params.toString()}`);
            setCharacterList(response.data || []); 
        } catch (error) {
            console.error("캐릭터 정보 조회 실패:", error);
            alert("정보를 불러오지 못했습니다. 백엔드 서버와 API 주소를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="union-champion-container">
            <h2 className="page-title">유니온 챔피언 전적 조회 </h2>
            <p className="page-subtitle">부캐 닉네임들을 콤마(,)로 구분하여 입력하고 주간 보스 클리어 현황을 확인하세요.</p>

            {/* 닉네임 입력창 */}
            <div className="toss-card" style={{ marginBottom: '30px' }}>
                <div className="input-group">
                    <label>부캐 닉네임 목록 (콤마로 구분)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            value={namesInput} 
                            onChange={(e) => setNamesInput(e.target.value)} 
                            placeholder="예: 본캐, 부캐이름2, 부캐이름3" 
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            className="primary-calc-btn" 
                            style={{ width: '120px', marginTop: '0' }}
                            onClick={handleSearch} 
                            disabled={isLoading}
                        >
                            {isLoading ? "조회 중" : "전적 검색"}
                        </button>
                    </div>
                </div>
            </div>

            {/* 캐릭터 리스트 렌더링 */}
            <div className="character-list-wrapper">
                {characterList && characterList.length > 0 ? (
                    characterList.map((char, index) => (
                        <div className="char-card" key={index}>
                            
                            {/* 1. 좌측: 캐릭터 프로필 */}
                            <div className="char-profile-section">
                                <div className="char-avatar-box">
                                    {char.characterImage ? (
                                        <img src={char.characterImage} alt={char.characterName} />
                                    ) : (
                                        <span style={{ fontSize: '2rem' }}>👤</span>
                                    )}
                                </div>
                                
                                <div className="char-info">
                                    <div className="char-name">
                                        <span style={{ color: '#f6ad55', fontSize: '1rem' }}></span> {char.characterName}
                                    </div>
                                    <div className="char-job-level">
                                        {char.job} <span style={{ fontWeight: '400' }}>Lv.{char.level}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 2. 우측: 보스 클리어 상태 리스트 */}
                            <div className="boss-list-section">
                                {char.bossAnalysisList && char.bossAnalysisList.map((boss, bIndex) => (
                                    <div className="boss-item-card" key={bIndex}>
                                        <div className="boss-img-wrapper">
                                            {/* 보스 이미지 경로 연동 */}
                                            <img src={`/images/boss/${boss.imageUrl}`} alt={boss.bossName} />
                                            <span className={`difficulty-badge ${boss.difficulty}`}>
                                                {boss.difficulty}
                                            </span>
                                        </div>
                                        
                                        {/* isCleared 값에 따른 배지 분기 */}
                                        <div className={`status-bar ${boss.isCleared ? 'clear' : 'fail'}`}>
                                            {boss.isCleared ? 'CLEAR' : '불가'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    ))
                ) : (
                    !isLoading && <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>검색된 캐릭터 정보가 없습니다. 닉네임을 확인 후 검색해주세요.</div>
                )}
            </div>
        </div>
    );
};

export default UnionChampion;