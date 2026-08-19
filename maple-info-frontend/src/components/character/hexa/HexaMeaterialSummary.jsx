import {
    useMemo,
} from "react";

import {
    calculateHexaCoreCost,
    formatMaterialNumber,
} from "./hexaCoreCost.js";

import {
    mergeLinkedCores,
} from "./hexaUtils.js";

export default function HexaMaterialSummary({
                                                cores = [],
                                            }) {
    const summary = useMemo(
        () =>
            calculateMaterialSummary(
                cores
            ),
        [cores]
    );

    return (
        <article className="hexa-summary-card hexa-material-summary">
            <header className="hexa-material-summary__header">
                <div>
                    <span>
                        HEXA 코어
                    </span>

                    <h3>
                        누적 강화 재료
                    </h3>
                </div>

                <strong>
                    계산{" "}
                    {
                        summary.supportedCount
                    }
                    /
                    {
                        summary.totalCount
                    }
                </strong>
            </header>

            {summary.supportedCount ===
            0 ? (
                <p className="hexa-material-summary__empty">
                    계산 가능한 코어
                    비용표가 없습니다.
                </p>
            ) : (
                <>
                    <MaterialTotalRow
                        label="솔 에르다"
                        used={
                            summary.used
                                .solErda
                        }
                        total={
                            summary.total
                                .solErda
                        }
                        percent={
                            summary
                                .solErdaPercent
                        }
                        color="purple"
                    />

                    <MaterialTotalRow
                        label="솔 에르다 조각"
                        used={
                            summary.used
                                .fragments
                        }
                        total={
                            summary.total
                                .fragments
                        }
                        percent={
                            summary
                                .fragmentPercent
                        }
                        color="blue"
                    />

                    <p className="hexa-material-summary__notice">
                        현재 레벨 기준
                        이론상 누적 필요량이며,
                        비용표가 확인된
                        코어만 합산합니다.
                    </p>
                </>
            )}
        </article>
    );
}

function MaterialTotalRow({
                              label,
                              used,
                              total,
                              percent,
                              color,
                          }) {
    const normalizedPercent =
        Math.min(
            100,
            Math.max(
                0,
                Number(percent) ||
                0
            )
        );

    return (
        <div className="hexa-material-summary__row">
            <header>
                <span>
                    {label}
                </span>

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

            <div
                className={[
                    "hexa-progress",
                    "hexa-material-summary__progress",
                    `hexa-material-summary__progress--${color}`,
                ].join(" ")}
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
        </div>
    );
}

function calculateMaterialSummary(
    cores
) {
    /*
     * 연계 스킬로 인해 중복된 코어를
     * 먼저 하나로 합칩니다.
     */
    const uniqueCores =
        mergeLinkedCores(cores);

    const supportedCosts =
        uniqueCores
            .map(
                calculateHexaCoreCost
            )
            .filter(
                (cost) =>
                    cost.supported
            );

    const used =
        supportedCosts.reduce(
            (
                total,
                current
            ) => ({
                solErda:
                    total.solErda +
                    current.used
                        .solErda,

                fragments:
                    total.fragments +
                    current.used
                        .fragments,
            }),
            {
                solErda: 0,
                fragments: 0,
            }
        );

    const total =
        supportedCosts.reduce(
            (
                result,
                current
            ) => ({
                solErda:
                    result.solErda +
                    current.total
                        .solErda,

                fragments:
                    result.fragments +
                    current.total
                        .fragments,
            }),
            {
                solErda: 0,
                fragments: 0,
            }
        );

    return {
        totalCount:
        uniqueCores.length,

        supportedCount:
        supportedCosts.length,

        used,
        total,

        solErdaPercent:
            calculatePercent(
                used.solErda,
                total.solErda
            ),

        fragmentPercent:
            calculatePercent(
                used.fragments,
                total.fragments
            ),
    };
}

function calculatePercent(
    used,
    total
) {
    if (total <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            (used / total) * 100
        )
    );
}