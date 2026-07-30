package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonEquipmentOptionResponse;

public record CharacterEquipmentOptionResponse(
        String str,
        String dex,
        String intelligence,
        String luk,
        String maxHp,
        String maxMp,
        String attackPower,
        String magicPower,
        Integer exceptionalUpgrade
) {

    public static CharacterEquipmentOptionResponse from(
            NexonEquipmentOptionResponse option
    ) {
        if (option == null) {
            return null;
        }

        return new CharacterEquipmentOptionResponse(
                option.str(),
                option.dex(),
                option.intelligence(),
                option.luk(),
                option.maxHp(),
                option.maxMp(),
                option.attackPower(),
                option.magicPower(),
                option.exceptionalUpgrade()
        );
    }
}