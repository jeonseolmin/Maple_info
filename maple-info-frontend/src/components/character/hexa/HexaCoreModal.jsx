import { useEffect } from "react";

import HexaSkillCard
    from "./HexaSkillCard.jsx";

import {
    resolveCoreSkills,
} from "./hexaUtils.js";

import {
    calculateHexaCoreCost,
    formatMaterialNumber,
} from "./hexaCoreCost.js";

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

        const handleKeyDown = (
            event
        ) => {
            if (
                event.key ===
                "Escape"
            ) {
                onClose();
            }
        };

        document.body.style.overflow =
            "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [core, onClose]);

    if (!core) {
        return null;
    }

    const linkedSkills =
        resolveCoreSkills(
            core,
            skills
        );

    const linkedSkillIds =
        core.linkedSkillIds ?? [];

    const matchedNames = new Set(
        linkedSkills.map(
            (skill) =>
                String(skill.name)
        )
    );

    const unmatchedIds =
        linkedSkillIds.filter(
            (id) =>
                !matchedNames.has(
                    String(id)
                )
        );

    const cost =
        calculateHexaCoreCost(core);

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
                onMouseDown={(
                    event
                ) =>
                    event.stopPropagation()
                }
            >
                <header className="hexa-modal__header">
                    <div>
                        <span>
                            {core.originalType ||
                                "HEXA 코어"}
                        </span>

                        <h3 id="hexa-modal-title">
                            {core.name}
                        </h3>
                    </div>

                    <div className="hexa-modal__actions">
                        <strong>
                            {core.maxLevel
                                ? "MAX"
                                : `Lv. ${
                                    core.level ??
                                    0
                                } / 30`}
                        </strong>

                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            aria-label="닫기"
                        >
                            ×
                        </button>
                    </div>
                </header>

                <div className="hexa-modal__body">
                    <CoreCostSummary
                        cost={cost}
                    />

                    <section className="hexa-modal__skills">
                        <h4>
                            강화되는 스킬
                        </h4>

                        {linkedSkills.length >
                            0 && (
                                <div className="hexa-modal__skill-list">
                                    {linkedSkills.map(
                                        (
                                            skill,
                                            index
                                        ) => (
                                            <HexaSkillCard
                                                key={`${skill.name ?? "skill"}-${index}`}
                                                skill={
                                                    skill
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}

                        {unmatchedIds.length >
                            0 && (
                                <div className="hexa-modal__unmatched">
                                    <p>
                                        상세정보와
                                        연결되지 않은
                                        연계 스킬
                                    </p>

                                    <ul>
                                        {unmatchedIds.map(
                                            (
                                                id,
                                                index
                                            ) => (
                                                <li
                                                    key={`${id}-${index}`}
                                                >
                                                    {
                                                        id
                                                    }
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                        {linkedSkills.length ===
                            0 &&
                            unmatchedIds.length ===
                            0 && (
                                <p className="hexa-modal__empty">
                                    연결된 스킬
                                    상세정보가
                                    없습니다.
                                </p>
                            )}
                    </section>
                </div>
            </section>
        </div>
    );
}

function CoreCostSummary({ cost }) {
    if (!cost.supported) {
        return (
            <section className="hexa-core-cost hexa-core-cost--unsupported">
                <header>
                    <h4>
                        강화 재료
                    </h4>
                </header>

                <p>
                    이 코어는 아직 검증된
                    강화 비용표가 없습니다.
                </p>
            </section>
        );
    }

    return (
        <section className="hexa-core-cost">
            <header className="hexa-core-cost__header">
                <div>
                    <h4>
                        강화 진행
                    </h4>

                    <span>
                        레벨 기준 누적 필요
                        재료
                    </span>
                </div>

                <strong>
                    Lv.{" "}
                    {cost.currentLevel}
                    {" / "}
                    {cost.maxLevel}
                </strong>
            </header>

            <ProgressBar
                percent={
                    cost.levelPercent
                }
                className="hexa-core-cost__level-progress"
            />

            <div className="hexa-core-cost__materials">
                <MaterialProgress
                    label="솔 에르다"
                    used={
                        cost.used.solErda
                    }
                    total={
                        cost.total.solErda
                    }
                    remaining={
                        cost.remaining
                            .solErda
                    }
                    percent={
                        cost.solErdaPercent
                    }
                    color="purple"
                />

                <MaterialProgress
                    label="솔 에르다 조각"
                    used={
                        cost.used
                            .fragments
                    }
                    total={
                        cost.total
                            .fragments
                    }
                    remaining={
                        cost.remaining
                            .fragments
                    }
                    percent={
                        cost.fragmentPercent
                    }
                    color="blue"
                />
            </div>

            <NextLevelCost
                cost={cost}
            />

            <p className="hexa-core-cost__notice">
                실제 소비 내역이 아니라 현재
                코어 레벨과 강화 비용표를
                기준으로 계산한 값입니다.
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
        <div className="hexa-material">
            <header>
                <span>{label}</span>

                <p>
                    <strong>
                        {formatMaterialNumber(
                            used
                        )}
                    </strong>

                    <span>
                        {" / "}
                        {formatMaterialNumber(
                            total
                        )}
                        개
                    </span>
                </p>
            </header>

            <ProgressBar
                percent={percent}
                className={`hexa-material__progress hexa-material__progress--${color}`}
            />

            <small>
                앞으로{" "}
                {formatMaterialNumber(
                    remaining
                )}
                개 필요
            </small>
        </div>
    );
}

function NextLevelCost({ cost }) {
    if (!cost.next) {
        return (
            <div className="hexa-core-cost__next is-max">
                <span>
                    강화 완료
                </span>

                <strong>
                    MAX
                </strong>
            </div>
        );
    }

    return (
        <div className="hexa-core-cost__next">
            <span>
                다음 레벨 필요
            </span>

            <div>
                <strong>
                    솔 에르다{" "}
                    {formatMaterialNumber(
                        cost.next.solErda
                    )}
                    개
                </strong>

                <strong>
                    조각{" "}
                    {formatMaterialNumber(
                        cost.next.fragments
                    )}
                    개
                </strong>
            </div>
        </div>
    );
}

function ProgressBar({
                         percent,
                         className,
                     }) {
    const normalizedPercent =
        Math.min(
            100,
            Math.max(
                0,
                Number(percent) || 0
            )
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
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(
                normalizedPercent
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