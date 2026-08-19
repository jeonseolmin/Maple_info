import { useMemo } from "react";

import {
    calculateHexaCoreCost,
    formatMaterialNumber,
} from "./hexaCoreCost.js";

import {
    mergeLinkedCores,
} from "../utils/hexaUtils.js";

import "./HexaMaterialSummary.css";

export default function HexaMaterialSummary({
                                                cores = [],
                                            }) {
    const summary = useMemo(
        () => calculateMaterialSummary(cores),
        [cores],
    );

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

            {summary.supportedCount === 0 ? (
                <EmptyMaterialSummary />
            ) : (
                <>
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
                        현재 코어 레벨과 비용표를
                        기준으로 계산한 이론상 누적
                        필요량입니다.
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

function calculateMaterialSummary(cores) {
    const safeCores = Array.isArray(cores)
        ? cores
        : [];

    /*
     * 하나의 코어에 여러 연계 스킬이 포함된 경우
     * 같은 코어를 중복 계산하지 않도록 먼저 합칩니다.
     */
    const uniqueCores =
        mergeLinkedCores(safeCores);

    const supportedCosts = uniqueCores
        .map((core) =>
            calculateHexaCoreCost(core),
        )
        .filter((cost) => cost.supported);

    const used = supportedCosts.reduce(
        (total, current) => ({
            solErda:
                total.solErda +
                current.used.solErda,

            fragments:
                total.fragments +
                current.used.fragments,
        }),
        {
            solErda: 0,
            fragments: 0,
        },
    );

    const total = supportedCosts.reduce(
        (result, current) => ({
            solErda:
                result.solErda +
                current.total.solErda,

            fragments:
                result.fragments +
                current.total.fragments,
        }),
        {
            solErda: 0,
            fragments: 0,
        },
    );

    const remaining = {
        solErda: Math.max(
            0,
            total.solErda - used.solErda,
        ),

        fragments: Math.max(
            0,
            total.fragments - used.fragments,
        ),
    };

    return {
        totalCount: uniqueCores.length,
        supportedCount: supportedCosts.length,

        used,
        total,
        remaining,

        solErdaPercent: calculatePercent(
            used.solErda,
            total.solErda,
        ),

        fragmentPercent: calculatePercent(
            used.fragments,
            total.fragments,
        ),
    };
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