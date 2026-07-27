package com.mapleInfo.maple_info_backend.event.dto.response;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String imageUrl,
        String linkUrl,
        LocalDateTime startAt,
        LocalDateTime endAt
) {
    public static EventResponse from(NexonEventResponse event) {
        return new EventResponse(
                event.noticeId(),
                event.title(),
                event.thumbnailUrl(),
                event.url(),
                event.dateEventStart(),
                event.dateEventEnd()
        );
    }
}