import { useMemo, useState } from "react";
import EquipmentSlot from "./EquipmentSlot";
import EquipmentTooltip from "./EquipmentTooltip.jsx";
import { EQUIPMENT_SLOTS } from "./equipmentSlot";
import "./Equipment.css";

export default function EquipmentGrid({ equipment = [] }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const equipmentBySlot = useMemo(() => {
        return Object.fromEntries(
            equipment
                .filter(Boolean)
                .map((item) => [item.slot, item])
        );
    }, [equipment]);

    return (
        <section className="equipment-panel">
            <div className="equipment-panel__header">
                <h2>장비</h2>
                <span>{equipment.length}개 장착</span>
            </div>

            <div className="equipment-panel__body">
                <div className="equipment-grid">
                    {EQUIPMENT_SLOTS.flat().map((slot) => (
                        <EquipmentSlot
                            key={slot}
                            slot={slot}
                            item={equipmentBySlot[slot]}
                            selected={selectedItem?.slot === slot}
                            onSelect={setSelectedItem}
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