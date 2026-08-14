

import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { getCharacterSixthJob } from "../../../api/characterApi";
import LoadingIcon from "../../loading/LoadingIcon.jsx";
import "./CharacterSixthJob.css";

const SECTIONS = [
    {
        id: "skills",
        label: "6차 스킬",
    },
    {
        id: "cores",
        label: "HEXA 코어",
    },
    {
        id: "stats",
        label: "HEXA 스탯",
    },
];

const CORE_GROUPS = [
    {
        type: "SKILL",
        title: "스킬 코어",
    },
    {
        type: "MASTERY",
        title: "마스터리 코어",
    },
    {
        type: "ENHANCEMENT",
        title: "강화 코어",
    },
    {
        type: "COMMON",
        title: "공용 코어",
    },
    {
        type: "UNKNOWN",
        title: "기타 코어",
    },
];

export default function CharacterSixthJob({
                                              character,
                                          }) {
    const [sixthJobData, setSixthJobData] =
        useState(null);

    const [activeSection, setActiveSection] =
        useState("skills");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!character?.ocid) {
            setSixthJobData(null);
            setLoading(false);
            setError(
                "캐릭터 식별 정보를 찾을 수 없습니다."
            );
            return;
        }

        let cancelled = false;

        const fetchSixthJob = async () => {
            setLoading(true);
            setError("");
            setActiveSection("skills");

            try {
                const data =
                    await getCharacterSixthJob(
                        character.ocid
                    );

                if (!cancelled) {
                    setSixthJobData(data);
                }
            } catch (requestError) {
                if (!cancelled) {
                    console.error(
                        "6차·HEXA 정보 조회 실패:",
                        requestError
                    );

                    setSixthJobData(null);
                    setError(
                        "6차와 HEXA 정보를 불러오지 못했습니다."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchSixthJob();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    const groupedCores = useMemo(() => {
        const cores =
            sixthJobData?.cores ?? [];

        return Object.fromEntries(
            CORE_GROUPS.map((group) => [
                group.type,
                cores.filter(
                    (core) =>
                        core.type === group.type
                ),
            ])
        );
    }, [sixthJobData?.cores]);

    if (loading) {
        return (
            <div className="sixth-job-loading">
                <LoadingIcon
                    text="6차와 HEXA 정보를 불러오는 중..."
                />
            </div>
        );
    }

    if (error) {
        return (
            <p className="character-content__empty">
                {error}
            </p>
        );
    }

    const hasSixthJobData =
        (sixthJobData?.skills?.length ?? 0) >
        0 ||
        (sixthJobData?.cores?.length ?? 0) >
        0 ||
        (sixthJobData?.activeStatCores
            ?.length ?? 0) > 0;

    if (!hasSixthJobData) {
        return (
            <p className="character-content__empty">
                6차 전직 또는 HEXA 정보가 없습니다.
            </p>
        );
    }

    return (
        <section className="sixth-job-panel">
            <header className="sixth-job-panel__header">
                <div>
                    <h2>6차 · HEXA</h2>

                    <p>
                        6차 스킬과 HEXA 매트릭스
                        성장 정보를 확인할 수 있습니다.
                    </p>
                </div>

                <span>
    코어{" "}
                    {sixthJobData.cores?.length ??
                        0}
                    개
    </span>
            </header>

            <div
                className="sixth-job-sections"
                role="tablist"
                aria-label="6차 정보 종류"
            >
                {SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        role="tab"
                        aria-selected={
                            activeSection ===
                            section.id
                        }
                        className={
                            activeSection ===
                            section.id
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection(
                                section.id
                            )
                        }
                    >
                        {section.label}
                    </button>
                ))}
            </div>

            <div
                className="sixth-job-content"
                role="tabpanel"
            >
                {activeSection === "skills" && (
                    <SixthJobSkills
                        skills={
                            sixthJobData.skills ??
                            []
                        }
                    />
                )}

                {activeSection === "cores" && (
                    <HexaCores
                        groupedCores={
                            groupedCores
                        }
                    />
                )}

                {activeSection === "stats" && (
                    <HexaStats
                        activeCores={
                            sixthJobData
                                .activeStatCores ??
                            []
                        }
                        presetCores={
                            sixthJobData
                                .presetStatCores ??
                            []
                        }
                    />
                )}
            </div>
        </section>
    );
}

function SixthJobSkills({ skills }) {
    if (skills.length === 0) {
        return (
            <p className="sixth-job-empty">
                조회된 6차 스킬이 없습니다.
            </p>
        );
    }

    return (
        <div className="sixth-skill-grid">
            {skills.map((skill) => (
                <article
                    key={skill.name}
                    className="sixth-skill-card"
                >
                    <div className="sixth-skill-card__header">
                        <div className="sixth-skill-card__icon">
                            {skill.icon ? (
                                <img
                                    src={skill.icon}
                                    alt=""
                                />
                            ) : (
                                <span>
이미지 없음
</span>
                            )}
                        </div>

                        <div>
                            <strong>
                                {skill.name}
                            </strong>

                            <span>
Lv.{" "}
                                {skill.level ?? 0}
</span>
                        </div>
                    </div>

                    {skill.effect && (
                        <p className="sixth-skill-card__effect">
                            {skill.effect}
                        </p>
                    )}

                    {(skill.description ||
                        skill.nextEffect) && (
                        <details className="sixth-skill-card__detail">
                            <summary>
                                상세정보
                            </summary>

                            {skill.description && (
                                <p>
                                    {
                                        skill.description
                                    }
                                </p>
                            )}

                            {skill.nextEffect && (
                                <p>
                                    다음 레벨:{" "}
                                    {
                                        skill.nextEffect
                                    }
                                </p>
                            )}
                        </details>
                    )}
                </article>
            ))}
        </div>
    );
}

function HexaCores({ groupedCores }) {
    const hasCore = CORE_GROUPS.some(
        (group) =>
            groupedCores[group.type]?.length >
            0
    );

    if (!hasCore) {
        return (
            <p className="sixth-job-empty">
                조회된 HEXA 코어가 없습니다.
            </p>
        );
    }

    return (
        <div className="hexa-core-groups">
            {CORE_GROUPS.map((group) => {
                const cores =
                    groupedCores[group.type] ??
                    [];

                if (cores.length === 0) {
                    return null;
                }

                return (
                    <section
                        key={group.type}
                        className="hexa-core-group"
                    >
                        <header>
                            <h3>{group.title}</h3>

                            <span>
{cores.length}개
</span>
                        </header>

                        <div className="hexa-core-grid">
                            {cores.map((core) => (
                                <HexaCoreCard
                                    key={`${core.type}-${core.name}`}
                                    core={core}
                                />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

function HexaCoreCard({ core }) {
    const progress =
        core.maxLevel
            ? 100
            : Math.min(
                100,
                Math.max(
                    0,
                    ((core.level ?? 0) /
                        30) *
                    100
                )
            );

    return (
        <article className="hexa-core-card">
            <div className="hexa-core-card__header">
                <div>
                    <strong>{core.name}</strong>

                    <span>
{core.originalType}
</span>
                </div>

                <b>
                    {core.maxLevel
                        ? "MAX"
                        : `Lv. ${
                            core.level ?? 0
                        }`}
                </b>
            </div>

            <div
                className="hexa-core-card__progress"
                role="progressbar"
                aria-label={`${core.name} 레벨`}
                aria-valuemin="0"
                aria-valuemax="30"
                aria-valuenow={
                    core.level ?? 0
                }
            >
<span
    style={{
        width: `${progress}%`,
    }}
/>
            </div>

            {core.linkedSkillIds?.length >
                0 && (
                    <div className="hexa-core-card__skills">
                        {core.linkedSkillIds.map(
                            (skillId) => (
                                <span key={skillId}>
                   {skillId}
</span>
                            )
                        )}
                    </div>
                )}
        </article>
    );
}

function HexaStats({
                       activeCores,
                       presetCores,
                   }) {
    const [mode, setMode] =
        useState("active");

    const visibleCores =
        mode === "preset"
            ? presetCores
            : activeCores;

    return (
        <div className="hexa-stat">
            <div className="hexa-stat__mode">
                <button
                    type="button"
                    className={
                        mode === "active"
                            ? "is-active"
                            : ""
                    }
                    onClick={() =>
                        setMode("active")
                    }
                >
                    현재 적용
                </button>

                <button
                    type="button"
                    className={
                        mode === "preset"
                            ? "is-active"
                            : ""
                    }
                    onClick={() =>
                        setMode("preset")
                    }
                >
                    프리셋
                </button>
            </div>

            {visibleCores.length === 0 ? (
                <p className="sixth-job-empty">
                    조회된 HEXA 스탯이 없습니다.
                </p>
            ) : (
                <div className="hexa-stat-grid">
                    {visibleCores.map(
                        (core, index) => (
                            <HexaStatCard
                                key={`${core.slotId}-${index}`}
                                core={core}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function HexaStatCard({ core }) {
    return (
        <article className="hexa-stat-card">
            <header>
    <span>
    슬롯 {core.slotId}
</span>

                <strong>
                    등급 {core.grade}
                </strong>
            </header>

            <div className="hexa-stat-card__total">
                총 레벨{" "}
                <strong>
                    {core.totalLevel}
                </strong>
            </div>

            <StatRow
                label="메인"
                name={core.mainStatName}
                level={core.mainStatLevel}
                main
            />

            <StatRow
                label="서브 1"
                name={core.firstSubStatName}
                level={
                    core.firstSubStatLevel
                }
            />

            <StatRow
                label="서브 2"
                name={core.secondSubStatName}
                level={
                    core.secondSubStatLevel
                }
            />
        </article>
    );
}

function StatRow({
                     label,
                     name,
                     level,
                     main = false,
                 }) {
    return (
        <div
            className={[
                "hexa-stat-row",
                main
                    ? "hexa-stat-row--main"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span>{label}</span>

            <p>{name || "-"}</p>

            <strong>
                Lv. {level ?? 0}
            </strong>
        </div>
    );
}