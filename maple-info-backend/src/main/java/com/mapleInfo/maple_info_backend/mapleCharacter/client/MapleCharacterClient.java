package com.mapleInfo.maple_info_backend.mapleCharacter.client;

import com.mapleInfo.maple_info_backend.common.exception.NexonApiException;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
@Slf4j
public class MapleCharacterClient {
    private final RestClient restClient;

    public NexonOcidResponse getOcid(String characterName){
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                                .path("/maplestory/v1/id")
                                .queryParam("character_name",characterName)
                                .build()
                        ).retrieve()
                .body(NexonOcidResponse.class);
    }

    public NexonCharacterBasicResponse getBasic(String ocid){
        try{
            return restClient.get()
                    .uri(
                            urlBuilder -> urlBuilder
                                    .path("/maplestory/v1/character/basic")
                                    .queryParam("ocid",ocid.trim())
                                    .build()
                    ).retrieve()
                    .body(NexonCharacterBasicResponse.class);
        }
        catch (RestClientException e){
            throw  new NexonApiException("넥슨 API 호출에 실패했습니다.",e);
        }

    }

    public NexonCharacterPopularityResponse getPopularity(String ocid) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/character/popularity")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .body(NexonCharacterPopularityResponse.class);
    }

    public NexonUnionResponse getUnion(String ocid) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/user/union")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .body(NexonUnionResponse.class);
    }

    public NexonUnionArtifactResponse getUnionArtifact(String ocid) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/user/union-artifact")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .body(NexonUnionArtifactResponse.class);
    }

    public NexonCharacterDojangResponse getDojang(String ocid) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/character/dojang")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .body(NexonCharacterDojangResponse.class);
    }

    public NexonOverallRankingResponse getOverallRanking(String ocid) {
        String date = LocalDate.now(ZoneId.of("Asia/Seoul"))
                .minusDays(1)
                .format(DateTimeFormatter.ISO_LOCAL_DATE);

        log.info("랭킹 요청 date=[{}], ocid=[{}], ocidLength={}",
                date, ocid, ocid == null ? null : ocid.length());
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/maplestory/v1/ranking/overall")
                        .queryParam("date", date)
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .body(NexonOverallRankingResponse.class);
    }
}
