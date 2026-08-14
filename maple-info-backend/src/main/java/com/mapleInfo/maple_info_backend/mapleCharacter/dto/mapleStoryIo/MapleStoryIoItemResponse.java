package com.mapleInfo.maple_info_backend.mapleCharacter.dto.mapleStoryIo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MapleStoryIoItemResponse(
        Long id,
        String name,
        Boolean isCash
) {
}