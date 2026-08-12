package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

public record NexonTitleResponse(
        @JsonProperty("title_name")
        String titleName,

        @JsonProperty("title_icon")
        String titleIcon,

        @JsonProperty("title_description")
        String titleDescription,

        @JsonProperty("date_expire")
        String dateExpire,

        @JsonProperty("date_option_expire")
        String dateOptionExpire,

        @JsonProperty("title_shape_name")
        String titleShapeName,

        @JsonProperty("title_shape_icon")
        String titleShapeIcon,

        @JsonProperty("title_shape_description")
        String titleShapeDescription
) {
}