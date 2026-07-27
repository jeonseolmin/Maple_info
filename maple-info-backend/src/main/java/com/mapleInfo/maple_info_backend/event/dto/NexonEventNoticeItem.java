package com.mapleInfo.maple_info_backend.event.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

public record NexonEventNoticeItem(

        String title,
        String url,

        @JsonProperty("notice_id")
        Long noticeId,

        OffsetDateTime date,

        @JsonProperty("date_event_start")
        OffsetDateTime eventStartAt,

        @JsonProperty("date_event_end")
        OffsetDateTime eventEndAt

) {
}