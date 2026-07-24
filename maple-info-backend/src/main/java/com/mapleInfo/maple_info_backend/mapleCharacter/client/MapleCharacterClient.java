package com.mapleInfo.maple_info_backend.mapleCharacter.client;

import com.mapleInfo.maple_info_backend.common.exception.NexonApiException;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.NexonCharacterBasicResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.NexonOcidResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
@RequiredArgsConstructor
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
}
