package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment.CharacterTitleResponse;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonCharacterEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        Integer presetNo,
        List<NexonEquipmentItemResponse> itemEquipment,

        @JsonProperty("title")
        NexonTitleResponse equippedTitle
) {

}