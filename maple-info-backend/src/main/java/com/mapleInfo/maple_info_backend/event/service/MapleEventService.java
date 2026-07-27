package com.mapleInfo.maple_info_backend.event.service;

import com.mapleInfo.maple_info_backend.event.client.MapleEventClient;
import com.mapleInfo.maple_info_backend.event.dto.response.NexonEventListResponse;
import com.mapleInfo.maple_info_backend.event.dto.response.NexonEventResponse;
import com.mapleInfo.maple_info_backend.event.dto.response.EventResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MapleEventService {

    private final MapleEventClient mapleEventClient;


    @Cacheable("activeEvents")
    public List<EventResponse> getActiveEvents() {
        NexonEventListResponse response = mapleEventClient.getEvents();

        if (response == null || response.eventNotice() == null) {
            return List.of();
        }

        LocalDateTime now = LocalDateTime.now();

        return response.eventNotice().stream()
                .filter(event -> isActiveEvent(event, now))
                .sorted(
                        Comparator.comparing(
                                NexonEventResponse::dateEventEnd,
                                Comparator.nullsLast(Comparator.naturalOrder())
                        )
                )
                .map(EventResponse::from)
                .limit(8)
                .toList();
    }

    private boolean isActiveEvent(
            NexonEventResponse event,
            LocalDateTime now
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
