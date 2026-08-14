import { useMemo } from "react";
import { CASH_EQUIPMENT_SLOTS } from "./cashEquipmentSlot.js";
import CashEquipmentSlot from "./CashEquipmentSlot.jsx";

export default function CashEquipmentGrid({
                                              equipment = [],
                                              selectedItem,
                                              onSelect,
                                          }) {
    const equipmentBySlot = useMemo(() => {
        return Object.fromEntries(
            equipment
                .filter((item) => item?.slot)
                .map((item) => [
                    item.slot,
                    item,
                ])
        );
    }, [equipment]);

    const handleSelect = (item) => {
        if (!item) {
            return;
        }

        const isSameItem =
            selectedItem?.slot === item.slot;

        onSelect?.(
            isSameItem ? null : item
        );
    };

    return (
        <div className="equipment-grid cash-equipment-grid">
            {CASH_EQUIPMENT_SLOTS.flat().map(
                (slot, index) => {
                    if (slot === null) {
                        return (
                            <div
                                key={`cash-spacer-${index}`}
                                className="equipment-grid__spacer"
                                aria-hidden="true"
                            />
                        );
                    }

                    const item =
                        equipmentBySlot[slot];

                    return (
                        <CashEquipmentSlot
                            key={slot}
                            slot={slot}
                            item={item}
                            selected={
                                selectedItem?.slot === slot
                            }
                            onSelect={handleSelect}
                        />
                    );
                }
            )}
        </div>
    );
}