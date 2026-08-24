package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.seteffect;

import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonSetEffectInfoResponse(
        Integer setCount,
        String setOption
) {
}