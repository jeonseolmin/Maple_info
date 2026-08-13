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
            NexonCharacterBeautyResponse response,
            String hairImageUrl,
            String faceImageUrl,
            String additionalHairImageUrl,
            String additionalFaceImageUrl
    ) {
        if (response == null) {
            return null;
        }

        return new CharacterBeautyResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),

                BeautyHairResponse.from(
                        response.characterHair(),
                        hairImageUrl
                ),

                BeautyFaceResponse.from(
                        response.characterFace(),
                        faceImageUrl
                ),

                BeautySkinResponse.from(
                        response.characterSkin()
                ),

                BeautyHairResponse.from(
                        response.additionalCharacterHair(),
                        additionalHairImageUrl
                ),

                BeautyFaceResponse.from(
                        response.additionalCharacterFace(),
                        additionalFaceImageUrl
                ),

                BeautySkinResponse.from(
                        response.additionalCharacterSkin()
                )
        );
    }
}