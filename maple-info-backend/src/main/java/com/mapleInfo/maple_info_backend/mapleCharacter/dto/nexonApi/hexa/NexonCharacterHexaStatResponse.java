package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterHexaStatResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_class")
        String characterClass,

        /*
         * 현재 실제 적용 중인 HEXA 스탯 코어
         */
        @JsonProperty("character_hexa_stat_core")
        List<NexonHexaStatCoreResponse> activeCores,

        /*
         * 저장된 프리셋의 HEXA 스탯 코어
         */
        @JsonProperty("preset_hexa_stat_core")
        List<NexonHexaStatCoreResponse> presetCores
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record NexonHexaStatCoreResponse(
            @JsonProperty("slot_id")
            String slotId,

            @JsonProperty("main_stat_name")
            String mainStatName,

            @JsonProperty("sub_stat_name_1")
            String firstSubStatName,

            @JsonProperty("sub_stat_name_2")
            String secondSubStatName,

            @JsonProperty("main_stat_level")
            Integer mainStatLevel,

            @JsonProperty("sub_stat_level_1")
            Integer firstSubStatLevel,

            @JsonProperty("sub_stat_level_2")
            Integer secondSubStatLevel,

            @JsonProperty("stat_grade")
            Integer grade
    ) {
    }
}