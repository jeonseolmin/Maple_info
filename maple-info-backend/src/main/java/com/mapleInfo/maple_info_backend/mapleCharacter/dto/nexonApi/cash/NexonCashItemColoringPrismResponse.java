package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonCashItemColoringPrismResponse(
        @JsonProperty("color_range")
        String colorRange,

        @JsonProperty("hue")
        Integer hue,

        @JsonProperty("saturation")
        Integer saturation,

        @JsonProperty("value")
        Integer value
){

}