package com.mapleInfo.maple_info_backend.event.dto.response;

import com.mapleInfo.maple_info_backend.event.dto.NexonEventNoticeItem;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public record EventResponse(
        Long noticeId,
        String title,
        String linkUrl,
        String imageUrl,
        OffsetDateTime startAt,
        OffsetDateTime endAt
) {
    public static EventResponse from(
            NexonEventResponse event,
            String imageUrl
    ) {
        return new EventResponse(
                event.noticeId(),
                event.title(),
                event.url(),
                imageUrl,
                event.dateEventStart(),
                event.dateEventEnd()
        );
    }
}