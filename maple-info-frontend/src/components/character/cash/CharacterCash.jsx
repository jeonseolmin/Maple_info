import { useEffect, useState } from "react";
import { getCharacterCashEquipment } from "../../../api/characterApi";
import CashEquipmentGrid from "./CashEquipmentGrid.jsx";
import "./CharacterCash.css";

export default function CharacterCash({ character }) {
    const [cashData, setCashData] = useState(null);
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
                const data = await getCharacterCashEquipment(
                    character.ocid
                );

                if (!cancelled) {
                    setCashData(data);
                    setSelectedItem(null);
                }
            } catch (error) {
                console.error("캐시 장비 조회 실패:", error);

                if (!cancelled) {
                    setError("캐시 장비 정보를 불러오지 못했습니다.");
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

    const equipment = cashData?.equipment ?? [];

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