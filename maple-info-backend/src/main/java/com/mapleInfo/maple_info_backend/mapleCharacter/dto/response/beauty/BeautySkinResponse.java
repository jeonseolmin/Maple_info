package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty.NexonBeautySkinResponse;

public record BeautySkinResponse(
        String name,
        String colorStyle,
        Integer hue,
        Integer saturation,
        Integer brightness,
        String imageUrl
) {

    public static BeautySkinResponse from(
            NexonBeautySkinResponse response,
            String imageUrl
    ) {
        if (response == null) {
            return null;
        }

        return new BeautySkinResponse(
                response.skinName(),
                response.colorStyle(),
                response.hue(),
                response.saturation(),
                response.brightness(),
                imageUrl
        );
    }
}