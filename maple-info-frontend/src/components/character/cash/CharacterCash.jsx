import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    getCharacterBeauty,
    getCharacterCashEquipment,
} from "../../../api/characterApi";
import CashEquipmentGrid from "./CashEquipmentGrid.jsx";
import CashItemDetail from "./CashItemDetail.jsx";
import "../equipment/Equipment.css";
import "./CharacterCash.css";

export default function CharacterCash({
                                          character,
                                      }) {
    const [cashData, setCashData] =
        useState(null);

    const [beautyData, setBeautyData] =
        useState(null);

    const [equipmentMode, setEquipmentMode] =
        useState("default");

    const [selectedItem, setSelectedItem] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [cashError, setCashError] =
        useState("");

    const [beautyError, setBeautyError] =
        useState("");

    useEffect(() => {
        if (!character?.ocid) {
            setCashData(null);
            setBeautyData(null);
            setSelectedItem(null);
            setLoading(false);
            setCashError(
                "캐릭터 식별 정보를 찾을 수 없습니다."
            );
            return;
        }

        let cancelled = false;

        const fetchCashData = async () => {
            setLoading(true);
            setCashError("");
            setBeautyError("");
            setSelectedItem(null);
            setEquipmentMode("default");

            const [
                cashResult,
                beautyResult,
            ] = await Promise.allSettled([
                getCharacterCashEquipment(
                    character.ocid
                ),
                getCharacterBeauty(
                    character.ocid
                ),
            ]);

            if (cancelled) {
                return;
            }

            if (
                cashResult.status === "fulfilled"
            ) {
                setCashData(cashResult.value);
            } else {
                console.error(
                    "캐시 장비 조회 실패:",
                    cashResult.reason
                );

                setCashData(null);
                setCashError(
                    "캐시 장비 정보를 불러오지 못했습니다."
                );
            }

            if (
                beautyResult.status === "fulfilled"
            ) {
                setBeautyData(
                    beautyResult.value
                );
            } else {
                console.error(
                    "외형 정보 조회 실패:",
                    beautyResult.reason
                );

                setBeautyData(null);
                setBeautyError(
                    "외형 정보를 불러오지 못했습니다."
                );
            }

            setLoading(false);
        };

        fetchCashData();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    const defaultCashEquipment =
        cashData?.equipment ?? [];

    const additionalCashEquipment =
        cashData?.additionalEquipment ?? [];

    const defaultBeautyEquipment =
        useMemo(
            () =>
                createBeautyEquipment(
                    beautyData,
                    false
                ),
            [beautyData]
        );

    const additionalBeautyEquipment =
        useMemo(
            () =>
                createBeautyEquipment(
                    beautyData,
                    true
                ),
            [beautyData]
        );

    const hasAdditionalMode =
        additionalCashEquipment.length > 0 ||
        additionalBeautyEquipment.length > 0;

    const visibleCashEquipment =
        equipmentMode === "additional"
            ? additionalCashEquipment
            : defaultCashEquipment;

    const visibleBeautyEquipment =
        equipmentMode === "additional"
            ? additionalBeautyEquipment
            : defaultBeautyEquipment;

    const visibleEquipment = useMemo(
        () => [
            ...visibleCashEquipment,
            ...visibleBeautyEquipment,
        ],
        [
            visibleCashEquipment,
            visibleBeautyEquipment,
        ]
    );

    const handleModeChange = (mode) => {
        setEquipmentMode(mode);
        setSelectedItem(null);
    };

    if (loading) {
        return (
            <p className="character-content__empty">
                캐시 장비와 외형 정보를
                불러오는 중입니다.
            </p>
        );
    }

    if (
        cashError &&
        beautyError &&
        visibleEquipment.length === 0
    ) {
        return (
            <p className="character-content__empty">
                캐시 장비와 외형 정보를
                불러오지 못했습니다.
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

                    {(cashError ||
                        beautyError) && (
                        <p className="cash-equipment__warning">
                            {cashError ||
                                beautyError}
                        </p>
                    )}
                </div>

                <div className="cash-equipment__header-info">
                    {cashData?.presetNo != null && (
                        <span className="cash-equipment__preset">
                            프리셋{" "}
                            {cashData.presetNo}
                        </span>
                    )}

                    <span className="cash-equipment__count">
                        캐시 장비{" "}
                        {
                            visibleCashEquipment.length
                        }
                        개
                    </span>
                </div>
            </header>

            {hasAdditionalMode && (
                <div
                    className="cash-equipment__mode"
                    role="tablist"
                    aria-label="캐시 장비 외형 선택"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={
                            equipmentMode ===
                            "default"
                        }
                        className={
                            equipmentMode ===
                            "default"
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            handleModeChange(
                                "default"
                            )
                        }
                    >
                        기본 외형
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={
                            equipmentMode ===
                            "additional"
                        }
                        className={
                            equipmentMode ===
                            "additional"
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            handleModeChange(
                                "additional"
                            )
                        }
                    >
                        추가 외형
                    </button>
                </div>
            )}

            <div className="equipment-panel__body">
                <CashEquipmentGrid
                    equipment={visibleEquipment}
                    selectedItem={selectedItem}
                    onSelect={setSelectedItem}
                />

                <CashItemDetail
                    item={selectedItem}
                    onClose={() =>
                        setSelectedItem(null)
                    }
                />
            </div>
        </section>
    );
}

function createBeautyEquipment(
    beautyData,
    additional
) {
    if (!beautyData) {
        return [];
    }

    const hair = additional
        ? beautyData.additionalHair
        : beautyData.hair;

    const face = additional
        ? beautyData.additionalFace
        : beautyData.face;

    const skin = additional
        ? beautyData.additionalSkin
        : beautyData.skin;

    return [
        hair?.name
            ? {
                type: "beauty",
                beautyType: "hair",
                slot: "헤어",
                part: "헤어",
                name: hair.name,
                icon: hair.imageUrl,
                baseColor: hair.baseColor,
                mixColor: hair.mixColor,
                mixRate: hair.mixRate,
            }
            : null,

        face?.name
            ? {
                type: "beauty",
                beautyType: "face",
                slot: "성형",
                part: "성형",
                name: face.name,
                icon: face.imageUrl,
                baseColor: face.baseColor,
                mixColor: face.mixColor,
                mixRate: face.mixRate,
            }
            : null,

        skin?.name
            ? {
                type: "beauty",
                beautyType: "skin",
                slot: "피부",
                part: "피부",
                name: skin.name,
                icon: skin.imageUrl,
                colorStyle:
                skin.colorStyle,
                hue: skin.hue,
                saturation:
                skin.saturation,
                brightness:
                skin.brightness,
            }
            : null,
    ].filter(Boolean);
}