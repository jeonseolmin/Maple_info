import { useEffect } from "react";
import HexaSkillCard from "./HexaSkillCard.jsx";
import { resolveCoreSkills } from "./hexaUtils.js";

export default function HexaCoreModal({ core, skills = [], onClose }) {
    useEffect(() => {
        if (!core) return undefined;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [core, onClose]);

    if (!core) return null;

    const linkedSkills = resolveCoreSkills(core, skills);
    const linkedSkillIds = core.linkedSkillIds ?? [];
    const matchedNames = new Set(linkedSkills.map((skill) => String(skill.name)));
    const unmatchedIds = linkedSkillIds.filter((id) => !matchedNames.has(String(id)));

    return (
        <div className="hexa-modal" role="presentation" onMouseDown={onClose}>
            <section
                className="hexa-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="hexa-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="hexa-modal__header">
                    <div>
                        <span>{core.originalType || "HEXA 코어"}</span>
                        <h3 id="hexa-modal-title">{core.name}</h3>
                    </div>

                    <div className="hexa-modal__actions">
                        <strong>{core.maxLevel ? "MAX" : `Lv. ${core.level ?? 0}`}</strong>
                        <button type="button" onClick={onClose} aria-label="닫기">×</button>
                    </div>
                </header>

                <div className="hexa-modal__body">
                    <h4>강화되는 스킬</h4>

                    {linkedSkills.length > 0 && (
                        <div className="hexa-modal__skill-list">
                            {linkedSkills.map((skill, index) => (
                                <HexaSkillCard
                                    key={`${skill.name ?? "skill"}-${index}`}
                                    skill={skill}
                                />
                            ))}
                        </div>
                    )}

                    {unmatchedIds.length > 0 && (
                        <div className="hexa-modal__unmatched">
                            <p>상세정보와 연결되지 않은 연계 스킬</p>
                            <ul>
                                {unmatchedIds.map((id, index) => (
                                    <li key={`${id}-${index}`}>{id}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {linkedSkills.length === 0 && unmatchedIds.length === 0 && (
                        <p className="hexa-modal__empty">
                            연결된 스킬 상세정보가 없습니다.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
