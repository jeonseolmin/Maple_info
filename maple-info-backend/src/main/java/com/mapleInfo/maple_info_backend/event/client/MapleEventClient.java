package com.mapleInfo.maple_info_backend.event.client;

import com.mapleInfo.maple_info_backend.event.dto.response.NexonEventListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class MapleEventClient {

    private final RestClient nexonRestClient;

    public NexonEventListResponse getEvents() {
        return nexonRestClient.get()
                .uri("/maplestory/v1/notice-event")
                .retrieve()
                .body(NexonEventListResponse.class);
    }
}
