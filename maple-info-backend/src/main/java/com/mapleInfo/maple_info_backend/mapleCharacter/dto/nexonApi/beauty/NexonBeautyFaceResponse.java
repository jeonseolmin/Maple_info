package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonBeautyFaceResponse(

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
