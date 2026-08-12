package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonCashItemOptionResponse(
        @JsonProperty("option_type")
        String optionType,

        @JsonProperty("option_value")
        String optionValue
) {
}