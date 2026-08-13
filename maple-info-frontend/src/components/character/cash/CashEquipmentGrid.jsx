import {useMemo, useState} from "react";
import {CASH_EQUIPMENT_SLOTS} from "./cashEquipmentSlot.js";
import EquipmentSlot from "../equipment/EquipmentSlot.jsx";

export  default function CashEquipmentGrid(
    {
        equipment = [],
        onSelect,
    }){
    const [selectedSlot, setSelectedSlot] = useState(null);
    const equipmentBySlot = useMemo(() =>{
        return Object.fromEntries(
            equipment
                .filter((item)=> item?.slot)
                .map((item)=>[item.slot,item])
        );
    },[equipment]);

    const handleSelect = (item) => {
        if (!item) {
            return;
        }

        const isSameItem = selectedSlot === item.slot;

        setSelectedSlot(
            isSameItem ? null : item.slot
        );

        onSelect(
            isSameItem ? null : item
        );
    };

    return (
        <div className="equipment-grid cash-equipment-grid">
            {CASH_EQUIPMENT_SLOTS.flat().map((slot,index)=>{
                if (slot === null){
                    return (
                        <div
                            key = {`cash-spacer-${index}`}
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
                        selected={selectedSlot===slot}
                        onSelect={handleSelect}
                    />
                );
            })}
        </div>
    );
}

