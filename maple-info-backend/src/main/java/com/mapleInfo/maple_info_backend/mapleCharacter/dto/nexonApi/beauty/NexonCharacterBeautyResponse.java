package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonCharacterBeautyResponse(

        String date,

        @JsonProperty("character_gender")
        String characterGender,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("character_hair")
        NexonBeautyHairResponse characterHair,

        @JsonProperty("character_face")
        NexonBeautyFaceResponse characterFace,

        @JsonProperty("character_skin_name")
        String characterSkinName,

        @JsonProperty("additional_character_hair")
        NexonBeautyHairResponse additionalCharacterHair,

        @JsonProperty("additional_character_face")
        NexonBeautyFaceResponse additionalCharacterFace,

        @JsonProperty("additional_character_skin_name")
        String additionalCharacterSkinName
) {
}