package com.mapleInfo.maple_info_backend.event.controller;

import com.mapleInfo.maple_info_backend.event.dto.response.EventResponse;
import com.mapleInfo.maple_info_backend.event.service.MapleEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class MapleEventController {

    private final MapleEventService mapleEventService;

    @GetMapping
    public List<EventResponse> getActiveEvents() {
        return mapleEventService.getActiveEvents();
    }
}