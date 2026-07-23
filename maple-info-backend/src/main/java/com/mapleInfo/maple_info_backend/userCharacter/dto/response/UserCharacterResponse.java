package com.mapleInfo.maple_info_backend.userCharacter.dto.response;

public record UserCharacterResponse(
        Long id,
        Long characterId,
        String characterName,
        String worldName,
        String characterClass,
        Integer level,
        String characterImage,
        Boolean mainCharacter
) {
}
