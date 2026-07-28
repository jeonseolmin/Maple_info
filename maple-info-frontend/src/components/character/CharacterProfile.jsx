import "./CharacterProfile.css";

export default function CharacterProfile({ character }) {
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

            {/* 가운데: 기본 정보 */}
            <div className="character-profile__info">
                <div className="character-profile__badges">
                    <span className="character-profile__world">
                        {character.worldName}
                    </span>

                    <span className="character-profile__class">
                        {character.characterClass}
                    </span>
                </div>

                <h1 className="character-profile__name">
                    {character.characterName}
                </h1>

                <div className="character-profile__details">
                    <p>
                        <span>레벨</span>
                        <strong>Lv. {character.level}</strong>
                    </p>

                    <p>
                        <span>전직</span>
                        <strong>
                            {character.characterClassLevel || "-"}
                        </strong>
                    </p>

                    <p>
                        <span>길드</span>
                        <strong>
                            {character.guildName || "가입하지 않음"}
                        </strong>
                    </p>

                    <p>
                        <span>경험치</span>
                        <strong>{character.expRate ?? 0}%</strong>
                    </p>
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