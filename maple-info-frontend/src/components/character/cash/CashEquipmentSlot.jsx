import { useEffect, useState } from "react";

export default function CashEquipmentSlot({
                                              slot,
                                              item,
                                              selected,
                                              onSelect,
                                          }) {
    const [imageFailed, setImageFailed] =
        useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [item?.icon]);

    const handleClick = () => {
        if (item) {
            onSelect?.(item);
        }
    };

    const showImage =
        Boolean(item?.icon) && !imageFailed;

    return (
        <button
            type="button"
            className={[
                "equipment-slot",
                "cash-equipment-slot",
                item ? "equipment-slot--filled" : "",
                selected
                    ? "equipment-slot--selected"
                    : "",
                item?.type === "beauty"
                    ? "cash-equipment-slot--beauty"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={handleClick}
            disabled={!item}
            aria-label={
                item
                    ? `${item.name} 상세정보 보기`
                    : `${slot} 빈 슬롯`
            }
        >
            {item ? (
                <>
                    {showImage ? (
                        <img
                            className={[
                                "equipment-slot__icon",
                                item.type === "beauty"
                                    ? "equipment-slot__icon--beauty"
                                    : "",
                                item.beautyType
                                    ? `equipment-slot__icon--${item.beautyType}`
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            src={item.icon}
                            alt=""
                            onError={() =>
                                setImageFailed(true)
                            }
                        />
                    ) : (
                        <span className="equipment-slot__beauty-icon">
                            {item.type === "beauty"
                                ? item.slot
                                : "이미지 없음"}
                        </span>
                    )}

                    {item.label && (
                        <span className="cash-equipment-slot__label">
                            {item.label}
                        </span>
                    )}

                    <span className="equipment-slot__name">
                        {item.name}
                    </span>
                </>
            ) : (
                <span className="equipment-slot__empty-name">
                    {slot}
                </span>
            )}
        </button>
    );
}