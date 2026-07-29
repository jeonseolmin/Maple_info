package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.popularity;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonCharacterPopularityResponse(

        String date,

        @JsonProperty("popularity")
        Long popularity
) {
}