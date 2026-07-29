package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record NexonUnionArtifactResponse(

        String date,

        @JsonProperty("union_artifact_effect")
        List<NexonUnionArtifactEffectResponse> effects,

        @JsonProperty("union_artifact_crystal")
        List<NexonUnionArtifactCrystalResponse> crystals,

        @JsonProperty("union_artifact_remain_ap")
        Integer remainAp

) {
}
