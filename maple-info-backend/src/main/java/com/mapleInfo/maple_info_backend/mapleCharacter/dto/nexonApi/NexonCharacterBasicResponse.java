package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonCharacterBasicResponse(
        String date,
        String characterName,
        String worldName,
        String characterGender,
        String characterClass,
        String characterClassLevel,
        Integer characterLevel,
        Long characterExp,
        String characterExpRate,
        String characterGuildName,
        String characterImage,
        String characterDateCreate,
        String accessFlag,
        String liberationQuestClear
) {
}