import { useEffect, useMemo, useState } from "react";
import {
    getCharacterBeauty,
    getCharacterCashEquipment,
} from "../../../api/characterApi";
import CashEquipmentGrid from "./CashEquipmentGrid.jsx";
import "../equipment/Equipment.css";
import "./CharacterCash.css";

export default function CharacterCash({ character }) {
    const [cashData, setCashData] = useState(null);
    const [beautyData, setBeautyData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!character?.ocid) {
            setCashData(null);
            setBeautyData(null);
            setSelectedItem(null);
            setLoading(false);
            setError("캐릭터 식별 정보를 찾을 수 없습니다.");
            return;
        }

        let cancelled = false;

        const fetchCashEquipment = async () => {
            setLoading(true);
            setError("");
            setSelectedItem(null);

            const [cashResult, beautyResult] =
                await Promise.allSettled([
                    getCharacterCashEquipment(character.ocid),
                    getCharacterBeauty(character.ocid),
                ]);

            if (cancelled) {
                return;
            }

            if (cashResult.status === "fulfilled") {
                setCashData(cashResult.value);
            } else {
                console.error(
                    "캐시 장비 조회 실패:",
                    cashResult.reason
                );
                setCashData(null);
            }

            if (beautyResult.status === "fulfilled") {
                setBeautyData(beautyResult.value);
            } else {
                console.error(
                    "외형 정보 조회 실패:",
                    beautyResult.reason
                );
                setBeautyData(null);
            }

            if (
                cashResult.status === "rejected" &&
                beautyResult.status === "rejected"
            ) {
                setError(
                    "캐시 장비와 외형 정보를 불러오지 못했습니다."
                );
            } else if (cashResult.status === "rejected") {
                setError(
                    "캐시 장비는 불러오지 못했지만 외형 정보는 표시합니다."
                );
            }

            setLoading(false);
        };

        fetchCashEquipment();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    const cashEquipment = cashData?.equipment ?? [];

    /*
     * Hook은 loading/error 조건부 return보다
     * 반드시 위에서 호출해야 합니다.
     */
    const beautyEquipment = useMemo(() => {
        if (!beautyData) {
            return [];
        }

        return [
            beautyData.hair?.name
                ? {
                    type: "beauty",
                    beautyType: "hair",
                    slot: "헤어",
                    part: "헤어",
                    name: beautyData.hair.name,
                    icon: beautyData.hair.imageUrl,
                    baseColor: beautyData.hair.baseColor,
                    mixColor: beautyData.hair.mixColor,
                    mixRate: beautyData.hair.mixRate,
                }
                : null,

            beautyData.faceName?.name
                ? {
                    type: "beauty",
                    beautyType: "faceName",
                    slot: "성형",
                    part: "성형",
                    name: beautyData.faceName.name,
                    icon: beautyData.faceName.imageUrl,
                    baseColor: beautyData.faceName.baseColor,
                    mixColor: beautyData.faceName.mixColor,
                    mixRate: beautyData.faceName.mixRate,
                }
                : null,

            beautyData.skin?.name
                ? {
                    type: "beauty",
                    beautyType: "skin",
                    slot: "피부",
                    part: "피부",
                    name: beautyData.skin.name,
                    icon: beautyData.skin.imageUrl,
                    colorStyle: beautyData.skin.colorStyle,
                    hue: beautyData.skin.hue,
                    saturation: beautyData.skin.saturation,
                    brightness: beautyData.skin.brightness,
                }
                : null,
        ].filter(Boolean);
    }, [beautyData]);

    const equipment = useMemo(
        () => [
            ...cashEquipment,
            ...beautyEquipment,
        ],
        [cashEquipment, beautyEquipment]
    );

    if (loading) {
        return (
            <p className="character-content__empty">
                캐시 장비 정보를 불러오는 중입니다.
            </p>
        );
    }

    if (error && equipment.length === 0) {
        return (
            <p className="character-content__empty">
                {error}
            </p>
        );
    }

    return (
        <section className="equipment-panel">
            <header className="equipment-panel__header">
                <div>
                    <h2>캐시 장비</h2>

                    <p>
                        캐시 장비와 외형을 선택하면
                        상세정보를 확인할 수 있습니다.
                    </p>

                    {error && (
                        <p className="cash-equipment__warning">
                            {error}
                        </p>
                    )}
                </div>

                <span>
                    캐시 장비 {cashEquipment.length}개
                </span>
            </header>

            <div className="equipment-panel__body">
                <CashEquipmentGrid
                    key={character.ocid}
                    equipment={equipment}
                    onSelect={setSelectedItem}
                />

                <CashItemDetail
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            </div>
        </section>
    );
}

function CashItemDetail({ item, onClose }) {
    if (!item) {
        return (
            <div className="equipment-tooltip equipment-tooltip--empty">
                캐시 장비 또는 외형을 선택해 주세요.
            </div>
        );
    }

    return (
        <article className="equipment-tooltip">
            <button
                type="button"
                className="equipment-tooltip__close"
                onClick={onClose}
                aria-label="상세정보 닫기"
            >
                ×
            </button>

            <header className="equipment-tooltip__header">
                <h3>{item.name}</h3>

                <div className="equipment-tooltip__summary">
                    {item.icon ? (
                        <img
                            src={item.icon}
                            alt={item.name}
                        />
                    ) : (
                        <span className="equipment-tooltip__beauty-icon">
                            {item.slot}
                        </span>
                    )}

                    <div>
                        <span>{item.part || item.slot}</span>

                        {item.gender && (
                            <span>
                                성별: {item.gender}
                            </span>
                        )}

                        {item.label && (
                            <span>{item.label}</span>
                        )}
                    </div>
                </div>
            </header>

            {item.description && (
                <p className="equipment-tooltip__description">
                    {item.description}
                </p>
            )}

            {item.type === "beauty" && (
                <BeautyDetail item={item} />
            )}

            {item.options?.length > 0 && (
                <section className="equipment-tooltip__section">
                    <h4>캐시 옵션</h4>

                    {item.options.map((option, index) => (
                        <p key={`${option.type}-${index}`}>
                            {option.type}: {option.value}
                        </p>
                    ))}
                </section>
            )}

            {item.coloringPrism && (
                <section className="equipment-tooltip__section">
                    <h4>컬러링 프리즘</h4>
                    <p>
                        색상 범위:{" "}
                        {item.coloringPrism.colorRange}
                    </p>
                    <p>
                        색조: {item.coloringPrism.hue}
                    </p>
                    <p>
                        채도: {item.coloringPrism.saturation}
                    </p>
                    <p>
                        명도: {item.coloringPrism.value}
                    </p>
                </section>
            )}
        </article>
    );
}

function BeautyDetail({ item }) {
    return (
        <section className="equipment-tooltip__section">
            <h4>외형 정보</h4>

            {item.baseColor && (
                <p>기본 색상: {item.baseColor}</p>
            )}

            {item.mixColor && (
                <p>믹스 색상: {item.mixColor}</p>
            )}

            {item.mixRate != null && (
                <p>믹스 비율: {item.mixRate}%</p>
            )}

            {item.colorStyle && (
                <p>색상 계열: {item.colorStyle}</p>
            )}

            {item.hue != null && (
                <p>색조: {item.hue}</p>
            )}

            {item.saturation != null && (
                <p>채도: {item.saturation}</p>
            )}

            {item.brightness != null && (
                <p>명도: {item.brightness}</p>
            )}
        </section>
    );
}