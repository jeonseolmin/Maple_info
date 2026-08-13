package com.mapleInfo.maple_info_backend.mapleCharacter.dto.mapleStoryIo;

public record MapleStoryIoBeautyImage(
        Long itemId,
        String imageUrl
) {

    public static MapleStoryIoBeautyImage empty() {
        return new MapleStoryIoBeautyImage(
                null,
                null
        );
    }
}