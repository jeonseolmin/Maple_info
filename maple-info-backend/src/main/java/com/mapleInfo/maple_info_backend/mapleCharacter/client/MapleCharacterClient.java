package com.mapleInfo.maple_info_backend.mapleCharacter.client;

import com.mapleInfo.maple_info_backend.common.exception.NexonApiException;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonCharacterBasicResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonOcidResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCharacterCashItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.dojang.NexonCharacterDojangResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonCharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.popularity.NexonCharacterPopularityResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.ranking.NexonOverallRankingResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionArtifactResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriBuilder;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
@Slf4j
public class MapleCharacterClient {

    private static final ZoneId KOREA_ZONE =
            ZoneId.of("Asia/Seoul");

    private final RestClient restClient;

    public NexonOcidResponse getOcid(String characterName) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/id")
                        .queryParam(
                                "character_name",
                                characterName
                        )
                        .build()
                )
                .retrieve()
                .body(NexonOcidResponse.class);
    }

    public NexonCharacterBasicResponse getBasic(String ocid) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(
                                    "/maplestory/v1/character/basic"
                            )
                            .queryParam(
                                    "ocid",
                                    normalizeOcid(ocid)
                            )
                            .build()
                    )
                    .retrieve()
                    .body(
                            NexonCharacterBasicResponse.class
                    );

        } catch (RestClientException e) {
            throw new NexonApiException(
                    "넥슨 기본정보 API 호출에 실패했습니다.",
                    e
            );
        }
    }

    public NexonCharacterPopularityResponse getPopularity(
            String ocid
    ) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(
                                "/maplestory/v1/character/popularity"
                        )
                        .queryParam(
                                "ocid",
                                normalizeOcid(ocid)
                        )
                        .build()
                )
                .retrieve()
                .body(
                        NexonCharacterPopularityResponse.class
                );
    }

    public NexonUnionResponse getUnion(String ocid) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/user/union")
                        .queryParam(
                                "ocid",
                                normalizeOcid(ocid)
                        )
                        .build()
                )
                .retrieve()
                .body(NexonUnionResponse.class);
    }

    public NexonUnionArtifactResponse getUnionArtifact(
            String ocid
    ) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(
                                "/maplestory/v1/user/union-artifact"
                        )
                        .queryParam(
                                "ocid",
                                normalizeOcid(ocid)
                        )
                        .build()
                )
                .retrieve()
                .body(
                        NexonUnionArtifactResponse.class
                );
    }

    public NexonCharacterDojangResponse getDojang(
            String ocid
    ) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(
                                "/maplestory/v1/character/dojang"
                        )
                        .queryParam(
                                "ocid",
                                normalizeOcid(ocid)
                        )
                        .build()
                )
                .retrieve()
                .body(
                        NexonCharacterDojangResponse.class
                );
    }

    public NexonOverallRankingResponse getOverallRanking(
            String ocid
    ) {
        String rankingDate = LocalDate.now(KOREA_ZONE)
                .minusDays(1)
                .format(DateTimeFormatter.ISO_LOCAL_DATE);

        return getOverallRanking(
                rankingDate,
                ocid,
                null,
                null
        );
    }

    public NexonOverallRankingResponse getOverallRanking(
            String date,
            String ocid,
            String worldName,
            String rankingClass
    ) {
        if (date == null || date.isBlank()) {
            throw new IllegalArgumentException(
                    "랭킹 기준일이 비어 있습니다."
            );
        }

        String normalizedOcid = normalizeOcid(ocid);

        log.info(
                "랭킹 요청 - date={}, ocidLength={}, worldName={}, class={}",
                date,
                normalizedOcid.length(),
                worldName,
                rankingClass
        );

        try {
            return restClient.get()
                    .uri(uriBuilder -> buildOverallRankingUri(
                            uriBuilder,
                            date,
                            normalizedOcid,
                            worldName,
                            rankingClass
                    ))
                    .retrieve()
                    .body(
                            NexonOverallRankingResponse.class
                    );

        } catch (RestClientException e) {
            throw new NexonApiException(
                    "넥슨 종합 랭킹 API 호출에 실패했습니다.",
                    e
            );
        }
    }

    private java.net.URI buildOverallRankingUri(
            UriBuilder uriBuilder,
            String date,
            String ocid,
            String worldName,
            String rankingClass
    ) {
        UriBuilder builder = uriBuilder
                .path("/maplestory/v1/ranking/overall")
                .queryParam("date", date)
                .queryParam("ocid", ocid);

        if (worldName != null && !worldName.isBlank()) {
            builder.queryParam(
                    "world_name",
                    worldName.trim()
            );
        }

        if (rankingClass != null
                && !rankingClass.isBlank()) {
            builder.queryParam(
                    "class",
                    rankingClass.trim()
            );
        }

        return builder.build();
    }

    private String normalizeOcid(String ocid) {
        if (ocid == null || ocid.isBlank()) {
            throw new IllegalArgumentException(
                    "OCID가 비어 있습니다."
            );
        }

        return ocid.trim();
    }

    public NexonCharacterEquipmentResponse getEquipment(
            String ocid
    ) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(
                                    "/maplestory/v1/character/item-equipment"
                            )
                            .queryParam(
                                    "ocid",
                                    normalizeOcid(ocid)
                            )
                            .build()
                    )
                    .retrieve()
                    .body(
                            NexonCharacterEquipmentResponse.class
                    );

        } catch (RestClientException e) {
            throw new NexonApiException(
                    "넥슨 장비 정보 API 호출에 실패했습니다.",
                    e
            );
        }
    }
    public NexonCharacterCashItemResponse getCashEquipment(
            String ocid
    ) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path(
                                    "/maplestory/v1/character/cashitem-equipment"
                            )
                            .queryParam(
                                    "ocid",
                                    normalizeOcid(ocid)
                            )
                            .build()
                    )
                    .retrieve()
                    .body(
                            NexonCharacterCashItemResponse.class
                    );

        } catch (RestClientException e) {
            throw new NexonApiException(
                    "넥슨 캐시 장비 API 호출에 실패했습니다.",
                    e
            );
        }
    }
    public com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.UnionRaiderDto getUnionRaider(
            String ocid
    ) {
        String date = LocalDate.now(KOREA_ZONE).minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/maplestory/v1/user/union-raider")
                            .queryParam("ocid", normalizeOcid(ocid))
                            .queryParam("date", date)
                            .build()
                    )
                    .retrieve()
                    .body(com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.UnionRaiderDto.class);
        } catch (RestClientException e) {
            throw new NexonApiException("넥슨 유니온 공격대 API 호출에 실패했습니다.", e);
        }
    }

    public com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.boss.CharacterBossKillDto getCharacterBossKill(
            String ocid
    ) {
        String date = LocalDate.now(KOREA_ZONE).minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/maplestory/v1/character/boss-kill")
                            .queryParam("ocid", normalizeOcid(ocid))
                            .queryParam("date", date)
                            .build()
                    )
                    .retrieve()
                    .body(com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.boss.CharacterBossKillDto.class);
        } catch (RestClientException e) {
            throw new NexonApiException("넥슨 보스 킬 API 호출에 실패했습니다.", e);
        }
    }
}