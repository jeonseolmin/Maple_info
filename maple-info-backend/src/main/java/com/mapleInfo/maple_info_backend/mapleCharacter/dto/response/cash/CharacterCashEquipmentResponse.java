package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCashItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCharacterCashItemResponse;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public record CharacterCashEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        String lookMode,
        Integer presetNo,

        /*
         * 현재 캐릭터의 실제 장착 캐시 장비
         */
        List<CharacterCashItemResponse> equipment,

        /*
         * 제로·엔젤릭버스터 등에 사용되는 추가 외형 장비
         */
        List<CharacterCashItemResponse> additionalEquipment
) {

    public static CharacterCashEquipmentResponse from(
            NexonCharacterCashItemResponse response
    ) {
        if (response == null) {
            return empty();
        }

        List<NexonCashItemResponse> selectedPreset =
                selectPreset(
                        response.presetNo(),
                        response.preset1(),
                        response.preset2(),
                        response.preset3()
                );

        List<NexonCashItemResponse> selectedAdditionalPreset =
                selectPreset(
                        response.presetNo(),
                        response.additionalPreset1(),
                        response.additionalPreset2(),
                        response.additionalPreset3()
                );

        /*
         * 기본 장비 위에 선택한 프리셋 장비를
         * 동일 슬롯 기준으로 덮어씁니다.
         */
        List<NexonCashItemResponse> mergedEquipment =
                mergeBySlot(
                        response.baseEquipment(),
                        selectedPreset
                );

        List<NexonCashItemResponse> mergedAdditionalEquipment =
                mergeBySlot(
                        response.additionalBaseEquipment(),
                        selectedAdditionalPreset
                );

        return new CharacterCashEquipmentResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),
                response.characterLookMode(),
                response.presetNo(),

                toResponseList(
                        mergedEquipment
                ),

                toResponseList(
                        mergedAdditionalEquipment
                )
        );
    }

    private static List<NexonCashItemResponse> selectPreset(
            Integer presetNo,
            List<NexonCashItemResponse> preset1,
            List<NexonCashItemResponse> preset2,
            List<NexonCashItemResponse> preset3
    ) {
        if (presetNo == null) {
            return List.of();
        }

        return switch (presetNo) {
            case 1 -> nullToEmpty(preset1);
            case 2 -> nullToEmpty(preset2);
            case 3 -> nullToEmpty(preset3);
            default -> List.of();
        };
    }

    private static List<NexonCashItemResponse> mergeBySlot(
            List<NexonCashItemResponse> baseEquipment,
            List<NexonCashItemResponse> presetEquipment
    ) {
        /*
         * LinkedHashMap을 사용하면 기본 장비의
         * 출력 순서를 최대한 유지할 수 있습니다.
         */
        Map<String, NexonCashItemResponse> equipmentBySlot =
                new LinkedHashMap<>();

        putItemsBySlot(
                equipmentBySlot,
                baseEquipment
        );

        /*
         * 동일 슬롯의 프리셋 장비가 기본 장비를
         * 덮어씁니다.
         */
        putItemsBySlot(
                equipmentBySlot,
                presetEquipment
        );

        return List.copyOf(
                equipmentBySlot.values()
        );
    }

    private static void putItemsBySlot(
            Map<String, NexonCashItemResponse> target,
            List<NexonCashItemResponse> source
    ) {
        if (source == null) {
            return;
        }

        for (NexonCashItemResponse item : source) {
            if (
                    item == null ||
                            item.equipmentSlot() == null ||
                            item.equipmentSlot().isBlank()
            ) {
                continue;
            }

            target.put(
                    item.equipmentSlot(),
                    item
            );
        }
    }

    private static List<CharacterCashItemResponse>
    toResponseList(
            List<NexonCashItemResponse> equipment
    ) {
        if (equipment == null) {
            return List.of();
        }

        return equipment.stream()
                .filter(Objects::nonNull)
                .map(CharacterCashItemResponse::from)
                .filter(Objects::nonNull)
                .toList();
    }

    private static List<NexonCashItemResponse> nullToEmpty(
            List<NexonCashItemResponse> items
    ) {
        return items != null
                ? items
                : List.of();
    }

    private static CharacterCashEquipmentResponse empty() {
        return new CharacterCashEquipmentResponse(
                null,
                null,
                null,
                null,
                null,
                List.of(),
                List.of()
        );
    }
}