export default function EquipmentSlot({
                                          slot,
                                          item,
                                          selected,
                                          onSelect,
                                      }) {
    const handleClick = () => {
        if (item) {
            onSelect?.(item);
        }
    };

    const itemTypeLabel =
        item?.type === "beauty" ? "외형" : "장비";

    return (
        <button
            type="button"
            className={[
                "equipment-slot",
                item ? "equipment-slot--filled" : "",
                selected
                    ? "equipment-slot--selected"
                    : "",
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={handleClick}
            disabled={!item}
            aria-label={
                item
                    ? `${item.name} ${itemTypeLabel} 상세 보기`
                    : `${slot} 빈 슬롯`
            }
        >
            {item ? (
                <>
                    {item.starforce > 0 && (
                        <span className="equipment-slot__star">
                            ★ {item.starforce}
                        </span>
                    )}

                    {item.icon ? (
                        <img
                            className="equipment-slot__icon"
                            src={item.icon}
                            alt=""
                        />
                    ) : (
                        <span className="equipment-slot__beauty-icon">
                            {item.slot}
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