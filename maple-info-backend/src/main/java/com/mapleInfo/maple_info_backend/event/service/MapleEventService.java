package com.mapleInfo.maple_info_backend.event.service;

import com.mapleInfo.maple_info_backend.event.client.EventImageClient;
import com.mapleInfo.maple_info_backend.event.client.MapleEventClient;
import com.mapleInfo.maple_info_backend.event.dto.response.NexonEventListResponse;
import com.mapleInfo.maple_info_backend.event.dto.response.NexonEventResponse;
import com.mapleInfo.maple_info_backend.event.dto.response.EventResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MapleEventService {

    private final MapleEventClient mapleEventClient;
    private final EventImageClient eventImageClient;


    @Cacheable("activeEvents")
    public List<EventResponse> getActiveEvents() {

        NexonEventListResponse response =
                mapleEventClient.getEvents();

        if (response == null || response.eventNotice() == null) {
            return List.of();
        }

        Map<Long, String> imageMap =
                eventImageClient.getEventImages();

        OffsetDateTime now =
                OffsetDateTime.now(ZoneId.of("Asia/Seoul"));

        return response.eventNotice().stream()
                .filter(event ->
                        event.dateEventStart() == null ||
                                !event.dateEventStart().isAfter(now)
                )
                .filter(event ->
                        event.dateEventEnd() == null ||
                                !event.dateEventEnd().isBefore(now)
                )
                .map(event -> EventResponse.from(
                        event,
                        imageMap.get(event.noticeId())
                ))
                .toList();
    }

    private boolean isActiveEvent(
            NexonEventResponse event,
            OffsetDateTime now
    ) {
        boolean hasStarted =
                event.dateEventStart() == null
                        || !event.dateEventStart().isAfter(now);

        boolean hasNotEnded =
                event.dateEventEnd() == null
                        || !event.dateEventEnd().isBefore(now);

        return hasStarted && hasNotEnded;
    }
}
