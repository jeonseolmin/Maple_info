package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonBeautySkinResponse(

        @JsonProperty("skin_name")
        String skinName,

        @JsonProperty("color_style")
        String colorStyle,

        Integer hue,
        Integer saturation,
        Integer brightness
) {
}