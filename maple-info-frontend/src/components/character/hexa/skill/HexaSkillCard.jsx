import "./HexaSkillCard.css";

export default function HexaSkillCard({ skill }) {
    if (!skill) {
        return null;
    }

    const level = Math.max(
        0,
        Number(skill.level) || 0,
    );

    return (
        <article className="hexa-skill-card">
            <SkillIcon
                icon={skill.icon}
                name={skill.name}
            />

            <div className="hexa-skill-card__content">
                <header className="hexa-skill-card__header">
                    <div>
<span className="hexa-skill-card__label">
SIXTH JOB SKILL
</span>

                        <h5>
                            {skill.name ||
                                "이름 없는 스킬"}
                        </h5>
                    </div>

                    <strong className="hexa-skill-card__level">
                        Lv. {level}
                    </strong>
                </header>

                {skill.description && (
                    <p className="hexa-skill-card__description">
                        {skill.description}
                    </p>
                )}

                {skill.effect && (
                    <div className="hexa-skill-card__effect">
                        <span>현재 레벨 효과</span>
                        <p>{skill.effect}</p>
                    </div>
                )}

                {skill.nextEffect && (
                    <details className="hexa-skill-card__next">
                        <summary>
                            다음 레벨 효과
                        </summary>

                        <p>{skill.nextEffect}</p>
                    </details>
                )}
            </div>
        </article>
    );
}

function SkillIcon({ icon, name }) {
    return (
        <div className="hexa-skill-card__icon">
            {icon ? (
                <img
                    src={icon}
                    alt={`${name ?? "6차 스킬"} 아이콘`}
                    loading="lazy"
                />
            ) : (
                <span aria-hidden="true">
V
</span>
            )}
        </div>
    );
}