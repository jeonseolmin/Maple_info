package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.seteffect;

import java.util.List;

public record CharacterSetEffectResponse(
        List<CharacterSetEffectSummaryResponse> sets
) {
}