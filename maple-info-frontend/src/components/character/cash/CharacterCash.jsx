import { useEffect, useMemo, useState } from "react";
import {
    getCharacterBeauty,
    getCharacterCashEquipment,
} from "../../../api/characterApi";
import CashEquipmentGrid from "./CashEquipmentGrid.jsx";
import "./CharacterCash.css";

export default function CharacterCash({ character }) {
    const [cashData, setCashData] = useState(null);
    const [beautyData, setBeautyData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!character?.ocid) {
            setLoading(false);
            setError("캐릭터 식별 정보를 찾을 수 없습니다.");
            return;
        }

        let cancelled = false;

        const fetchCashEquipment = async () => {
            setLoading(true);
            setError("");

            try {
                const [cash, beauty] = await Promise.all([
                    getCharacterCashEquipment(character.ocid),
                    getCharacterBeauty(character.ocid),
                ]);

                if (!cancelled) {
                    setCashData(cash);
                    setBeautyData(beauty);
                    setSelectedItem(null);
                }
            } catch (error) {
                console.error("캐시 외형 정보 조회 실패:", error);

                if (!cancelled) {
                    setCashData(null);
                    setBeautyData(null);
                    setError("캐시 외형 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchCashEquipment();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    if (loading) {
        return (
            <p className="character-content__empty">
                캐시 장비 정보를 불러오는 중입니다.
            </p>
        );
    }

    if (error) {
        return (
            <p className="character-content__empty">
                {error}
            </p>
        );
    }

    const cashEquipment = cashData?.equipment ?? [];

    const beautyEquipment = useMemo(() => {
        if (!beautyData) {
            return [];
        }

        return [
            beautyData.hair && {
                type: "beauty",
                beautyType: "hair",
                slot: "헤어",
                part: "헤어",
                name: beautyData.hair.name,
                baseColor: beautyData.hair.baseColor,
                mixColor: beautyData.hair.mixColor,
                mixRate: beautyData.hair.mixRate,
            },

            beautyData.face && {
                type: "beauty",
                beautyType: "face",
                slot: "성형",
                part: "성형",
                name: beautyData.face.name,
                baseColor: beautyData.face.baseColor,
                mixColor: beautyData.face.mixColor,
                mixRate: beautyData.face.mixRate,
            },

            beautyData.skin && {
                type: "beauty",
                beautyType: "skin",
                slot: "피부",
                part: "피부",
                name: beautyData.skin.name,
                colorStyle: beautyData.skin.colorStyle,
                hue: beautyData.skin.hue,
                saturation: beautyData.skin.saturation,
                brightness: beautyData.skin.brightness,
            },
        ].filter(Boolean);
    }, [beautyData]);

    const equipment = [
        ...cashEquipment,
        ...beautyEquipment,
    ];

    return (
        <section className="equipment-panel">
            <header className="equipment-panel__header">
                <div>
                    <h2>캐시 장비</h2>
                    <p>
                        캐시 장비를 선택하면 상세정보를 확인할 수 있습니다.
                    </p>
                </div>

                <span>{equipment.length}개 장착</span>
            </header>

            <div className="equipment-panel__body">
                <CashEquipmentGrid
                    equipment={equipment}
                    onSelect={setSelectedItem}
                />

                <CashItemDetail
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            </div>
            <span>{cashEquipment.length}개 장착</span>
        </section>
    );
}

function CashItemDetail({ item, onClose }) {
    if (!item) {
        return (
            <div className="equipment-tooltip equipment-tooltip--empty">
                캐시 장비를 선택해 주세요.
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
            {item.type === "beauty" && (
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
            )}
            <header className="equipment-tooltip__header">
                <h3>{item.name}</h3>

                <div className="equipment-tooltip__summary">
                    <img src={item.icon} alt={item.name} />

                    <div>
                        <span>{item.part || item.slot}</span>

                        {item.gender && (
                            <span>성별: {item.gender}</span>
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
        </article>
    );
}