import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./BossEncyclopedia.css";

const BossEncyclopedia = () => {
  const [bosses, setBosses] = useState([]);
  const [selectedBoss, setSelectedBoss] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBossInfo = async () => {
      try {
        // 방금 만든 백엔드 도감 API 호출!
        const response = await axiosInstance.get(
          "http://localhost:8080/api/bossinfo/data",
        );
        setBosses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("보스 도감 데이터를 불러오는데 실패했습니다:", error);
        setIsLoading(false);
      }
    };

    fetchBossInfo();
  }, []);

  return (
    <div className="encyclopedia-container">
      {/* 좌측: 보스 리스트 */}
      <div className="boss-list-sidebar">
        <h2 style={{ padding: "0 10px", marginBottom: "10px" }}>
          📖 보스 도감
        </h2>
        {isLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            데이터 불러오는 중...
          </div>
        ) : (
          bosses.map((boss) => (
            <div
              key={boss.id}
              className={`boss-list-item ${selectedBoss?.id === boss.id ? "active" : ""}`}
              onClick={() => setSelectedBoss(boss)}
            >
              {/* 이미지가 있다면 보여주고, 없다면 빈 원형 플레이스홀더를 보여줍니다. */}
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px" /* 50% 대신 12px로 둥근 사각형 만들기 */,
                  marginRight: "16px",
                  flexShrink: 0,
                  overflow: "hidden",
                  border:
                    "1px solid rgba(255, 255, 255, 0.1)" /* 다크모드용 은은한 테두리 */,
                }}
              >
                <img
                  src={`/images/boss/${boss.imageUrl}`}
                  alt={boss.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div className="boss-list-name">{boss.name}</div>
                <div className="boss-list-diff">{boss.difficulty}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 우측: 보스 상세 정보 */}
      <div className="boss-detail-panel">
        {!selectedBoss ? (
          <div className="boss-detail-placeholder">
            좌측 리스트에서 보스를 선택하여 상세 정보를 확인하세요.
          </div>
        ) : (
          <>
            <div className="boss-detail-header">
              <span className="boss-badge">{selectedBoss.difficulty}</span>
              <h2 className="boss-detail-title">{selectedBoss.name}</h2>
            </div>

            <p className="boss-desc">{selectedBoss.description}</p>

            <div className="boss-spec-grid">
              <div className="spec-card">
                <div className="spec-label">최소 입장 레벨</div>
                <div className="spec-value">Lv. {selectedBoss.entryLevel}</div>
              </div>
              <div className="spec-card">
                <div className="spec-label">방어율</div>
                <div className="spec-value">{selectedBoss.defenseRate}%</div>
              </div>

              {/* 아케인포스가 0 이상일 때만 표시 */}
              {selectedBoss.reqArcaneForce > 0 && (
                <div
                  className="spec-card"
                  style={{ borderColor: "#9f7aea", backgroundColor: "#faf5ff" }}
                >
                  <div className="spec-label" style={{ color: "#805ad5" }}>
                    요구 아케인포스 (ARC)
                  </div>
                  <div className="spec-value" style={{ color: "#553c9a" }}>
                    {selectedBoss.reqArcaneForce}
                  </div>
                </div>
              )}

              {/* 어센틱포스가 0 이상일 때만 표시 */}
              {selectedBoss.reqAuthenticForce > 0 && (
                <div
                  className="spec-card"
                  style={{ borderColor: "#f6ad55", backgroundColor: "#fffaf0" }}
                >
                  <div className="spec-label" style={{ color: "#dd6b20" }}>
                    요구 어센틱포스 (AUT)
                  </div>
                  <div className="spec-value" style={{ color: "#c05621" }}>
                    {selectedBoss.reqAuthenticForce}
                  </div>
                </div>
              )}

              <div className="spec-card" style={{ gridColumn: "1 / -1" }}>
                <div className="spec-label">🎁 주요 드랍 아이템</div>
                <div
                  className="spec-value"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  {selectedBoss.mainDropItem}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BossEncyclopedia;
