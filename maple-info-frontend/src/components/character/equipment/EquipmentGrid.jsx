import { useMemo, useState } from "react";
import EquipmentSlot from "./EquipmentSlot.jsx";
import EquipmentTooltip from "./EquipmentTooltip";
import { EQUIPMENT_SLOTS } from "./equipmentSlot";
import "./Equipment.css";

export default function EquipmentGrid({ equipment = [] }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const equipmentBySlot = useMemo(() => {
        return Object.fromEntries(
            equipment
                .filter((item) => item?.slot)
                .map((item) => [item.slot, item])
        );
    }, [equipment]);

    const handleSelect = (item) => {
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
                    {EQUIPMENT_SLOTS.flat().map((slot) => (
                        <EquipmentSlot
                            key={slot}
                            slot={slot}
                            item={equipmentBySlot[slot]}
                            selected={selectedItem?.slot === slot}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>

                <EquipmentTooltip
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            </div>
        </section>
    );
}