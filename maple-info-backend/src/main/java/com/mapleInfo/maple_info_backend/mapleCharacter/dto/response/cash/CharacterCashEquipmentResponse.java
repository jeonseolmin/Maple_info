package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCashItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCharacterCashItemResponse;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public record CharacterCashEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        String lookMode,

        /*
         * 현재 캐릭터가 실제 사용 중인 프리셋 번호
         */
        Integer presetNo,

        /*
         * 기존 프론트와의 호환성을 위해 유지합니다.
         * 현재 사용 중인 프리셋의 장비입니다.
         */
        List<CharacterCashItemResponse> equipment,

        /*
         * 현재 사용 중인 프리셋의 추가 외형 장비입니다.
         */
        List<CharacterCashItemResponse> additionalEquipment,

        /*
         * 프리셋 1·2·3의 전체 장비 정보입니다.
         */
        Map<Integer, CashPresetResponse> presets
) {

    public record CashPresetResponse(
            List<CharacterCashItemResponse> equipment,
            List<CharacterCashItemResponse> additionalEquipment
    ) {
    }

    public static CharacterCashEquipmentResponse from(
            NexonCharacterCashItemResponse response
    ) {
        if (response == null) {
            return empty();
        }

        Map<Integer, CashPresetResponse> presets =
                createPresets(response);

        Integer activePresetNo =
                normalizePresetNo(response.presetNo());

        CashPresetResponse activePreset =
                presets.get(activePresetNo);

        if (activePreset == null) {
            activePreset = new CashPresetResponse(
                    List.of(),
                    List.of()
            );
        }

        return new CharacterCashEquipmentResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),
                response.characterLookMode(),
                activePresetNo,
                activePreset.equipment(),
                activePreset.additionalEquipment(),
                presets
        );
    }

    private static Map<Integer, CashPresetResponse> createPresets(
            NexonCharacterCashItemResponse response
    ) {
        Map<Integer, CashPresetResponse> presets =
                new LinkedHashMap<>();

        presets.put(
                1,
                createPreset(
                        response.baseEquipment(),
                        response.preset1(),
                        response.additionalBaseEquipment(),
                        response.additionalPreset1()
                )
        );

        presets.put(
                2,
                createPreset(
                        response.baseEquipment(),
                        response.preset2(),
                        response.additionalBaseEquipment(),
                        response.additionalPreset2()
                )
        );

        presets.put(
                3,
                createPreset(
                        response.baseEquipment(),
                        response.preset3(),
                        response.additionalBaseEquipment(),
                        response.additionalPreset3()
                )
        );

        return Collections.unmodifiableMap(presets);
    }

    private static CashPresetResponse createPreset(
            List<NexonCashItemResponse> baseEquipment,
            List<NexonCashItemResponse> presetEquipment,
            List<NexonCashItemResponse> additionalBaseEquipment,
            List<NexonCashItemResponse> additionalPresetEquipment
    ) {
        List<NexonCashItemResponse> mergedEquipment =
                mergeBySlot(
                        baseEquipment,
                        presetEquipment
                );

        List<NexonCashItemResponse> mergedAdditionalEquipment =
                mergeBySlot(
                        additionalBaseEquipment,
                        additionalPresetEquipment
                );

        return new CashPresetResponse(
                toResponseList(mergedEquipment),
                toResponseList(
                        mergedAdditionalEquipment
                )
        );
    }

    private static List<NexonCashItemResponse> mergeBySlot(
            List<NexonCashItemResponse> baseEquipment,
            List<NexonCashItemResponse> presetEquipment
    ) {
        Map<String, NexonCashItemResponse> equipmentBySlot =
                new LinkedHashMap<>();

        /*
         * 먼저 공통으로 장착된 기본 캐시 장비를 넣습니다.
         */
        putItemsBySlot(
                equipmentBySlot,
                baseEquipment
        );

        /*
         * 같은 슬롯에 프리셋 장비가 있으면
         * 기본 장비를 덮어씁니다.
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

    private static List<CharacterCashItemResponse> toResponseList(
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

    private static Integer normalizePresetNo(
            Integer presetNo
    ) {
        if (
                presetNo == null ||
                        presetNo < 1 ||
                        presetNo > 3
        ) {
            return 1;
        }

        return presetNo;
    }

    private static CharacterCashEquipmentResponse empty() {
        Map<Integer, CashPresetResponse> emptyPresets =
                new LinkedHashMap<>();

        emptyPresets.put(
                1,
                new CashPresetResponse(
                        List.of(),
                        List.of()
                )
        );

        emptyPresets.put(
                2,
                new CashPresetResponse(
                        List.of(),
                        List.of()
                )
        );

        emptyPresets.put(
                3,
                new CashPresetResponse(
                        List.of(),
                        List.of()
                )
        );

        return new CharacterCashEquipmentResponse(
                null,
                null,
                null,
                null,
                1,
                List.of(),
                List.of(),
                Collections.unmodifiableMap(
                        emptyPresets
                )
        );
    }
}