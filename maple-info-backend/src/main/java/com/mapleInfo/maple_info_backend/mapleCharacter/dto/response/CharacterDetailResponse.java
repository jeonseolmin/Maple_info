package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response;

public record CharacterDetailResponse(
        Integer level,
        Integer unionLevel,
        Integer unionArtifactHighestEffectLevel,
        Integer unionArtifactCrystalCount,
        Long popularity,
        Integer overallRanking,
        Integer worldRanking,
        Integer classRanking,
        Integer dojangBestFloor,
        Integer dojangBestTime
) {
}
