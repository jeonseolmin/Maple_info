package com.mapleInfo.maple_info_backend.event.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public record NexonEventResponse(
        String title,
        String url,

        @JsonProperty("thumbnail_url")
        String thumbnailUrl,

        @JsonProperty("notice_id")
        Long noticeId,

        OffsetDateTime date,

        @JsonProperty("date_event_start")
        OffsetDateTime dateEventStart,

        @JsonProperty("date_event_end")
        OffsetDateTime dateEventEnd
) {
}
