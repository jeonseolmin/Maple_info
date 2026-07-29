package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonCharacterEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        Integer presetNo,
        List<NexonEquipmentItemResponse> itemEquipment
) {
}