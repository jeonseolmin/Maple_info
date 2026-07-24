import "./HeroSection.css";

export default function HeroSection() {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <span className="hero-label">메이플스토리 정보 플랫폼</span>

                <h1>
                    메이플의 모든 정보를
                    <br />
                    <strong>한눈에 모바일처럼</strong>
                </h1>

                <p>
                    캐릭터 정보, 랭킹, 장비, 유니온 정보를
                    빠르고 편하게 확인해보세요.
                </p>

                <div className="hero-search">
                    <input
                        type="text"
                        placeholder="캐릭터명을 입력하세요"
                    />

                    <button type="button">검색</button>
                </div>
            </div>

            <div className="hero-visual">
                이미지 영역
            </div>
        </section>
    );
}