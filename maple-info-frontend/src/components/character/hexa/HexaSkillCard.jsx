export default function HexaSkillCard({ skill }) {
    return (
        <article className="hexa-skill-card">
            <div className="hexa-skill-card__icon">
                {skill.icon ? (
                    <img src={skill.icon} alt="" loading="lazy" />
                ) : (
                    <span>V</span>
                )}
            </div>

            <div className="hexa-skill-card__content">
                <header>
                    <h4>{skill.name || "이름 없는 스킬"}</h4>
                    <strong>Lv. {skill.level ?? 0}</strong>
                </header>

                {skill.description && <p>{skill.description}</p>}
                {skill.effect && (
                    <div className="hexa-skill-card__effect">{skill.effect}</div>
                )}
                {skill.nextEffect && (
                    <details>
                        <summary>다음 레벨 효과</summary>
                        <p>{skill.nextEffect}</p>
                    </details>
                )}
            </div>
        </article>
    );
}
