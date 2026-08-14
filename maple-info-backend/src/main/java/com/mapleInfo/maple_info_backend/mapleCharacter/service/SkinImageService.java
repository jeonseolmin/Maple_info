package com.mapleInfo.maple_info_backend.mapleCharacter.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SkinImageService {

    private static final String BASE_URL =
            "https://maplestory.io/api/KMS/338/character/";

    private static final Map<String, Integer>
            SKIN_ID_BY_NAME = Map.ofEntries(
            Map.entry("기본 피부", 2000),
            Map.entry("태닝 피부", 2001),
            Map.entry("검은 피부", 2002),
            Map.entry("창백 피부", 2003),
            Map.entry("잿빛 피부", 2004),
            Map.entry("밀키 피부", 2009),
            Map.entry("분홍 피부", 2010),
            Map.entry("점토 피부", 2011),
            Map.entry("메르세데스 피부", 2012),
            Map.entry("유령 피부", 2013),
            Map.entry("뽀송 꽃잎 피부", 2015),
            Map.entry("홍조 꽃잎 피부", 2016),
            Map.entry("라벤더 피부", 2018),
            Map.entry("홍조 라벤더 피부", 2019)
    );

    public String findImageUrl(String skinName) {
        if (skinName == null || skinName.isBlank()) {
            return null;
        }

        Integer skinId =
                SKIN_ID_BY_NAME.get(
                        normalize(skinName)
                );

        if (skinId == null) {
            return null;
        }

        return BASE_URL + skinId;
    }

    private String normalize(String skinName) {
        return skinName
                .replaceAll("\\s+", " ")
                .trim();
    }
}