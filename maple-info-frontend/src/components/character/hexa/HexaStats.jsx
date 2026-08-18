import { useMemo, useState } from "react";

const GROUP_NUMBERS = [1, 2, 3];

export default function HexaStats({
    activeCores1 = [],
    activeCores2 = [],
    activeCores3 = [],
    presetCores1 = [],
    presetCores2 = [],
    presetCores3 = [],
}) {
    const [mode, setMode] = useState("active");

    const groups = useMemo(
        () => ({
            1: { active: activeCores1, preset: presetCores1 },
            2: { active: activeCores2, preset: presetCores2 },
            3: { active: activeCores3, preset: presetCores3 },
        }),
        [activeCores1, activeCores2, activeCores3, presetCores1, presetCores2, presetCores3]
    );

    return (
        <section className="hexa-stat-section">
            <header className="hexa-stat-section__header">
                <div>
                    <h3>HEXA 스탯</h3>
                    <p>HEXA 스탯 I·II·III을 한눈에 비교할 수 있습니다.</p>
                </div>

                <div className="hexa-stat__mode" aria-label="HEXA 스탯 종류">
                    <button type="button" className={mode === "active" ? "is-active" : ""} onClick={() => setMode("active")}>
                        현재 적용
                    </button>
                    <button type="button" className={mode === "preset" ? "is-active" : ""} onClick={() => setMode("preset")}>
                        프리셋
                    </button>
                </div>
            </header>

            <div className="hexa-stat-summary-grid">
                {GROUP_NUMBERS.map((number) => (
                    <HexaStatGroupCard
                        key={number}
                        number={number}
                        cores={groups[number]?.[mode] ?? []}
                    />
                ))}
            </div>
        </section>
    );
}

function HexaStatGroupCard({ number, cores }) {
    const totalLevel = cores.reduce(
        (sum, core) => sum + (core.totalLevel ?? 0),
        0
    );

    return (
        <article className={`hexa-stat-summary-card${cores.length === 0 ? " is-empty" : ""}`}>
            <header className="hexa-stat-summary-card__header">
                <div>
                    <span>HEXA 스탯</span>
                    <h4>{toRomanNumber(number)}</h4>
                </div>
                {cores.length > 0 ? (
                    <strong>총 Lv. {totalLevel}</strong>
                ) : (
                    <strong>미활성</strong>
                )}
            </header>

            {cores.length === 0 ? (
                <p className="hexa-stat-summary-card__empty">등록된 스탯 코어가 없습니다.</p>
            ) : (
                <div className="hexa-stat-summary-card__cores">
                    {cores.map((core, index) => (
                        <HexaStatCore
                            key={`${core.slotId ?? "slot"}-${index}`}
                            core={core}
                            showDivider={index > 0}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

function HexaStatCore({ core, showDivider }) {
    return (
        <div className={`hexa-stat-summary-core${showDivider ? " has-divider" : ""}`}>
            <div className="hexa-stat-summary-core__meta">
                <span>슬롯 {core.slotId || "-"}</span>
                <span>등급 {core.grade ?? 0}</span>
            </div>
            <StatRow label="메인" name={core.mainStatName} level={core.mainStatLevel} main />
            <StatRow label="서브 1" name={core.firstSubStatName} level={core.firstSubStatLevel} />
            <StatRow label="서브 2" name={core.secondSubStatName} level={core.secondSubStatLevel} />
        </div>
    );
}

function StatRow({ label, name, level, main = false }) {
    return (
        <div className={`hexa-stat-summary-row${main ? " is-main" : ""}`}>
            <span>{label}</span>
            <p>{name || "-"}</p>
            <strong>Lv. {level ?? 0}</strong>
        </div>
    );
}

function toRomanNumber(number) {
    return ({ 1: "I", 2: "II", 3: "III" })[number] ?? String(number);
}
