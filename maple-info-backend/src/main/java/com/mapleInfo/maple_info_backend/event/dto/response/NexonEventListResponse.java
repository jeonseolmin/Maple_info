package com.mapleInfo.maple_info_backend.event.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record NexonEventListResponse(
        @JsonProperty("event_notice")
        List<NexonEventResponse> eventNotice
) {
}