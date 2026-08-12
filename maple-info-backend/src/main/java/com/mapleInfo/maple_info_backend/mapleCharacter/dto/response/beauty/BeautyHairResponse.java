package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty.NexonBeautyHairResponse;

public record BeautyHairResponse(

        String name,
        String baseColor,
        String mixColor,
        String mixRate
) {

    public static BeautyHairResponse from(
            NexonBeautyHairResponse response
    ) {
        if (response == null) {
            return null;
        }

        return new BeautyHairResponse(
                response.hairName(),
                response.baseColor(),
                response.mixColor(),
                response.mixRate()
        );
    }
}