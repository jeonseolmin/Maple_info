import { useMemo, useState } from "react";
import EquipmentSlot from "./EquipmentSlot.jsx";
import EquipmentTooltip from "./EquipmentTooltip";
import { EQUIPMENT_SLOTS} from "./equipmentSlot.js";
import "./Equipment.css";

export default function EquipmentGrid({
                                          equipment = [],
                                          equippedTitle = null,
}) {
    const [selectedItem, setSelectedItem] = useState(null);

    const equipmentBySlot = useMemo(() => {
        const slotMap = Object.fromEntries(
            equipment
                .filter((item) => item?.slot)
                .map((item) => [item.slot, item])
        );

        if (equippedTitle?.name) {
            slotMap["칭호"] = {
                ...equippedTitle,
                type: "TITLE",
                slot: "칭호",
                part: "칭호",
                name: equippedTitle.shapeName ?? equippedTitle.name,
                icon: equippedTitle.shapeIcon ?? equippedTitle.icon,
                description:
                    equippedTitle.shapeDescription ??
                    equippedTitle.description,
            };
        }

        return slotMap;
    }, [equipment, equippedTitle]);

    const handleSelect = (item) => {
        if (!item) {
            return;
        }

        setSelectedItem((currentItem) =>
            currentItem?.slot === item.slot ? null : item
        );
    };

    return (
        <section className="equipment-panel">
            <header className="equipment-panel__header">
                <div>
                    <h2>장착 장비</h2>
                    <p>장비를 선택하면 상세 옵션을 확인할 수 있습니다.</p>
                </div>

                <span>{equipment.length}개 장착</span>
            </header>

            <div className="equipment-panel__body">
                <div className="equipment-grid">
                    {EQUIPMENT_SLOTS.flat().map((slot, index) => {
                        if (slot === null) {
                            return (
                                <div
                                    key={`spacer-${index}`}
                                    className="equipment-grid__spacer"
                                    aria-hidden="true"
                                />
                            );
                        }

                        const item = equipmentBySlot[slot];

                        return (
                            <EquipmentSlot
                                key={slot}
                                slot={slot}
                                item={item}
                                selected={selectedItem?.slot === slot}
                                onSelect={handleSelect}
                            />
                        );
                    })}
                </div>

                <EquipmentTooltip
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            </div>
        </section>
    );
}