import { useEffect, useMemo, useState } from "react";
import { getCharacterSetEffect } from "../../api/characterApi";
import "./CharacterProfile.css";
export default function CharacterProfile({ character }) {
    const [setEffectData, setSetEffectData] = useState(null);

    useEffect(() => {
        if (!character?.ocid) {
            setSetEffectData(null);
            return;
        }

        let cancelled = false;

        const fetchSetEffect = async () => {
            try {
                const data = await getCharacterSetEffect(
                    character.ocid
                );

                if (!cancelled) {
                    setSetEffectData(data);
                }
            } catch (error) {
                console.error(
                    "세트 효과 조회 실패:",
                    error
                );

                if (!cancelled) {
                    setSetEffectData(null);
                }
            }
        };

        fetchSetEffect();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);
    const displayedSetEffects = useMemo(() => {
        const sets = setEffectData?.sets ?? [];

        return [...sets]
            .filter(
                (set) =>
                    set?.setName &&
                    set?.setCount != null
            )
            .sort(
                (a, b) =>
                    (b.setCount ?? 0) -
                    (a.setCount ?? 0)
            )
            .slice(0, 2);
    }, [setEffectData]);
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
                    <span>전투력</span>
                    <strong>
                        {character.combatPower != null
                            ? Number(
                                character.combatPower
                            ).toLocaleString()
                            : "-"}
                    </strong>
                </div>

                <div className="character-summary-card character-summary-card--sets">

                    <div className="character-summary-card__sets">
                        {displayedSetEffects.length > 0 ? (
                            displayedSetEffects.map((set) => (
                                <strong key={set.setName}>
                                    {formatSetName(set.setName)}
                                    <em>{set.setCount}세트</em>
                                </strong>
                            ))
                        ) : (
                            <strong>-</strong>
                        )}
                    </div>
                </div>

                <div className="character-summary-card">
                    <span>심볼</span>
                    <strong>-</strong>
                </div>
            </div>
        </section>
    );
}

function formatSetName(setName) {
    return String(setName ?? "")
        .replace(/\s*세트$/, "")
        .trim();
}