import { useEffect } from "react";

import HexaSkillCard from "../skill/HexaSkillCard.jsx";

import {
    resolveCoreSkills,
} from "../utils/hexaUtils.js";

import {
    calculateHexaCoreCost,
    formatMaterialNumber,
} from "../material/hexaCoreCost.js";

import "./HexaCoreModal.css";

export default function HexaCoreModal({
                                          core,
                                          skills = [],
                                          onClose,
                                      }) {
    useEffect(() => {
        if (!core) {
            return undefined;
        }

        const previousOverflow =
            document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [core, onClose]);

    if (!core) {
        return null;
    }

    const linkedSkills = resolveCoreSkills(
        core,
        skills,
    );

    const linkedSkillIds =
        core.linkedSkillIds ?? [];

    const matchedNames = new Set(
        linkedSkills.map((skill) =>
            String(skill.name),
        ),
    );

    const unmatchedIds = linkedSkillIds.filter(
        (id) => !matchedNames.has(String(id)),
    );

    const cost = calculateHexaCoreCost(core);

    const currentLevel = Math.max(
        0,
        Number(core.level) || 0,
    );

    const maxLevel = Math.max(
        1,
        Number(core.maxCoreLevel) || 30,
    );

    const isMax =
        core.maxLevel === true ||
        currentLevel >= maxLevel;

    return (
        <div
            className="hexa-modal"
            role="presentation"
            onMouseDown={onClose}
        >
            <section
                className="hexa-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="hexa-modal-title"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <header className="hexa-modal__header">
                    <CoreIdentity
                        core={core}
                        currentLevel={currentLevel}
                        maxLevel={maxLevel}
                        isMax={isMax}
                    />

                    <button
                        type="button"
                        className="hexa-modal__close"
                        onClick={onClose}
                        aria-label="HEXA 코어 상세 닫기"
                    >
                        ×
                    </button>
                </header>

                <div className="hexa-modal__body">
                    <CoreCostSummary cost={cost} />

                    <LinkedSkillSection
                        linkedSkills={linkedSkills}
                        unmatchedIds={unmatchedIds}
                    />
                </div>
            </section>
        </div>
    );
}

function CoreIdentity({
                          core,
                          currentLevel,
                          maxLevel,
                          isMax,
                      }) {
    return (
        <div className="hexa-modal__identity">
            <div className="hexa-modal__core-icon">
                {core.icon ? (
                    <img
                        src={core.icon}
                        alt=""
                    />
                ) : (
                    <span aria-hidden="true">
                        V
                    </span>
                )}
            </div>

            <div className="hexa-modal__title-group">
                <span className="hexa-modal__type">
                    {core.originalType ||
                        core.type ||
                        "HEXA 코어"}
                </span>

                <h3 id="hexa-modal-title">
                    {core.name ?? "HEXA 코어"}
                </h3>

                <strong className="hexa-modal__level">
                    {isMax
                        ? "MAX"
                        : `Lv. ${currentLevel} / ${maxLevel}`}
                </strong>
            </div>
        </div>
    );
}

function LinkedSkillSection({
                                linkedSkills,
                                unmatchedIds,
                            }) {
    const hasLinkedSkill =
        linkedSkills.length > 0;

    const hasUnmatchedSkill =
        unmatchedIds.length > 0;

    return (
        <section className="hexa-modal__skills">
            <header className="hexa-modal__section-header">
                <div>
                    <span>LINKED SKILLS</span>
                    <h4>강화되는 스킬</h4>
                </div>

                <strong>
                    {linkedSkills.length}개
                </strong>
            </header>

            {hasLinkedSkill && (
                <div className="hexa-modal__skill-list">
                    {linkedSkills.map(
                        (skill, index) => (
                            <HexaSkillCard
                                key={`${skill.name ?? "skill"}-${index}`}
                                skill={skill}
                            />
                        ),
                    )}
                </div>
            )}

            {hasUnmatchedSkill && (
                <div className="hexa-modal__unmatched">
                    <p>
                        상세정보와 연결되지 않은
                        연계 스킬
                    </p>

                    <ul>
                        {unmatchedIds.map(
                            (id, index) => (
                                <li
                                    key={`${id}-${index}`}
                                >
                                    {id}
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            )}

            {!hasLinkedSkill &&
                !hasUnmatchedSkill && (
                    <p className="hexa-modal__empty">
                        연결된 스킬 상세정보가
                        없습니다.
                    </p>
                )}
        </section>
    );
}

function CoreCostSummary({ cost }) {
    if (!cost?.supported) {
        return (
            <section className="hexa-core-cost hexa-core-cost--unsupported">
                <header className="hexa-modal__section-header">
                    <div>
                        <span>MATERIAL</span>
                        <h4>강화 재료</h4>
                    </div>
                </header>

                <p>
                    이 코어는 아직 검증된 강화
                    비용표가 없습니다.
                </p>
            </section>
        );
    }

    return (
        <section className="hexa-core-cost">
            <header className="hexa-core-cost__header">
                <div>
                    <span>MATERIAL PROGRESS</span>
                    <h4>강화 진행</h4>
                    <p>
                        현재 레벨까지 사용한 것으로
                        계산되는 누적 재료입니다.
                    </p>
                </div>

                <strong>
                    Lv. {cost.currentLevel}
                    {" / "}
                    {cost.maxLevel}
                </strong>
            </header>

            <ProgressBar
                percent={cost.levelPercent}
                className="hexa-core-cost__level-progress"
                label="코어 레벨 진행률"
            />

            <div className="hexa-core-cost__materials">
                <MaterialProgress
                    label="솔 에르다"
                    used={cost.used.solErda}
                    total={cost.total.solErda}
                    remaining={
                        cost.remaining.solErda
                    }
                    percent={
                        cost.solErdaPercent
                    }
                    color="purple"
                />

                <MaterialProgress
                    label="솔 에르다 조각"
                    used={cost.used.fragments}
                    total={cost.total.fragments}
                    remaining={
                        cost.remaining.fragments
                    }
                    percent={
                        cost.fragmentPercent
                    }
                    color="blue"
                />
            </div>

            <NextLevelCost cost={cost} />

            <p className="hexa-core-cost__notice">
                실제 소비 기록이 아니라 현재 코어
                레벨과 강화 비용표를 기준으로 계산한
                값입니다.
            </p>
        </section>
    );
}

function MaterialProgress({
                              label,
                              used,
                              total,
                              remaining,
                              percent,
                              color,
                          }) {
    return (
        <article className="hexa-material">
            <header>
                <span>{label}</span>

                <p>
                    <strong>
                        {formatMaterialNumber(used)}
                    </strong>

                    <span>
                        {" / "}
                        {formatMaterialNumber(total)}
                    </span>
                </p>
            </header>

            <ProgressBar
                percent={percent}
                className={[
                    "hexa-material__progress",
                    `hexa-material__progress--${color}`,
                ].join(" ")}
                label={`${label} 사용 진행률`}
            />

            <small>
                앞으로{" "}
                <strong>
                    {formatMaterialNumber(
                        remaining,
                    )}
                </strong>
                개 필요
            </small>
        </article>
    );
}

function NextLevelCost({ cost }) {
    if (!cost.next) {
        return (
            <div className="hexa-core-cost__next is-max">
                <span>강화 완료</span>
                <strong>MAX</strong>
            </div>
        );
    }

    return (
        <div className="hexa-core-cost__next">
            <span>다음 레벨 필요 재료</span>

            <div>
                <strong>
                    솔 에르다{" "}
                    {formatMaterialNumber(
                        cost.next.solErda,
                    )}
                    개
                </strong>

                <strong>
                    조각{" "}
                    {formatMaterialNumber(
                        cost.next.fragments,
                    )}
                    개
                </strong>
            </div>
        </div>
    );
}

function ProgressBar({
                         percent,
                         className = "",
                         label,
                     }) {
    const normalizedPercent = Math.min(
        100,
        Math.max(
            0,
            Number(percent) || 0,
        ),
    );

    return (
        <div
            className={[
                "hexa-progress",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            role="progressbar"
            aria-label={label}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(
                normalizedPercent,
            )}
        >
            <span
                style={{
                    width: `${normalizedPercent}%`,
                }}
            />
        </div>
    );
}