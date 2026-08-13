package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response;

import java.util.List;

public record UnionChampionResponse(
        String characterName,
        String characterImage,
        String job,
        int level,
        List<BossClearStatus> bossAnalysisList
) {
    public record BossClearStatus(
            String bossName,
            String difficulty,
            String imageUrl,
            boolean isCleared
    ) {}
}