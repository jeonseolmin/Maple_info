import {
    useEffect,
    useMemo,
    useState,
} from "react";
import { getCharacterSymbolEquipment } from "../../../api/characterApi";
import LoadingIcon from "../../loading/LoadingIcon.jsx";
import "./CharacterSymbol.css";

const SYMBOL_GROUPS = [
    {
        type: "ARCANE",
        title: "아케인심볼",
        description:
            "아케인 리버 지역의 심볼입니다.",
    },
    {
        type: "AUTHENTIC",
        title: "어센틱심볼",
        description:
            "그란디스 지역의 심볼입니다.",
    },
    {
        type: "GRAND_AUTHENTIC",
        title: "그랜드 어센틱심볼",
        description:
            "상위 그란디스 지역의 심볼입니다.",
    },
    {
        type: "UNKNOWN",
        title: "기타 심볼",
        description:
            "분류되지 않은 심볼입니다.",
    },
];

export default function CharacterSymbol({
                                            character,
                                        }) {
    const [symbolData, setSymbolData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!character?.ocid) {
            setSymbolData(null);
            setLoading(false);
            setError(
                "캐릭터 식별 정보를 찾을 수 없습니다."
            );
            return;
        }

        let cancelled = false;

        const fetchSymbols = async () => {
            setLoading(true);
            setError("");

            try {
                const data =
                    await getCharacterSymbolEquipment(
                        character.ocid
                    );

                if (!cancelled) {
                    setSymbolData(data);
                }
            } catch (requestError) {
                if (!cancelled) {
                    console.error(
                        "심볼 장비 조회 실패:",
                        requestError
                    );

                    setSymbolData(null);
                    setError(
                        "심볼 정보를 불러오지 못했습니다."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchSymbols();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    const groupedSymbols = useMemo(() => {
        const symbols =
            symbolData?.symbols ?? [];

        return Object.fromEntries(
            SYMBOL_GROUPS.map((group) => [
                group.type,
                symbols.filter(
                    (symbol) =>
                        symbol.type === group.type
                ),
            ])
        );
    }, [symbolData?.symbols]);

    if (loading) {
        return (
            <div className="symbol-loading">
                <LoadingIcon
                    text="심볼 정보를 불러오는 중..."
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

    if (
        !symbolData?.symbols ||
        symbolData.symbols.length === 0
    ) {
        return (
            <p className="character-content__empty">
                장착한 심볼 정보가 없습니다.
            </p>
        );
    }

    return (
        <section className="symbol-panel">
            <header className="symbol-panel__header">
                <div>
                    <h2>심볼</h2>

                    <p>
                        장착 중인 심볼과 성장 정보를
                        확인할 수 있습니다.
                    </p>
                </div>

                <span>
                    총 포스{" "}
                    {formatNumber(
                        symbolData.totalForce
                    )}
                </span>
            </header>

            <SymbolSummary
                totalStats={
                    symbolData.totalStats
                }
            />

            <div className="symbol-groups">
                {SYMBOL_GROUPS.map((group) => {
                    const symbols =
                        groupedSymbols[
                            group.type
                            ] ?? [];

                    if (symbols.length === 0) {
                        return null;
                    }

                    return (
                        <section
                            key={group.type}
                            className={[
                                "symbol-group",
                                `symbol-group--${group.type.toLowerCase()}`,
                            ].join(" ")}
                        >
                            <header className="symbol-group__header">
                                <div>
                                    <h3>
                                        {group.title}
                                    </h3>

                                    <p>
                                        {
                                            group.description
                                        }
                                    </p>
                                </div>

                                <span>
                                    {symbols.length}개
                                </span>
                            </header>

                            <div className="symbol-grid">
                                {symbols.map(
                                    (symbol) => (
                                        <SymbolCard
                                            key={
                                                symbol.name
                                            }
                                            symbol={
                                                symbol
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
}

function SymbolSummary({ totalStats }) {
    if (!totalStats) {
        return null;
    }

    const stats = [
        ["STR", totalStats.str],
        ["DEX", totalStats.dex],
        ["INT", totalStats.intelligence],
        ["LUK", totalStats.luk],
        ["HP", totalStats.hp],
        ["아이템 드롭률", totalStats.dropRate],
        ["메소 획득량", totalStats.mesoRate],
        ["경험치 획득량", totalStats.expRate],
    ].filter(
        ([, value]) =>
            value != null && value !== 0
    );

    if (stats.length === 0) {
        return null;
    }

    return (
        <div className="symbol-summary">
            {stats.map(([label, value]) => (
                <div
                    key={label}
                    className="symbol-summary__item"
                >
                    <span>{label}</span>

                    <strong>
                        {formatNumber(value)}
                        {label.includes("률") ||
                        label.includes("획득량")
                            ? "%"
                            : ""}
                    </strong>
                </div>
            ))}
        </div>
    );
}

function SymbolCard({ symbol }) {
    const stats = [
        ["STR", symbol.str],
        ["DEX", symbol.dex],
        ["INT", symbol.intelligence],
        ["LUK", symbol.luk],
        ["HP", symbol.hp],
        ["드롭률", symbol.dropRate],
        ["메소", symbol.mesoRate],
        ["경험치", symbol.expRate],
    ].filter(
        ([, value]) =>
            value != null && value !== 0
    );

    return (
        <article className="symbol-card">
            <div className="symbol-card__top">
                <div className="symbol-card__icon-box">
                    {symbol.icon ? (
                        <img
                            src={symbol.icon}
                            alt=""
                            className="symbol-card__icon"
                        />
                    ) : (
                        <span>이미지 없음</span>
                    )}
                </div>

                <div className="symbol-card__identity">
                    <strong>
                        {removeSymbolPrefix(
                            symbol.name
                        )}
                    </strong>

                    <span>
                        Lv. {symbol.level ?? 0}
                    </span>

                    <small>
                        포스{" "}
                        {formatNumber(
                            symbol.force
                        )}
                    </small>
                </div>
            </div>

            {stats.length > 0 && (
                <dl className="symbol-card__stats">
                    {stats.map(
                        ([label, value]) => (
                            <div key={label}>
                                <dt>{label}</dt>

                                <dd>
                                    +
                                    {formatNumber(
                                        value
                                    )}
                                    {[
                                        "드롭률",
                                        "메소",
                                        "경험치",
                                    ].includes(label)
                                        ? "%"
                                        : ""}
                                </dd>
                            </div>
                        )
                    )}
                </dl>
            )}

            <div className="symbol-card__growth">
                <div className="symbol-card__growth-info">
                    <span>성장치</span>

                    <strong>
                        {symbol.completed
                            ? "MAX"
                            : `${
                                symbol.growthCount ??
                                0
                            } / ${
                                symbol.requireGrowthCount ??
                                0
                            }`}
                    </strong>
                </div>

                <div
                    className="symbol-card__progress"
                    role="progressbar"
                    aria-label={`${symbol.name} 성장률`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={
                        symbol.growthRate ?? 0
                    }
                >
                    <span
                        style={{
                            width: `${
                                symbol.growthRate ??
                                0
                            }%`,
                        }}
                    />
                </div>

                <small>
                    {symbol.completed
                        ? "최대 레벨"
                        : `${
                            symbol.growthRate ??
                            0
                        }%`}
                </small>
            </div>
        </article>
    );
}

function removeSymbolPrefix(name) {
    if (!name) {
        return "이름 없는 심볼";
    }

    const separatorIndex =
        name.indexOf(":");

    if (separatorIndex === -1) {
        return name;
    }

    return name
        .slice(separatorIndex + 1)
        .trim();
}

function formatNumber(value) {
    return Number(value ?? 0).toLocaleString(
        "ko-KR"
    );
}