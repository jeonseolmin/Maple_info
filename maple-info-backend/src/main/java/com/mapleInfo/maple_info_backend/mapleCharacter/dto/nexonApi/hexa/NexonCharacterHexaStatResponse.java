package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterHexaStatResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_class")
        String characterClass,

        /*
         * 현재 적용 중인 HEXA 스탯 I
         */
        @JsonProperty("character_hexa_stat_core")
        List<NexonHexaStatCoreResponse> activeCores1,

        /*
         * 현재 적용 중인 HEXA 스탯 II
         */
        @JsonProperty("character_hexa_stat_core_2")
        List<NexonHexaStatCoreResponse> activeCores2,

        /*
         * 현재 적용 중인 HEXA 스탯 III
         */
        @JsonProperty("character_hexa_stat_core_3")
        List<NexonHexaStatCoreResponse> activeCores3,

        /*
         * 프리셋 HEXA 스탯 I
         */
        @JsonProperty("preset_hexa_stat_core")
        List<NexonHexaStatCoreResponse> presetCores1,

        /*
         * 프리셋 HEXA 스탯 II
         */
        @JsonProperty("preset_hexa_stat_core_2")
        List<NexonHexaStatCoreResponse> presetCores2,

        /*
         * 프리셋 HEXA 스탯 III
         */
        @JsonProperty("preset_hexa_stat_core_3")
        List<NexonHexaStatCoreResponse> presetCores3
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

    /*
     * 기존 서비스 로그 코드와의 호환성을 유지합니다.
     * I·II·III의 현재 적용 코어를 모두 합칩니다.
     */
    public List<NexonHexaStatCoreResponse> activeCores() {
        return mergeCores(
                activeCores1,
                activeCores2,
                activeCores3
        );
    }

    /*
     * 기존 코드와의 호환성을 유지합니다.
     * I·II·III의 프리셋 코어를 모두 합칩니다.
     */
    public List<NexonHexaStatCoreResponse> presetCores() {
        return mergeCores(
                presetCores1,
                presetCores2,
                presetCores3
        );
    }

    @SafeVarargs
    private static List<NexonHexaStatCoreResponse> mergeCores(
            List<NexonHexaStatCoreResponse>... coreLists
    ) {
        List<NexonHexaStatCoreResponse> result =
                new ArrayList<>();

        for (
                List<NexonHexaStatCoreResponse> cores
                : coreLists
        ) {
            if (cores != null) {
                result.addAll(cores);
            }
        }

        return List.copyOf(result);
    }
}