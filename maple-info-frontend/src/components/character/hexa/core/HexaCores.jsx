import { useCallback, useState } from "react";

import HexaCoreModal from "../modal/HexaCoreModal.jsx";
import { HEXA_CORE_GROUPS } from "./hexaCoreLayout.js";

import "./HexaCores.css";

export default function HexaCores({
                                      groupedCores,
                                      skills = [],
                                  }) {
    const [selectedCore, setSelectedCore] =
        useState(null);

    const closeModal = useCallback(() => {
        setSelectedCore(null);
    }, []);

    const hasCore = HEXA_CORE_GROUPS.some(
        ({ type }) =>
            (groupedCores?.[type] ?? [])
                .length > 0,
    );

    if (!hasCore) {
        return (
            <p className="hexa-matrix-empty">
                조회된 HEXA 코어가 없습니다.
            </p>
        );
    }

    return (
        <>
            <div className="hexa-matrix-wrapper">
                <div className="hexa-matrix">
                    <HexaMatrixBackground />

                    {HEXA_CORE_GROUPS.flatMap(
                        ({
                             id,
                             type,
                             positions,
                         }) => {
                            const cores =
                                groupedCores?.[
                                    type
                                    ] ?? [];

                            return positions.map(
                                (
                                    position,
                                    index,
                                ) => (
                                    <HexaCoreNode
                                        key={`${id}-${index}`}
                                        core={
                                            cores[
                                                index
                                                ]
                                        }
                                        type={
                                            type
                                        }
                                        position={
                                            position
                                        }
                                        onSelect={
                                            setSelectedCore
                                        }
                                    />
                                ),
                            );
                        },
                    )}

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

function HexaMatrixBackground() {
    return (
        <div
            className="hexa-matrix__background"
            aria-hidden="true"
        >
            <span className="hexa-matrix__glow hexa-matrix__glow--purple" />
            <span className="hexa-matrix__glow hexa-matrix__glow--blue" />

            <span className="hexa-matrix__orbit hexa-matrix__orbit--one" />
            <span className="hexa-matrix__orbit hexa-matrix__orbit--two" />
            <span className="hexa-matrix__orbit hexa-matrix__orbit--three" />

            <span className="hexa-matrix__star hexa-matrix__star--one" />
            <span className="hexa-matrix__star hexa-matrix__star--two" />
            <span className="hexa-matrix__star hexa-matrix__star--three" />
            <span className="hexa-matrix__star hexa-matrix__star--four" />
        </div>
    );
}

function HexaCoreNode({
                          core,
                          type,
                          position,
                          onSelect,
                      }) {
    const typeClass =
        type.toLowerCase();

    const positionStyle = {
        left: `${position.x}%`,
        top: `${position.y}%`,
    };

    if (!core) {
        return (
            <span
                className={[
                    "hexa-core-node",
                    "hexa-core-node--empty",
                    `hexa-core-node--${typeClass}`,
                ].join(" ")}
                style={positionStyle}
                aria-hidden="true"
            >
                <span className="hexa-core-node__inner" />
            </span>
        );
    }

    const level = Math.max(
        0,
        Number(core.level) || 0,
    );

    const maxLevel = Math.max(
        1,
        Number(core.maxCoreLevel) || 30,
    );

    const isMax =
        core.maxLevel === true ||
        level >= maxLevel;


    return (
        <button
            type="button"
            className={[
                "hexa-core-node",
                `hexa-core-node--${typeClass}`,
                isMax ? "is-max" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={positionStyle}
            onClick={() => onSelect(core)}
            aria-label={`${core.name ?? "HEXA 코어"} 상세보기`}
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
                    {isMax
                        ? "MAX"
                        : `Lv.${level}`}
                </span>

            </span>
        </button>
    );
}

function HexaCenter() {
    return (
        <div
            className="hexa-matrix__center"
            aria-hidden="true"
        >
            <div className="hexa-matrix__core-lines">
                <span className="hexa-matrix__core-line hexa-matrix__core-line--skill" />
                <span className="hexa-matrix__core-line hexa-matrix__core-line--mastery" />
                <span className="hexa-matrix__core-line hexa-matrix__core-line--enhancement" />
                <span className="hexa-matrix__core-line hexa-matrix__core-line--common" />
            </div>

            <div className="hexa-matrix__emblem">
                <span>V</span>
            </div>
        </div>
    );
}