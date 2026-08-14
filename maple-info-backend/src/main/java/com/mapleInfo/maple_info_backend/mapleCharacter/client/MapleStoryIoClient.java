package com.mapleInfo.maple_info_backend.mapleCharacter.client;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.mapleStoryIo.MapleStoryIoItemResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Slf4j
@Component
public class MapleStoryIoClient {

    private static final String BASE_URL =
            "https://maplestory.io";

    private static final String REGION = "KMS";
    private static final String VERSION = "389";

    private final RestClient restClient;

    public MapleStoryIoClient() {
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }

    public List<MapleStoryIoItemResponse> getHairList() {
        return getBeautyItems("Hair");
    }

    public List<MapleStoryIoItemResponse> getFaceList() {
        return getBeautyItems("Face");
    }

    public String createIconUrl(Long itemId) {
        if (itemId == null) {
            return null;
        }

        return BASE_URL
                + "/api/"
                + REGION
                + "/"
                + VERSION
                + "/item/"
                + itemId
                + "/icon";
    }

    private List<MapleStoryIoItemResponse> getBeautyItems(
            String subCategory
    ) {
        try {
            List<MapleStoryIoItemResponse> response =
                    restClient.get()
                            .uri(uriBuilder -> uriBuilder
                                    .path(
                                            "/api/{region}/{version}/item/"
                                    )
                                    .queryParam(
                                            "categoryFilter",
                                            "Character"
                                    )
                                    .queryParam(
                                            "overallCategoryFilter",
                                            "Equip"
                                    )
                                    .queryParam(
                                            "subCategoryFilter",
                                            subCategory
                                    )
                                    .build(
                                            REGION,
                                            VERSION
                                    )
                            )
                            .retrieve()
                            .body(
                                    new ParameterizedTypeReference<>() {
                                    }
                            );

            return response != null
                    ? response
                    : List.of();

        } catch (RestClientException e) {
            /*
             * 비공식 외부 API이므로 실패해도
             * 전체 캐릭터 조회를 실패시키지 않습니다.
             */
            log.warn(
                    "MapleStory.IO 외형 목록 조회 실패 - category={}",
                    subCategory,
                    e
            );

            return List.of();
        }
    }
}