package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.android;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCashItemResponse;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterAndroidEquipmentResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("android_name")
        String androidName,

        @JsonProperty("android_nickname")
        String androidNickname,

        @JsonProperty("android_icon")
        String androidIcon,

        @JsonProperty("android_description")
        String androidDescription,

        @JsonProperty("android_hair")
        AndroidHair androidHair,

        @JsonProperty("android_face")
        AndroidFace androidFace,

        @JsonProperty("android_skin_name")
        String androidSkinName,

        @JsonProperty("android_cash_item_equipment")
        List<NexonCashItemResponse> cashItemEquipment
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AndroidHair(
            @JsonProperty("hair_name")
            String hairName,

            @JsonProperty("base_color")
            String baseColor,

            @JsonProperty("mix_color")
            String mixColor,

            @JsonProperty("mix_rate")
            String mixRate
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AndroidFace(
            @JsonProperty("face_name")
            String faceName,

            @JsonProperty("base_color")
            String baseColor,

            @JsonProperty("mix_color")
            String mixColor,

            @JsonProperty("mix_rate")
            String mixRate
    ) {
    }
}