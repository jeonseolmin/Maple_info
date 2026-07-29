package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.dojang;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonCharacterDojangResponse(

        String date,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("world_name")
        String worldName,

        @JsonProperty("dojang_best_floor")
        Integer dojangBestFloor,

        @JsonProperty("date_dojang_record")
        String dateDojangRecord,

        @JsonProperty("dojang_best_time")
        Integer dojangBestTime
) {
}