import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./BossEncyclopedia.css";

const CRYSTAL_PRICES = {
  "자쿰": { "카오스": 8080000 },
  "블러디 퀸": { "카오스": 8140000 },
  "반반": { "카오스": 8150000 },
  "피에르": { "카오스": 8170000 },
  "매그너스": { "하드": 8560000 },
  "벨룸": { "카오스": 9280000 },
  "파풀라투스": { "카오스": 13100000 },
  "스우": { "노멀": 16700000, "하드": 51500000, "익스트림": 574000000 },
  "데미안": { "노멀": 17500000, "하드": 48900000 },
  "가디언 엔젤 슬라임": { "노멀": 25500000, "카오스": 75100000 },
  "루시드": { "이지": 29800000, "노멀": 35600000, "하드": 62900000 },
  "윌": { "이지": 32300000, "노멀": 41100000, "하드": 77100000 },
  "더스크": { "노멀": 44000000, "카오스": 69800000 },
  "듄켈": { "노멀": 47500000, "하드": 94400000 },
  "진 힐라": { "노멀": 71200000, "하드": 106000000 },
  "선택받은 세렌": { "노멀": 239000000, "하드": 356000000, "익스트림": 2835000000 },
  "감시자 칼로스": { "이지": 280000000, "노멀": 505000000, "카오스": 1273000000, "익스트림": 4104000000 },
  "최초의 대적자": { "이지": 308000000, "노멀": 560000000, "하드": 1435000000, "익스트림": 4712000000 },
  "카링": { "이지": 377000000, "노멀": 678000000, "하드": 1739000000, "익스트림": 5387000000 },
  "찬란한 흉성": { "노멀": 625000000, "하드": 2678000000 },
  "림보": { "노멀": 1026000000, "하드": 2385000000 },
  "발드릭스": { "노멀": 1368000000, "하드": 3078000000 },
  "유피테르": { "노멀": 1615000000, "하드": 4845000000 },
  "검은 마법사": { "하드": 665000000, "익스트림": 8740000000 },
};

const BossEncyclopedia = () => {
  const [bosses, setBosses] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBossInfo = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:8080/api/bossinfo/data");
        setBosses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("보스 도감 데이터를 불러오는데 실패했습니다:", error);
        setIsLoading(false);
      }
    };
    fetchBossInfo();
  }, []);

  // 메소 단위 변환 (예: 106,000,000 -> 1억 600만)
  const formatMeso = (meso) => {
    if (meso >= 100000000) {
      const uk = Math.floor(meso / 100000000);
      const man = Math.floor((meso % 100000000) / 10000);
      return man > 0 ? `${uk}억 ${man}만` : `${uk}억`;
    }
    return `${(meso / 10000).toLocaleString()}만`;
  };

  const getBossPrices = (bossName) => {
    const cleanName = bossName.trim();
    return CRYSTAL_PRICES[cleanName] || null;
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", backgroundColor: "#1e1f22", color: "#dbdee1", fontFamily: "sans-serif" }}>
      
      <div style={{ width: "320px", backgroundColor: "#2b2d31", borderRight: "1px solid #1e1f22", overflowY: "auto", padding: "15px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", color: "#80848e", padding: "20px" }}>데이터 불러오는 중...</div>
        ) : (
          bosses.map((boss) => (
            <div
              key={boss.id}
              onClick={() => setSelectedBoss(boss)}
              style={{
                display: "flex", alignItems: "center", padding: "12px", marginBottom: "8px", borderRadius: "8px", cursor: "pointer",
                backgroundColor: selectedBoss?.id === boss.id ? "#404249" : "transparent",
                border: selectedBoss?.id === boss.id ? "1px solid #7c8cfa" : "1px solid transparent",
                transition: "background-color 0.2s"
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", marginRight: "15px", overflow: "hidden", flexShrink: 0 }}>
                <img src={`/images/boss/${boss.imageUrl}`} alt={boss.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "1.05rem", fontWeight: "bold", color: "#f2f3f5" }}>{boss.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#b5bac1" }}>{boss.difficulty}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ flex: 1, padding: "40px", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {!selectedBoss ? (
          <div style={{ marginTop: "150px", color: "#80848e", fontSize: "1.2rem" }}>
            좌측 리스트에서 보스를 선택하여 상세 정보를 확인하세요.
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: "800px" }}>
            
            <div style={{ textAlign: "center", marginBottom: "40px", paddingBottom: "30px", borderBottom: "1px solid #3f4147" }}>
              <span style={{ 
                backgroundColor: "#7c8cfa", color: "#ffffff", padding: "6px 14px", 
                borderRadius: "20px", fontSize: "0.9rem", fontWeight: "bold", display: "inline-block", marginBottom: "15px" 
              }}>
                {selectedBoss.difficulty}
              </span>
              <h2 style={{ margin: "0 0 20px 0", fontSize: "2.8rem", color: "#f2f3f5", fontWeight: "900", letterSpacing: "-1px" }}>
                {selectedBoss.name}
              </h2>
              <p style={{ color: "#b5bac1", lineHeight: "1.7", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto", wordBreak: "keep-all" }}>
                {selectedBoss.description}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              
              <div style={{ backgroundColor: "#2b2d31", padding: "24px", borderRadius: "12px", border: "1px solid #3f4147" }}>
                <div style={{ color: "#b5bac1", fontSize: "0.9rem", marginBottom: "8px", fontWeight: "bold" }}>최소 입장 레벨</div>
                <div style={{ color: "#f2f3f5", fontSize: "1.4rem", fontWeight: "bold" }}>Lv. {selectedBoss.entryLevel}</div>
              </div>

              <div style={{ backgroundColor: "#2b2d31", padding: "24px", borderRadius: "12px", border: "1px solid #3f4147" }}>
                <div style={{ color: "#b5bac1", fontSize: "0.9rem", marginBottom: "8px", fontWeight: "bold" }}>방어율</div>
                <div style={{ color: "#f2f3f5", fontSize: "1.4rem", fontWeight: "bold" }}>{selectedBoss.defenseRate}%</div>
              </div>

              {selectedBoss.reqArcaneForce > 0 && (
                <div style={{ backgroundColor: "#f2f3f5", padding: "24px", borderRadius: "12px", border: "2px solid #7c8cfa", gridColumn: "1 / -1" }}>
                  <div style={{ color: "#7c8cfa", fontSize: "0.95rem", marginBottom: "8px", fontWeight: "bold" }}>요구 아케인포스 (ARC)</div>
                  <div style={{ color: "#313338", fontSize: "1.8rem", fontWeight: "900" }}>{selectedBoss.reqArcaneForce}</div>
                </div>
              )}
              {selectedBoss.reqAuthenticForce > 0 && (
                <div style={{ backgroundColor: "#f2f3f5", padding: "24px", borderRadius: "12px", border: "2px solid #f6ad55", gridColumn: "1 / -1" }}>
                  <div style={{ color: "#dd6b20", fontSize: "0.95rem", marginBottom: "8px", fontWeight: "bold" }}>요구 어센틱포스 (AUT)</div>
                  <div style={{ color: "#313338", fontSize: "1.8rem", fontWeight: "900" }}>{selectedBoss.reqAuthenticForce}</div>
                </div>
              )}

              {getBossPrices(selectedBoss.name) && (
                <div style={{ backgroundColor: "#2b2d31", padding: "24px", borderRadius: "12px", border: "1px solid #3f4147", gridColumn: "1 / -1" }}>
                  <div style={{ color: "#b5bac1", fontSize: "0.9rem", marginBottom: "15px", fontWeight: "bold" }}>난이도별 결정석 가격 (2026.08 기준)</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {Object.entries(getBossPrices(selectedBoss.name)).map(([diff, price]) => (
                      <div key={diff} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e1f22", padding: "12px 16px", borderRadius: "8px" }}>
                        <span style={{ color: "#f2f3f5", fontWeight: "bold" }}>{diff}</span>
                        <span style={{ color: "#f6ad55", fontWeight: "bold", fontSize: "1.1rem" }}>{formatMeso(price)} 메소</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ backgroundColor: "#2b2d31", padding: "24px", borderRadius: "12px", border: "1px solid #3f4147", gridColumn: "1 / -1" }}>
                <div style={{ color: "#b5bac1", fontSize: "0.9rem", marginBottom: "8px", fontWeight: "bold" }}>주요 드랍 아이템</div>
                <div style={{ color: "#f2f3f5", fontSize: "1.1rem", fontWeight: "bold", lineHeight: "1.5" }}>
                  {selectedBoss.mainDropItem || "없음"}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BossEncyclopedia;