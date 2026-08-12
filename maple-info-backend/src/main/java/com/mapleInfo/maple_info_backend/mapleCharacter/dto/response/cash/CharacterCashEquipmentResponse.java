package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCashItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCharacterCashItemResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public record CharacterCashEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        String lookMode,
        Integer presetNo,
        List<CharacterCashItemResponse> equipment
) {

    public static CharacterCashEquipmentResponse from(
            NexonCharacterCashItemResponse response
    ) {
        if (response == null) {
            return empty();
        }

        List<NexonCashItemResponse> selected =
                getSelectedPreset(response);

        List<CharacterCashItemResponse> equipment =
                selected.stream()
                        .filter(Objects::nonNull)
                        .map(CharacterCashItemResponse::from)
                        .toList();

        return new CharacterCashEquipmentResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),
                response.characterLookMode(),
                response.presetNo(),
                equipment
        );
    }

    private static List<NexonCashItemResponse> getSelectedPreset(
            NexonCharacterCashItemResponse response
    ) {
        List<NexonCashItemResponse> equipment =
                new ArrayList<>();

        addAll(
                equipment,
                switch (response.presetNo() != null
                        ? response.presetNo()
                        : 0) {
                    case 1 -> response.preset1();
                    case 2 -> response.preset2();
                    case 3 -> response.preset3();
                    default -> response.baseEquipment();
                }
        );

        addAll(
                equipment,
                switch (response.presetNo() != null
                        ? response.presetNo()
                        : 0) {
                    case 1 -> response.additionalPreset1();
                    case 2 -> response.additionalPreset2();
                    case 3 -> response.additionalPreset3();
                    default -> response.additionalBaseEquipment();
                }
        );

        return equipment;
    }

    private static void addAll(
            List<NexonCashItemResponse> target,
            List<NexonCashItemResponse> source
    ) {
        if (source != null) {
            target.addAll(source);
        }
    }

    private static CharacterCashEquipmentResponse empty() {
        return new CharacterCashEquipmentResponse(
                null,
                null,
                null,
                null,
                null,
                List.of()
        );
    }
}