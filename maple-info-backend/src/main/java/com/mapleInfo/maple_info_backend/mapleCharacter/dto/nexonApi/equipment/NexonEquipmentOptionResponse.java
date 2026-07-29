package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonEquipmentOptionResponse(
        String str,
        String dex,

        @JsonProperty("int")
        String intelligence,

        String luk,
        String maxHp,
        String maxMp,
        String attackPower,
        String magicPower,

        @JsonProperty("exceptional_upgrade")
        Integer exceptionalUpgrade
) {
}