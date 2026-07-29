package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.ranking;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonOverallRankingItemResponse (
        @JsonProperty("date")
        String date,

        @JsonProperty("ranking")
        Integer ranking,

        @JsonProperty("character_name")
        String characterName,

        @JsonProperty("world_name")
        String worldName,

        @JsonProperty("class_name")
        String className,

        @JsonProperty("sub_class_name")
        String subClassName,

        @JsonProperty("character_level")
        Integer characterLevel,

        @JsonProperty("character_exp")
        Long characterExp,

        @JsonProperty("character_popularity")
        Integer characterPopularity,

        @JsonProperty("character_guildname")
        String characterGuildName
){
}
