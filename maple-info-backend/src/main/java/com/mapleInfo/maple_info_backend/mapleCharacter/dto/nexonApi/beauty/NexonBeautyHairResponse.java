package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonBeautyHairResponse(

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