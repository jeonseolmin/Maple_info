package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.seteffect;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonCharacterSetEffectResponse(
        String date,
        List<NexonSetEffectResponse> setEffect
) {
}