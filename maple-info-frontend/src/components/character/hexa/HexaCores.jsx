import { useCallback, useState } from "react";
import HexaCoreModal from "./HexaCoreModal.jsx";
import { HEXA_CORE_GROUPS } from "./hexaCoreLayout.js";

export default function HexaCores({ groupedCores, skills = [] }) {
    const [selectedCore, setSelectedCore] = useState(null);
    const closeModal = useCallback(() => setSelectedCore(null), []);

    const hasCore = HEXA_CORE_GROUPS.some(
        ({ type }) => (groupedCores?.[type] ?? []).length > 0
    );

    if (!hasCore) {
        return <p className="sixth-job-empty">조회된 HEXA 코어가 없습니다.</p>;
    }

    return (
        <>
            <div className="hexa-matrix-wrapper">
                <div className="hexa-matrix">
                    <div className="hexa-matrix__background">
                        <span className="hexa-matrix__orbit hexa-matrix__orbit--one" />
                        <span className="hexa-matrix__orbit hexa-matrix__orbit--two" />
                    </div>

                    {HEXA_CORE_GROUPS.flatMap(({ id, type, positions }) => {
                        const cores = groupedCores?.[type] ?? [];

                        return positions.map((position, index) => (
                            <HexaCoreNode
                                key={`${id}-${index}`}
                                core={cores[index]}
                                type={type}
                                position={position}
                                onSelect={setSelectedCore}
                            />
                        ));
                    })}

                    <HexaCenter />
                </div>
            </div>

            <HexaCoreModal
                core={selectedCore}
                skills={skills}
                onClose={closeModal}
            />
        </>
    );
}

function HexaCoreNode({ core, type, position, onSelect }) {
    if (!core) {
        return (
            <span
                className={`hexa-core-node hexa-core-node--empty hexa-core-node--${type.toLowerCase()}`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                aria-hidden="true"
            />
        );
    }

    const level = core.level ?? 0;
    const progress = core.maxLevel
        ? 100
        : Math.min(100, Math.max(0, (level / 30) * 100));

    return (
        <button
            type="button"
            className={[
                "hexa-core-node",
                `hexa-core-node--${type.toLowerCase()}`,
                core.maxLevel ? "is-max" : "",
            ].filter(Boolean).join(" ")}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={() => onSelect(core)}
            aria-label={`${core.name} 스킬 상세보기`}
        >
            <span className="hexa-core-node__inner">
                <span className="hexa-core-node__image">
                    {core.icon ? (
                        <img src={core.icon} alt="" loading="lazy" />
                    ) : (
                        <span className="hexa-core-node__fallback" aria-hidden="true">V</span>
                    )}
                </span>

                <span className="hexa-core-node__level">
                    {core.maxLevel ? "MAX" : `Lv.${level}`}
                </span>

                <span className="hexa-core-node__progress">
                    <i style={{ width: `${progress}%` }} />
                </span>
            </span>
        </button>
    );
}

function HexaCenter() {
    return (
        <div className="hexa-matrix__center">
            <div className="hexa-matrix__core-lines" aria-hidden="true">
                <span className="hexa-matrix__core-line hexa-matrix__core-line--skill" />
                <span className="hexa-matrix__core-line hexa-matrix__core-line--mastery" />
                <span className="hexa-matrix__core-line hexa-matrix__core-line--enhancement" />
                <span className="hexa-matrix__core-line hexa-matrix__core-line--common" />
            </div>

            <div className="hexa-matrix__emblem"><span>V</span></div>
        </div>
    );
}
