import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom";

import StarforceExpectation from "../../components/starforceCalculator/StarforceExpectation";
import CubeExpectation from "../../components/cubeCalculator/CubeExpectation";
import SymbolCalculator from "../../components/symbolCalculator/SymbolCalculator";

import "./GrowthPage.css";

const GROWTH_TABS = [
    {
        id: "starforce",
        label: "스타포스",
        description: "스타포스 강화 비용과 효율을 계산합니다.",
    },
    {
        id: "potential",
        label: "잠재능력",
        description: "잠재능력 등급 상승 기대 비용을 계산합니다.",
    },
    {
        id: "symbol",
        label: "심볼",
        description: "심볼 성장 비용과 필요한 개수를 계산합니다.",
    },
    {
        id: "order",
        label: "스펙업 순서",
        description: "현재 상태에 적합한 성장 순서를 확인합니다.",
    },
];

const GROWTH_TYPES = GROWTH_TABS.map(
    (tab) => tab.id
);

function GrowthOrderPlaceholder() {
    return (
        <section className="growth-page__empty">
            <span
                className="growth-page__empty-icon"
                aria-hidden="true"
            >
                +
            </span>

            <h2 className="growth-page__empty-title">
                스펙업 순서
            </h2>

            <p className="growth-page__empty-description">
                캐릭터의 장비와 성장 정보를 기준으로
                스펙업 순서를 추천하는 기능을 준비하고
                있습니다.
            </p>
        </section>
    );
}

export default function GrowthPage() {
    const navigate = useNavigate();
    const { growthType } = useParams();

    const isValidType =
        GROWTH_TYPES.includes(growthType);

    if (!isValidType) {
        return (
            <Navigate
                to="/growth/starforce"
                replace
            />
        );
    }

    const activeTab = GROWTH_TABS.find(
        (tab) => tab.id === growthType
    );

    const handleTabClick = (tabId) => {
        navigate(`/growth/${tabId}`);
    };

    const renderGrowthContent = () => {
        switch (growthType) {
            case "starforce":
                return <StarforceExpectation />;

            case "potential":
                return <CubeExpectation />;

            case "symbol":
                return <SymbolCalculator />;

            case "order":
                return <GrowthOrderPlaceholder />;

            default:
                return null;
        }
    };

    return (
        <main className="growth-page">
            <header className="growth-page__header">
                <div className="growth-page__heading">
                    <span className="growth-page__eyebrow">
                        GROWTH
                    </span>

                    <h1 className="growth-page__title">
                        성장 효율
                    </h1>

                    <p className="growth-page__description">
                        {activeTab.description}
                    </p>
                </div>
            </header>

            <nav
                className="growth-page__tabs"
                role="tablist"
                aria-label="성장 효율 기능"
            >
                {GROWTH_TABS.map((tab) => {
                    const isActive =
                        tab.id === growthType;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={[
                                "growth-page__tab",
                                isActive
                                    ? "is-active"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() =>
                                handleTabClick(tab.id)
                            }
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            <section
                className="growth-page__content"
                role="tabpanel"
                aria-label={activeTab.label}
            >
                {renderGrowthContent()}
            </section>
        </main>
    );
}