package com.mapleInfo.maple_info_backend.event.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record NexonEventResponse(
        String title,
        String url,

        @JsonProperty("thumbnail_url")
        String thumbnailUrl,

        @JsonProperty("notice_id")
        Long noticeId,

        LocalDateTime date,

        @JsonProperty("date_event_start")
        LocalDateTime dateEventStart,

        @JsonProperty("date_event_end")
        LocalDateTime dateEventEnd
) {
}
