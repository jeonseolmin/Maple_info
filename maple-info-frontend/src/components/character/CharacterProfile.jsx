import "./CharacterProfile.css"
export default function CharacterProfile({ character }) {
    const profileStats = [
        {
            label: "레벨",
            value: character.level
                ? `Lv. ${character.level.toLocaleString()}`
                : "-",
        },
        {
            label: "경험치",
            value:
                character.expRate != null
                    ? `${character.expRate.toFixed(3)}%`
                    : "-",
        },
        {
            label: "유니온 아티팩트",
            value:
                character.unionArtifactLevel != null
                    ? `LV. ${character.unionArtifactLevel.toLocaleString()}`
                    : "-",
        },
        {
            label: "유니온",
            value:
                character.unionLevel != null
                    ? `${character.unionLevel.toLocaleString()}`
                    : "-",
        },
        {
            label: "길드",
            value: character.guildName || "없음",
        },
        {
            label: "무릉도장",
            value:
                character.dojangFloor != null
                    ? `${character.dojangFloor}층`
                    : "-",
        },
        {
            label: "월드 랭킹",
            value:
                character.worldRanking != null
                    ? `${Number(character.worldRanking).toLocaleString()}위`
                    : "-",
        },
        {
            label: "인기도",
            value:
                character.popularity != null
                    ? Number(character.popularity).toLocaleString()
                    : "-",
        },
    ];


    return (
        <section className="character-profile">
            {/* 왼쪽: 캐릭터 이미지 */}
            <div className="character-profile__visual">
                <img
                    className="character-profile__image"
                    src={character.characterImage}
                    alt={`${character.characterName} 캐릭터`}
                />
            </div>

            <div className="character-profile__main">
                {/* 기존 서버·이름 영역 */}
                <div className="character-profile__identity">
                    <div className="character-profile__badges">
            <span className="character-profile__badge">
                {character.worldName || "-"}
            </span>
                        <span className="character-profile__badge">
                {character.characterClass || "-"}
            </span>
                    </div>

                    <h1 className="character-profile__name">
                        {character.characterName || "-"}
                    </h1>
                </div>

                {/* 새로 옮긴 정보 8개 */}
                <div className="character-profile__stats">
                    {profileStats.map((stat) => (
                        <article
                            className="character-profile__stat"
                            key={stat.label}
                        >
                <span className="character-profile__stat-label">
                    {stat.label}
                </span>

                            <strong className="character-profile__stat-value">
                                {stat.value}
                            </strong>
                        </article>
                    ))}
                </div>
            </div>

            {/* 오른쪽: 추후 데이터 3개 표시 영역 */}
            <div className="character-profile__summary">
                <div className="character-summary-card">
                    <span>정보 1</span>
                    <strong>-</strong>
                </div>

                <div className="character-summary-card">
                    <span>정보 2</span>
                    <strong>-</strong>
                </div>

                <div className="character-summary-card">
                    <span>정보 3</span>
                    <strong>-</strong>
                </div>
            </div>
        </section>
    );
}