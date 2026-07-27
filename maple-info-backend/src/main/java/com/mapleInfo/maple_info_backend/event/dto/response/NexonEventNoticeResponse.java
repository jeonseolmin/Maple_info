package com.mapleInfo.maple_info_backend.event.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mapleInfo.maple_info_backend.event.dto.NexonEventNoticeItem;

import java.util.List;

public record NexonEventNoticeResponse(

        @JsonProperty("event_notice")
        List<NexonEventNoticeItem> eventNotices

) {
}