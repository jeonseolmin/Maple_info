package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty.NexonCharacterBeautyResponse;

public record CharacterBeautyResponse(
        String date,
        String gender,
        String characterClass,
        BeautyHairResponse hair,
        BeautyFaceResponse face,
        BeautySkinResponse skin,
        BeautyHairResponse additionalHair,
        BeautyFaceResponse additionalFace,
        BeautySkinResponse additionalSkin
) {

    public static CharacterBeautyResponse from(
            NexonCharacterBeautyResponse response
    ) {
        if (response == null) {
            return empty();
        }

        return new CharacterBeautyResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),
                BeautyHairResponse.from(response.characterHair()),
                BeautyFaceResponse.from(response.characterFace()),
                BeautySkinResponse.from(response.characterSkin()),
                BeautyHairResponse.from(response.additionalCharacterHair()),
                BeautyFaceResponse.from(response.additionalCharacterFace()),
                BeautySkinResponse.from(response.additionalCharacterSkin())
        );
    }

    public static CharacterBeautyResponse empty() {
        return new CharacterBeautyResponse(
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}