import {
    useMemo,
    useState,
} from "react";

import {
    assignHexaCostTypes,
    calculateHexaCoreCost,
    formatMaterialNumber,
} from "./hexaCoreCost.js";

import {
    mergeLinkedCores,
} from "../utils/hexaUtils.js";

import "./HexaMaterialSummary.css";

export default function HexaMaterialSummary({
                                                cores = [],
                                                statCoreGroups = [],
                                            }) {
    const [summaryMode, setSummaryMode] =
        useState("ALL");

    const summaries = useMemo(
        () =>
            calculateMaterialSummaries(
                cores,
                statCoreGroups,
            ),
        [
            cores,
            statCoreGroups,
        ],
    );

    const summary =
        summaryMode === "SPEC"
            ? summaries.spec
            : summaries.all;

    return (
        <article className="hexa-summary-card hexa-material-summary">
            <header className="hexa-material-summary__header">
                <div>
                    <span>HEXA MATERIAL</span>
                    <h3>누적 강화 재료</h3>
                </div>

                <strong>
                    계산 {summary.supportedCount}
                    {" / "}
                    {summary.totalCount}
                </strong>
            </header>

            <div
                className="hexa-material-summary__modes"
                role="tablist"
                aria-label="강화 재료 계산 범위"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={
                        summaryMode === "ALL"
                    }
                    className={
                        summaryMode === "ALL"
                            ? "is-active"
                            : ""
                    }
                    onClick={() =>
                        setSummaryMode("ALL")
                    }
                >
                    전체 강화
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={
                        summaryMode === "SPEC"
                    }
                    className={
                        summaryMode === "SPEC"
                            ? "is-active"
                            : ""
                    }
                    onClick={() =>
                        setSummaryMode("SPEC")
                    }
                >
                    스펙 반영
                </button>
            </div>

            {summary.supportedCount === 0 ? (
                <EmptyMaterialSummary />
            ) : (
                <>
                    <div className="hexa-material-summary__breakdown">
                        <SummaryBreakdown
                            label="코어 강화"
                            value={
                                summary.coreTotal
                                    .solErda
                            }
                        />

                        <SummaryBreakdown
                            label="스탯 해금"
                            value={
                                summary.statTotal
                                    .solErda
                            }
                        />
                    </div>

                    <MaterialTotalRow
                        label="솔 에르다"
                        used={summary.used.solErda}
                        total={summary.total.solErda}
                        remaining={
                            summary.remaining.solErda
                        }
                        percent={
                            summary.solErdaPercent
                        }
                        color="purple"
                    />

                    <MaterialTotalRow
                        label="솔 에르다 조각"
                        used={
                            summary.used.fragments
                        }
                        total={
                            summary.total.fragments
                        }
                        remaining={
                            summary.remaining.fragments
                        }
                        percent={
                            summary.fragmentPercent
                        }
                        color="blue"
                    />

                    <p className="hexa-material-summary__notice">
                        {summaryMode === "SPEC"
                            ? "솔 야누스를 제외하고 스펙에 반영되는 코어와 HEXA 스탯 해금 비용을 계산합니다."
                            : "솔 야누스를 포함한 모든 코어와 HEXA 스탯 해금 비용을 계산합니다."}
                    </p>
                </>
            )}
        </article>
    );
}

function EmptyMaterialSummary() {
    return (
        <div className="hexa-material-summary__empty">
            <span aria-hidden="true">
                V
            </span>

            <p>
                계산 가능한 코어 비용표가
                없습니다.
            </p>
        </div>
    );
}

function MaterialTotalRow({
                              label,
                              used,
                              total,
                              remaining,
                              percent,
                              color,
                          }) {
    const normalizedPercent = normalizePercent(
        percent,
    );

    return (
        <div className="hexa-material-summary__row">
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

            <div
                className={[
                    "hexa-material-summary__progress",
                    `hexa-material-summary__progress--${color}`,
                ].join(" ")}
                role="progressbar"
                aria-label={`${label} 사용 진행률`}
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

            <div className="hexa-material-summary__remaining">
                <span>남은 필요량</span>

                <strong>
                    {formatMaterialNumber(
                        remaining,
                    )}
                    개
                </strong>
            </div>
        </div>
    );
}

const STAT_CORE_UNLOCK_COSTS = [
    5,
    10,
    15,
];

function calculateMaterialSummaries(
    cores,
    statCoreGroups,
) {
    const safeCores = Array.isArray(cores)
        ? cores
        : [];

    const uniqueCores =
        mergeLinkedCores(safeCores);

    const costTypedCores =
        assignHexaCostTypes(uniqueCores);

    const unlockedStatCoreCount =
        countUnlockedStatCores(
            statCoreGroups,
        );

    return {
        all: calculateMaterialSummary({
            cores: costTypedCores,
            unlockedStatCoreCount,
            excludeSolJanus: false,
        }),

        spec: calculateMaterialSummary({
            cores: costTypedCores,
            unlockedStatCoreCount,
            excludeSolJanus: true,
        }),
    };
}

function calculateMaterialSummary({
                                      cores,
                                      unlockedStatCoreCount,
                                      excludeSolJanus,
                                  }) {
    const targetCores = excludeSolJanus
        ? cores.filter(
            (core) => !isSolJanus(core),
        )
        : cores;

    const supportedCosts = targetCores
        .map((core) =>
            calculateHexaCoreCost(core),
        )
        .filter((cost) => cost.supported);

    const coreUsed = sumMaterials(
        supportedCosts,
        "used",
    );

    const coreTotal = sumMaterials(
        supportedCosts,
        "total",
    );

    const statUsedSolErda =
        STAT_CORE_UNLOCK_COSTS
            .slice(
                0,
                unlockedStatCoreCount,
            )
            .reduce(
                (total, current) =>
                    total + current,
                0,
            );

    /*
     * 스탯 코어 1·2·3의 최대 해금 비용입니다.
     * 5 + 10 + 15 = 30
     */
    const statTotalSolErda =
        STAT_CORE_UNLOCK_COSTS.reduce(
            (total, current) =>
                total + current,
            0,
        );

    const statUsed = {
        solErda: statUsedSolErda,
        fragments: 0,
    };

    const statTotal = {
        solErda: statTotalSolErda,
        fragments: 0,
    };

    const used = {
        solErda:
            coreUsed.solErda +
            statUsed.solErda,

        fragments:
        coreUsed.fragments,
    };

    const total = {
        solErda:
            coreTotal.solErda +
            statTotal.solErda,

        fragments:
        coreTotal.fragments,
    };

    const remaining = {
        solErda: Math.max(
            0,
            total.solErda -
            used.solErda,
        ),

        fragments: Math.max(
            0,
            total.fragments -
            used.fragments,
        ),
    };

    return {
        totalCount: targetCores.length,
        supportedCount:
        supportedCosts.length,

        coreUsed,
        coreTotal,
        statUsed,
        statTotal,

        used,
        total,
        remaining,

        solErdaPercent:
            calculatePercent(
                used.solErda,
                total.solErda,
            ),

        fragmentPercent:
            calculatePercent(
                used.fragments,
                total.fragments,
            ),
    };
}

function sumMaterials(
    costs,
    property,
) {
    return costs.reduce(
        (total, current) => ({
            solErda:
                total.solErda +
                current[property].solErda,

            fragments:
                total.fragments +
                current[property].fragments,
        }),
        {
            solErda: 0,
            fragments: 0,
        },
    );
}

function countUnlockedStatCores(
    statCoreGroups,
) {
    if (!Array.isArray(statCoreGroups)) {
        return 0;
    }

    return Math.min(
        STAT_CORE_UNLOCK_COSTS.length,
        statCoreGroups.filter(
            (group) =>
                Array.isArray(group) &&
                group.length > 0,
        ).length,
    );
}

function isSolJanus(core) {
    const name = String(
        core?.name ?? "",
    ).replace(/\s+/g, "");

    return name.includes("솔야누스");
}

function calculatePercent(used, total) {
    if (total <= 0) {
        return 0;
    }

    return normalizePercent(
        (used / total) * 100,
    );
}

function normalizePercent(value) {
    return Math.min(
        100,
        Math.max(
            0,
            Number(value) || 0,
        ),
    );
}
function SummaryBreakdown({
                              label,
                              value,
                          }) {
    return (
        <div>
            <span>{label}</span>

            <strong>
                {formatMaterialNumber(value)}
            </strong>
        </div>
    );
}