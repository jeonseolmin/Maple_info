export default function CharacterProfile({ character }) {
    return (
        <section className="character-profile">
            <div className="character-profile__image">
                <img
                    src={character.characterImage}
                    alt={`${character.characterName} 캐릭터`}
                />
            </div>

            <div className="character-profile__info">
                <span>{character.worldName}</span>

                <h1>{character.characterName}</h1>

                <p>
                    Lv. {character.level}
                    {" · "}
                    {character.characterClass}
                </p>

                <p>
                    길드: {character.guildName || "가입하지 않음"}
                </p>

                <p>
                    경험치: {character.expRate}%
                </p>
            </div>
        </section>
    );
}