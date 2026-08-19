import { useMemo, useState } from "react";

import "./HexaStats.css";

const STAT_GROUP_NUMBERS = [1, 2, 3];

export default function HexaStats({
                                      activeCores1 = [],
                                      activeCores2 = [],
                                      activeCores3 = [],
                                  }) {
    const [selectedGroup, setSelectedGroup] =
        useState(1);

    const groups = useMemo(
        () => ({
            1: normalizeCores(activeCores1),
            2: normalizeCores(activeCores2),
            3: normalizeCores(activeCores3),
        }),
        [
            activeCores1,
            activeCores2,
            activeCores3,
        ],
    );

    const selectedCores =
        groups[selectedGroup] ?? [];

    return (
        <section className="hexa-stat-selector">
            <header className="hexa-stat-selector__header">
                <div className="hexa-stat-selector__title">
                    <span>HEXA STAT</span>
                    <h3>HEXA 스탯</h3>
                </div>

                <StatTabs
                    groups={groups}
                    selectedGroup={
                        selectedGroup
                    }
                    onSelect={
                        setSelectedGroup
                    }
                />
            </header>

            <div
                id={`hexa-stat-panel-${selectedGroup}`}
                className="hexa-stat-selector__panel"
                role="tabpanel"
                aria-labelledby={`hexa-stat-tab-${selectedGroup}`}
            >
                <HexaStatGroup
                    number={selectedGroup}
                    cores={selectedCores}
                />
            </div>
        </section>
    );
}

function StatTabs({
                      groups,
                      selectedGroup,
                      onSelect,
                  }) {
    return (
        <div
            className="hexa-stat-selector__tabs"
            role="tablist"
            aria-label="HEXA 스탯 선택"
        >
            {STAT_GROUP_NUMBERS.map(
                (number) => {
                    const active =
                        selectedGroup === number;

                    const empty =
                        groups[number].length === 0;

                    return (
                        <button
                            id={`hexa-stat-tab-${number}`}
                            key={number}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-controls={`hexa-stat-panel-${number}`}
                            tabIndex={
                                active ? 0 : -1
                            }
                            className={[
                                "hexa-stat-selector__tab",
                                active
                                    ? "is-active"
                                    : "",
                                empty
                                    ? "is-empty"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() =>
                                onSelect(number)
                            }
                        >
                            <span>
                                {toRomanNumber(
                                    number,
                                )}
                            </span>

                            {!empty && (
                                <i
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    );
                },
            )}
        </div>
    );
}

function HexaStatGroup({
                           number,
                           cores,
                       }) {
    if (cores.length === 0) {
        return (
            <EmptyStatGroup
                number={number}
            />
        );
    }

    const totalLevel = cores.reduce(
        (sum, core) =>
            sum + getCoreTotalLevel(core),
        0,
    );

    return (
        <div className="hexa-stat-selector__content">
            <div className="hexa-stat-selector__summary">
                <span>
                    HEXA 스탯{" "}
                    {toRomanNumber(number)}
                </span>

                <strong>
                    총 Lv. {totalLevel}
                </strong>
            </div>

            <div className="hexa-stat-selector__cores">
                {cores.map((core, index) => (
                    <HexaStatCore
                        key={`${core.slotId ?? "slot"}-${index}`}
                        core={core}
                        showDivider={index > 0}
                    />
                ))}
            </div>
        </div>
    );
}

function HexaStatCore({
                          core,
                          showDivider,
                      }) {
    return (
        <article
            className={[
                "hexa-stat-selector__core",
                showDivider
                    ? "has-divider"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="hexa-stat-selector__meta">
                <span>
                    슬롯 {core.slotId ?? "-"}
                </span>

                <span>
                    등급 {core.grade ?? 0}
                </span>
            </div>

            <div className="hexa-stat-selector__rows">
                <StatRow
                    label="메인"
                    name={core.mainStatName}
                    level={
                        core.mainStatLevel
                    }
                    main
                />

                <StatRow
                    label="서브 1"
                    name={
                        core.firstSubStatName
                    }
                    level={
                        core.firstSubStatLevel
                    }
                />

                <StatRow
                    label="서브 2"
                    name={
                        core.secondSubStatName
                    }
                    level={
                        core.secondSubStatLevel
                    }
                />
            </div>
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
                "hexa-stat-selector__row",
                main ? "is-main" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span>{label}</span>

            <p title={name || "-"}>
                {name || "-"}
            </p>

            <strong>
                Lv. {toNumber(level)}
            </strong>
        </div>
    );
}

function EmptyStatGroup({ number }) {
    return (
        <div className="hexa-stat-selector__empty">
            <span
                className="hexa-stat-selector__empty-icon"
                aria-hidden="true"
            >
                V
            </span>

            <div>
                <strong>
                    HEXA 스탯{" "}
                    {toRomanNumber(number)}
                </strong>

                <p>
                    활성화된 스탯 코어가
                    없습니다.
                </p>
            </div>
        </div>
    );
}

function normalizeCores(cores) {
    return Array.isArray(cores)
        ? cores
        : [];
}

function getCoreTotalLevel(core) {
    const providedTotal =
        Number(core?.totalLevel);

    if (Number.isFinite(providedTotal)) {
        return providedTotal;
    }

    return (
        toNumber(core?.mainStatLevel) +
        toNumber(
            core?.firstSubStatLevel,
        ) +
        toNumber(
            core?.secondSubStatLevel,
        )
    );
}

function toNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
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