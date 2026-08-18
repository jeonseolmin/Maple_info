

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

const HEXA_CORE_LAYOUT = {
    MASTERY: [
        { x: 12, y: 10 },
        { x: 26, y: 10 },
        { x: 19, y: 22 },
        { x: 33, y: 22 },
        { x: 26, y: 34 },
        { x: 40, y: 34 },
    ],

    ENHANCEMENT: [
        { x: 88, y: 10 },
        { x: 74, y: 22 },
        { x: 88, y: 22 },
        { x: 61, y: 34 },
        { x: 75, y: 34 },
    ],

    SKILL: [
        { x: 39, y: 66 },
        { x: 26, y: 78 },
        { x: 12, y: 79 },
        { x: 5, y: 91 },
    ],

    COMMON: [
        { x: 61, y: 66 },
        { x: 74, y: 78 },
        { x: 88, y: 79 },
        { x: 95, y: 91 },
    ],
};

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
        const skills =
            sixthJobData?.skills ?? [];

        const mergedCores =
            mergeLinkedCores(
                sixthJobData?.cores ?? []
            ).map((core) => ({
                ...core,
                icon: findCoreIcon(
                    core,
                    skills
                ),
            }));

        return {
            MASTERY: mergedCores.filter(
                (core) =>
                    core.type === "MASTERY"
            ),

            ENHANCEMENT: mergedCores.filter(
                (core) =>
                    core.type ===
                    "ENHANCEMENT"
            ),

            SKILL: mergedCores.filter(
                (core) =>
                    core.type === "SKILL"
            ),

            COMMON: mergedCores.filter(
                (core) =>
                    core.type === "COMMON" ||
                    core.type === "UNKNOWN"
            ),
        };
    }, [
        sixthJobData?.cores,
        sixthJobData?.skills,
    ]);

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
        [
            ...(sixthJobData?.activeStatCores1 ??
                []),
            ...(sixthJobData?.activeStatCores2 ??
                []),
            ...(sixthJobData?.activeStatCores3 ??
                []),
            ...(sixthJobData?.presetStatCores1 ??
                []),
            ...(sixthJobData?.presetStatCores2 ??
                []),
            ...(sixthJobData?.presetStatCores3 ??
                []),
        ].length > 0;

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
                        activeCores1={
                            sixthJobData
                                .activeStatCores1 ?? []
                        }
                        activeCores2={
                            sixthJobData
                                .activeStatCores2 ?? []
                        }
                        activeCores3={
                            sixthJobData
                                .activeStatCores3 ?? []
                        }
                        presetCores1={
                            sixthJobData
                                .presetStatCores1 ?? []
                        }
                        presetCores2={
                            sixthJobData
                                .presetStatCores2 ?? []
                        }
                        presetCores3={
                            sixthJobData
                                .presetStatCores3 ?? []
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
    const [selectedCore, setSelectedCore] =
        useState(null);

    const types = [
        "MASTERY",
        "ENHANCEMENT",
        "SKILL",
        "COMMON",
    ];

    const hasCore = types.some(
        (type) =>
            groupedCores[type]?.length >
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
        <div className="hexa-matrix-wrapper">
            <div className="hexa-matrix">
                <div className="hexa-matrix__background">
                    <span className="hexa-matrix__orbit hexa-matrix__orbit--one" />
                    <span className="hexa-matrix__orbit hexa-matrix__orbit--two" />
                </div>

                {types.flatMap((type) => {
                    const positions =
                        HEXA_CORE_LAYOUT[
                            type
                            ];

                    const cores =
                        groupedCores[type] ??
                        [];

                    return positions.map(
                        (
                            position,
                            index
                        ) => {
                            const core =
                                cores[index];

                            return (
                                <HexaCoreNode
                                    key={`${type}-${index}`}
                                    core={core}
                                    type={type}
                                    position={
                                        position
                                    }
                                    selected={
                                        selectedCore
                                            ?.name ===
                                        core?.name
                                    }
                                    onSelect={
                                        setSelectedCore
                                    }
                                />
                            );
                        }
                    );
                })}

                <div className="hexa-matrix__center">
                    <span className="hexa-matrix__center-line hexa-matrix__center-line--top" />

                    <div className="hexa-matrix__emblem">
                        <span>V</span>
                    </div>

                    <span className="hexa-matrix__center-line hexa-matrix__center-line--bottom" />
                </div>
            </div>

            <HexaCoreDetail
                core={selectedCore}
            />
        </div>
    );
}
function HexaCoreNode({
                          core,
                          type,
                          position,
                          selected,
                          onSelect,
                      }) {
    const progress =
        core?.maxLevel
            ? 100
            : Math.min(
                100,
                Math.max(
                    0,
                    ((core?.level ?? 0) /
                        30) *
                    100
                )
            );

    if (!core) {
        return (
            <span
                className="hexa-core-node hexa-core-node--empty"
                style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                }}
                aria-hidden="true"
            />
        );
    }

    return (
        <button
            type="button"
            className={[
                "hexa-core-node",
                `hexa-core-node--${type.toLowerCase()}`,
                core.maxLevel
                    ? "is-max"
                    : "",
                selected
                    ? "is-selected"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
            onClick={() =>
                onSelect(
                    selected
                        ? null
                        : core
                )
            }
            aria-label={`${core.name} 상세정보`}
        >
            <span className="hexa-core-node__inner">
    <span className="hexa-core-node__image">
        {core.icon ? (
            <img
                src={core.icon}
                alt=""
                loading="lazy"
            />
        ) : (
            <span
                className="hexa-core-node__fallback"
                aria-hidden="true"
            >
                V
            </span>
        )}
    </span>

    <span className="hexa-core-node__level">
        {core.maxLevel
            ? "MAX"
            : `Lv.${core.level ?? 0}`}
    </span>

    <span className="hexa-core-node__progress">
        <i
            style={{
                width: `${progress}%`,
            }}
        />
    </span>
</span>
        </button>
    );
}


function HexaStats({
                       activeCores1,
                       activeCores2,
                       activeCores3,
                       presetCores1,
                       presetCores2,
                       presetCores3,
                   }) {
    const [mode, setMode] =
        useState("active");

    const [groupNumber, setGroupNumber] =
        useState(1);

    const groups = {
        1: {
            active: activeCores1,
            preset: presetCores1,
        },
        2: {
            active: activeCores2,
            preset: presetCores2,
        },
        3: {
            active: activeCores3,
            preset: presetCores3,
        },
    };

    const visibleCores =
        groups[groupNumber]?.[mode] ?? [];

    return (
        <div className="hexa-stat">
            <div className="hexa-stat__group-tabs">
                {[1, 2, 3].map((number) => {
                    const activeCount =
                        groups[number]
                            ?.active?.length ?? 0;

                    const presetCount =
                        groups[number]
                            ?.preset?.length ?? 0;

                    const hasData =
                        activeCount > 0 ||
                        presetCount > 0;

                    return (
                        <button
                            key={number}
                            type="button"
                            className={
                                groupNumber ===
                                number
                                    ? "is-active"
                                    : ""
                            }
                            onClick={() =>
                                setGroupNumber(
                                    number
                                )
                            }
                        >
                            HEXA 스탯{" "}
                            {toRomanNumber(
                                number
                            )}

                            {hasData && (
                                <span
                                    className="hexa-stat__data-dot"
                                    aria-label="데이터 있음"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

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
                    HEXA 스탯{" "}
                    {toRomanNumber(
                        groupNumber
                    )}의{" "}
                    {mode === "active"
                        ? "현재 적용"
                        : "프리셋"}{" "}
                    정보가 없습니다.
                </p>
            ) : (
                <div className="hexa-stat-grid">
                    {visibleCores.map(
                        (core, index) => (
                            <HexaStatCard
                                key={`${groupNumber}-${core.slotId}-${index}`}
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

function toRomanNumber(number) {
    const romanNumbers = {
        1: "I",
        2: "II",
        3: "III",
    };

    return (
        romanNumbers[number] ??
        String(number)
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
function shortenCoreName(name) {
    if (!name) {
        return "빈 코어";
    }

    return name
        .replace(" 마스터리", "")
        .replace(" 강화", "")
        .trim();
}

function mergeLinkedCores(cores) {
    const coreMap = new Map();

    for (const core of cores) {
        if (!core) {
            continue;
        }

        const key = [
            core.type ?? "UNKNOWN",
            core.name ?? "이름 없음",
        ].join("::");

        const savedCore =
            coreMap.get(key);

        if (!savedCore) {
            coreMap.set(key, {
                ...core,

                linkedSkillIds: [
                    ...new Set(
                        core.linkedSkillIds ??
                        []
                    ),
                ],
            });

            continue;
        }

        coreMap.set(key, {
            ...savedCore,

            /*
             * 중복 데이터가 있으면 높은 레벨을 사용합니다.
             */
            level: Math.max(
                savedCore.level ?? 0,
                core.level ?? 0
            ),

            maxLevel:
                savedCore.maxLevel ||
                core.maxLevel,

            /*
             * 연계 스킬은 중복을 제거하고 합칩니다.
             */
            linkedSkillIds: [
                ...new Set([
                    ...(
                        savedCore.linkedSkillIds ??
                        []
                    ),
                    ...(
                        core.linkedSkillIds ??
                        []
                    ),
                ]),
            ],
        });
    }

    return [...coreMap.values()];
}

function HexaCoreDetail({ core }) {
    if (!core) {
        return (
            <aside className="hexa-core-detail hexa-core-detail--empty">
                육각 코어를 선택하면 연계 스킬을
                확인할 수 있습니다.
            </aside>
        );
    }

    return (
        <aside className="hexa-core-detail">
            <header>
                <div>
                    <span>
                        {core.originalType}
                    </span>

                    <h3>{core.name}</h3>
                </div>

                <strong>
                    {core.maxLevel
                        ? "MAX"
                        : `Lv. ${
                            core.level ?? 0
                        }`}
                </strong>
            </header>

            <section>
                <h4>연계 스킬</h4>

                {core.linkedSkillIds?.length >
                0 ? (
                    <ul>
                        {core.linkedSkillIds.map(
                            (skillName) => (
                                <li
                                    key={
                                        skillName
                                    }
                                >
                                    <span className="hexa-core-detail__skill-icon">
                                        ✦
                                    </span>

                                    <span>
                                        {
                                            skillName
                                        }
                                    </span>
                                </li>
                            )
                        )}
                    </ul>
                ) : (
                    <p>
                        별도의 연계 스킬 정보가
                        없습니다.
                    </p>
                )}
            </section>
        </aside>
    );
}
function findCoreIcon(core, skills) {
    if (!core || skills.length === 0) {
        return null;
    }

    const coreName =
        normalizeSkillName(core.name);

    /*
     * 1순위: 코어 이름과 스킬 이름이 같은 경우
     */
    const exactSkill = skills.find(
        (skill) =>
            normalizeSkillName(
                skill.name
            ) === coreName
    );

    if (exactSkill?.icon) {
        return exactSkill.icon;
    }

    /*
     * 2순위: 한쪽 이름에 다른 이름이 포함된 경우
     */
    const includedSkill = skills.find(
        (skill) => {
            const skillName =
                normalizeSkillName(
                    skill.name
                );

            if (!skillName) {
                return false;
            }

            return (
                coreName.includes(
                    skillName
                ) ||
                skillName.includes(
                    coreName
                )
            );
        }
    );

    if (includedSkill?.icon) {
        return includedSkill.icon;
    }

    /*
     * 3순위: 연계 스킬 값과 이름이 일치하는 경우
     */
    const linkedSkill = skills.find(
        (skill) =>
            core.linkedSkillIds?.some(
                (linkedSkillName) =>
                    normalizeSkillName(
                        linkedSkillName
                    ) ===
                    normalizeSkillName(
                        skill.name
                    )
            )
    );

    return linkedSkill?.icon ?? null;
}

function normalizeSkillName(name) {
    if (!name) {
        return "";
    }

    return name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/vi/g, "")
        .replace(/v/g, "")
        .replace(/hexa/g, "")
        .replace(/헥사/g, "")
        .replace(/마스터리코어/g, "")
        .replace(/강화코어/g, "")
        .replace(/스킬코어/g, "")
        .replace(/공용코어/g, "")
        .replace(/공통코어/g, "")
        .replace(/마스터리/g, "")
        .replace(/강화/g, "")
        .replace(/코어/g, "")
        .replace(/:/g, "")
        .replace(/-/g, "")
        .trim();
}