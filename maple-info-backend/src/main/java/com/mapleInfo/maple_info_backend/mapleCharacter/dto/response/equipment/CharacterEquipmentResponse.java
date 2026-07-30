package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonCharacterEquipmentResponse;

import java.util.List;
import java.util.Objects;

public record CharacterEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        Integer presetNo,
        List<CharacterEquipmentItemResponse> equipment,
        CharacterTitleResponse equippedTitle
) {

    public static CharacterEquipmentResponse from(
            NexonCharacterEquipmentResponse response
    ) {
        if (response == null) {
            return new CharacterEquipmentResponse(
                    null,
                    null,
                    null,
                    null,
                    List.of(),
                    null
            );
        }

        List<CharacterEquipmentItemResponse> equipment =
                response.itemEquipment() == null
                        ? List.of()
                        : response.itemEquipment().stream()
                          .filter(Objects::nonNull)
                          .map(CharacterEquipmentItemResponse::from)
                          .toList();

        return new CharacterEquipmentResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),
                response.presetNo(),
                equipment,
                CharacterTitleResponse.from(response.equippedTitle())
        );
    }
}