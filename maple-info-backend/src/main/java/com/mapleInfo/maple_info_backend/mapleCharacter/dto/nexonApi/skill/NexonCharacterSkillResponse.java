package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.skill;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterSkillResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("character_skill_grade")
        String skillGrade,

        @JsonProperty("character_skill")
        List<NexonSkillResponse> skills
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record NexonSkillResponse(
            @JsonProperty("skill_name")
            String name,

            @JsonProperty("skill_description")
            String description,

            @JsonProperty("skill_level")
            Integer level,

            @JsonProperty("skill_effect")
            String effect,

            @JsonProperty("skill_effect_next")
            String nextEffect,

            @JsonProperty("skill_icon")
            String icon
    ) {
    }
}