package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterHexaMatrixResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("character_hexa_core_equipment")
        List<NexonHexaCoreResponse> cores
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record NexonHexaCoreResponse(
            @JsonProperty("hexa_core_name")
            String name,

            @JsonProperty("hexa_core_level")
            Integer level,

            @JsonProperty("hexa_core_type")
            String type,

            @JsonProperty("linked_skill")
            List<NexonLinkedSkillResponse> linkedSkills
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record NexonLinkedSkillResponse(
            @JsonProperty("hexa_skill_id")
            String skillId
    ) {
    }
}