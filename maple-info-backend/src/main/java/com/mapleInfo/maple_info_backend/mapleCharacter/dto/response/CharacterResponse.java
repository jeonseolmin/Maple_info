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

}
