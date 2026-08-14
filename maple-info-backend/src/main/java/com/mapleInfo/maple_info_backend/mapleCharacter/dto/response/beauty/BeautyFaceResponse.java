package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty.NexonBeautyFaceResponse;

public record BeautyFaceResponse(
        String name,
        String baseColor,
        String mixColor,
        String mixRate,
        String imageUrl
) {

    public static BeautyFaceResponse from(
            NexonBeautyFaceResponse response,
            String imageUrl
    ) {
        if (response == null) {
            return null;
        }

        return new BeautyFaceResponse(
                response.faceName(),
                response.baseColor(),
                response.mixColor(),
                response.mixRate(),
                imageUrl
        );
    }
}