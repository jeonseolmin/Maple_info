export default function EquipmentSlot({
                                          slot,
                                          item,
                                          selected,
                                          onSelect,
                                      }) {
    const handleClick = () => {
        if (!item) {
            return;
        }

        onSelect(item);
    };

    return (
        <button
            type="button"
            className={[
                "equipment-slot",
                item ? "equipment-slot--filled" : "",
                selected ? "equipment-slot--selected" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            onClick={handleClick}
            disabled={!item}
            aria-label={item ? `${item.name} 장비 상세 보기` : `${slot} 빈 슬롯`}
        >
            {item ? (
                <>
                    {item.starforce > 0 && (
                        <span className="equipment-slot__star">
                            ★ {item.starforce}
                        </span>
                    )}

                    <img
                        className="equipment-slot__icon"
                        src={item.icon}
                        alt={item.name}
                    />

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