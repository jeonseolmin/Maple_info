package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty.NexonCharacterBeautyResponse;

public record CharacterBeautyResponse(

        String date,
        String gender,
        String characterClass,
        BeautyHairResponse hair,
        BeautyFaceResponse face,
        String skinName,
        BeautyHairResponse additionalHair,
        BeautyFaceResponse additionalFace,
        String additionalSkinName
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
                BeautyHairResponse.from(
                        response.characterHair()
                ),
                BeautyFaceResponse.from(
                        response.characterFace()
                ),
                response.characterSkinName(),
                BeautyHairResponse.from(
                        response.additionalCharacterHair()
                ),
                BeautyFaceResponse.from(
                        response.additionalCharacterFace()
                ),
                response.additionalCharacterSkinName()
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