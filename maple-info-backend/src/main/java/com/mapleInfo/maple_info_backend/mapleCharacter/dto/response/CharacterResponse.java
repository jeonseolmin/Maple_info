package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response;


import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;

import java.time.LocalDateTime;

public record CharacterResponse(
        Long id,
        String ocid,
        String characterName,
        String worldName,
        String characterClass,
        String subClass,
        Integer level,
        Long exp,
        Double expRate,
        String guildName,
        Integer unionLevel,
        Long combatPower,
        String characterImage,
        LocalDateTime syncedAt

) {

    public static CharacterResponse from(MapleCharacter character) {
        return new CharacterResponse(
                character.getId(),
                character.getOcid(),
                character.getCharacterName(),
                character.getWorldName(),
                character.getCharacterClass(),
                character.getSubClass(),
                character.getLevel(),
                character.getExp(),
                character.getExpRate(),
                character.getGuildName(),
                character.getUnionLevel(),
                character.getCombatPower(),
                character.getCharacterImage(),
                character.getSyncedAt()
        );
    }
}
