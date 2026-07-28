package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NexonUnionArtifactCrystalResponse(

        String name,

        @JsonProperty("validity_flag")
        String validityFlag,

        @JsonProperty("date_expire")
        String dateExpire,

        Integer level,

        @JsonProperty("crystal_option_name_1")
        String crystalOptionName1,

        @JsonProperty("crystal_option_name_2")
        String crystalOptionName2,

        @JsonProperty("crystal_option_name_3")
        String crystalOptionName3
) {
}
