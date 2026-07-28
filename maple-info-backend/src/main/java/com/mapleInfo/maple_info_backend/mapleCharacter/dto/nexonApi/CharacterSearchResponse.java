package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi;

import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;

import java.time.LocalDateTime;

public record CharacterSearchResponse(
        String ocid,
        String characterName,
        String worldName,
        String characterClass,
        String characterClassLevel,
        Integer level,
        Long exp,
        Double expRate,
        String guildName,
        String characterImage,

        Integer unionLevel,
        String unionGrade,
        Long popularity,

        Integer unionArtifactLevel,
        Integer dojangFloor,
        Integer overallRanking,

        LocalDateTime syncedAt
)  {

    public static CharacterSearchResponse from(
            MapleCharacter character,
            Integer unionArtifactLevel,
            Integer dojangFloor,
            Integer overallRanking
    ) {
        return new CharacterSearchResponse(
                character.getOcid(),
                character.getCharacterName(),
                character.getWorldName(),
                character.getCharacterClass(),
                character.getCharacterClassLevel(),
                character.getLevel(),
                character.getExp(),
                character.getExpRate(),
                character.getGuildName(),
                character.getCharacterImage(),

                character.getUnionLevel(),
                character.getUnionGrade(),
                character.getPopularity(),

                unionArtifactLevel,
                dojangFloor,
                overallRanking,

                character.getSyncedAt()
        );
    }
}