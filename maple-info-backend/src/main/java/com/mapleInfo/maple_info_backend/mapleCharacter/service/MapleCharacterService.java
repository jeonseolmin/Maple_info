package com.mapleInfo.maple_info_backend.mapleCharacter.service;

import com.mapleInfo.maple_info_backend.mapleCharacter.client.MapleCharacterClient;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.*;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.CharacterResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;
import com.mapleInfo.maple_info_backend.mapleCharacter.repository.MapleCharacterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service @RequiredArgsConstructor
@Slf4j
public class MapleCharacterService {
    private final MapleCharacterRepository mapleCharacterRepository;
    private final MapleCharacterClient mapleCharacterClient;


    @Transactional
    public CharacterSearchResponse searchCharacter(String characterName) {
        MapleCharacter character = mapleCharacterRepository
                .findByCharacterName(characterName)
                .orElseGet(() -> createCharacter(characterName));

        String ocid = character.getOcid();

        log.info("기본정보 API 호출");
        NexonCharacterBasicResponse basic =
                mapleCharacterClient.getBasic(ocid);

        log.info("유니온 API 호출");
        NexonUnionResponse union =
                mapleCharacterClient.getUnion(ocid);

        log.info("인기도 API 호출");
        NexonCharacterPopularityResponse popularity =
                mapleCharacterClient.getPopularity(ocid);

        log.info("아티팩트 API 호출");
        NexonUnionArtifactResponse artifact =
                mapleCharacterClient.getUnionArtifact(ocid);

        log.info("무릉 API 호출");
        NexonCharacterDojangResponse dojang =
                mapleCharacterClient.getDojang(ocid);

        waitForNextCall();

        log.info("랭크 API 호출");
        NexonOverallRankingResponse overallRankingResponse =
                mapleCharacterClient.getOverallRanking(ocid);

        Integer overallRanking =
                extractOverallRanking(overallRankingResponse);

        character.updateBasicInfo(basic);
        character.updateUnionInfo(union);
        character.updatePopularity(popularity);

        Integer unionArtifactLevel =
                extractUnionArtifactLevel(artifact);

        Integer dojangFloor =
                dojang != null
                        ? dojang.dojangBestFloor()
                        : null;

        return CharacterSearchResponse.from(
                character,
                unionArtifactLevel,
                dojangFloor,
                overallRanking
        );
    }

    private MapleCharacter createCharacter(String characterName) {

        NexonOcidResponse ocidResponse =
                mapleCharacterClient.getOcid(characterName);

        NexonCharacterBasicResponse nexonCharacterBasicResponse =
                mapleCharacterClient.getBasic(ocidResponse.ocid());

        MapleCharacter mapleCharacter =MapleCharacter.builder()
                .ocid(ocidResponse.ocid())
                .characterName(nexonCharacterBasicResponse.characterName())
                .worldName(nexonCharacterBasicResponse.worldName())
                .characterClass(nexonCharacterBasicResponse.characterClass())
                .level(nexonCharacterBasicResponse.characterLevel())
                .exp(nexonCharacterBasicResponse.characterExp())
                .expRate(Double.valueOf(nexonCharacterBasicResponse.characterExpRate()))
                .guildName(nexonCharacterBasicResponse.characterGuildName())
                .characterImage(nexonCharacterBasicResponse.characterImage())
                .syncedAt(LocalDateTime.now())
                .build();

        return mapleCharacterRepository.save(mapleCharacter);
    }
    private Integer extractUnionArtifactLevel(
            NexonUnionArtifactResponse artifact
    ) {
        if (artifact == null || artifact.effects() == null) {
            return null;
        }

        return artifact.effects().stream()
                .filter(effect -> effect != null && effect.level() != null)
                .map(NexonUnionArtifactEffectResponse::level)
                .max(Integer::compareTo)
                .orElse(null);
    }

    private Integer extractOverallRanking(
            NexonOverallRankingResponse response
    ) {
        if (response == null
                || response.ranking() == null
                || response.ranking().isEmpty()) {
            return null;
        }

        return response.ranking().get(0).ranking();
    }

    private void waitForNextCall() {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("API 호출 대기 중 중단되었습니다.", e);
        }
    }
}
