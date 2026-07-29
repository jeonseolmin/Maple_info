import { useEffect, useState } from "react";
import { getCharacterEquipment } from "../../../api/characterApi";
import EquipmentGrid from "./EquipmentGrid";

export default function CharacterEquipment({ character }) {
    const [equipmentData, setEquipmentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!character?.ocid) {
            setLoading(false);
            setError("캐릭터 식별 정보를 찾을 수 없습니다.");
            return;
        }

        let cancelled = false;

        const fetchEquipment = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getCharacterEquipment(character.ocid);

                if (!cancelled) {
                    setEquipmentData(data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("장비 조회 실패:", error);
                    setError("장비 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchEquipment();

        return () => {
            cancelled = true;
        };
    }, [character?.ocid]);

    if (loading) {
        return (
            <p className="character-content__empty">
                장비 정보를 불러오는 중입니다.
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

    const equipment = equipmentData?.equipment ?? [];

    if (equipment.length === 0) {
        return (
            <p className="character-content__empty">
                장착 장비 정보가 없습니다.
            </p>
        );
    }

    return (
        <EquipmentGrid equipment={equipment} />
    );
}