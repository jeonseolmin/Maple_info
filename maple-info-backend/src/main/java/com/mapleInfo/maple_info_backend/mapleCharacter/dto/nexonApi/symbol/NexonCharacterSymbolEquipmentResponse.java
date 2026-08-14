package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.symbol;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterSymbolEquipmentResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("symbol")
        List<NexonSymbolResponse> symbols
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record NexonSymbolResponse(
            @JsonProperty("symbol_name")
            String name,

            @JsonProperty("symbol_icon")
            String icon,

            @JsonProperty("symbol_description")
            String description,

            @JsonProperty("symbol_force")
            Long force,

            @JsonProperty("symbol_level")
            Integer level,

            @JsonProperty("symbol_str")
            Long str,

            @JsonProperty("symbol_dex")
            Long dex,

            @JsonProperty("symbol_int")
            Long intelligence,

            @JsonProperty("symbol_luk")
            Long luk,

            @JsonProperty("symbol_hp")
            Long hp,

            @JsonProperty("symbol_drop_rate")
            String dropRate,

            @JsonProperty("symbol_meso_rate")
            String mesoRate,

            @JsonProperty("symbol_exp_rate")
            String expRate,

            @JsonProperty("symbol_growth_count")
            Long growthCount,

            @JsonProperty("symbol_require_growth_count")
            Long requireGrowthCount
    ) {
    }
}