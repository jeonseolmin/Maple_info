package com.mapleInfo.maple_info_backend.mapleCharacter.service;

import com.mapleInfo.maple_info_backend.mapleCharacter.client.MapleCharacterClient;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonCharacterBasicResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonOcidResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.dojang.NexonCharacterDojangResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonCharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.popularity.NexonCharacterPopularityResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.ranking.NexonOverallRankingItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.ranking.NexonOverallRankingResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionArtifactResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.CharacterSearchResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment.CharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.entity.MapleCharacter;
import com.mapleInfo.maple_info_backend.mapleCharacter.repository.MapleCharacterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MapleCharacterService {

    private static final ZoneId KOREA_ZONE =
            ZoneId.of("Asia/Seoul");

    private final MapleCharacterRepository mapleCharacterRepository;
    private final MapleCharacterClient mapleCharacterClient;

    @Transactional
    public CharacterSearchResponse searchCharacter(
            String characterName
    ) {
        Optional<MapleCharacter> savedCharacter =
                mapleCharacterRepository.findByCharacterName(
                        characterName
                );

        MapleCharacter character;
        NexonCharacterBasicResponse basic;

        /*
         * 1. 캐릭터 기본정보 조회
         */
        if (savedCharacter.isPresent()) {
            character = savedCharacter.get();

            log.info(
                    "기존 캐릭터 기본정보 API 호출 - characterName={}",
                    characterName
            );

            basic = mapleCharacterClient.getBasic(
                    character.getOcid()
            );

            character.updateBasicInfo(basic);
        } else {
            log.info(
                    "신규 캐릭터 OCID API 호출 - characterName={}",
                    characterName
            );

            NexonOcidResponse ocidResponse =
                    mapleCharacterClient.getOcid(characterName);

            waitForNextCall();

            log.info(
                    "신규 캐릭터 기본정보 API 호출 - characterName={}",
                    characterName
            );

            basic = mapleCharacterClient.getBasic(
                    ocidResponse.ocid()
            );

            character = createCharacter(
                    ocidResponse.ocid(),
                    basic
            );
        }

        String ocid = character.getOcid();

        /*
         * 2. 유니온 정보 조회
         */
        waitForNextCall();

        log.info(
                "유니온 API 호출 - characterName={}",
                character.getCharacterName()
        );

        NexonUnionResponse union =
                mapleCharacterClient.getUnion(ocid);

        character.updateUnionInfo(union);

        /*
         * 3. 인기도 조회
         */
        waitForNextCall();

        log.info(
                "인기도 API 호출 - characterName={}",
                character.getCharacterName()
        );

        NexonCharacterPopularityResponse popularity =
                mapleCharacterClient.getPopularity(ocid);

        character.updatePopularity(popularity);

        /*
         * 4. 유니온 아티팩트 조회
         */
        waitForNextCall();

        log.info(
                "아티팩트 API 호출 - characterName={}",
                character.getCharacterName()
        );

        NexonUnionArtifactResponse artifact =
                mapleCharacterClient.getUnionArtifact(ocid);

        /*
         * 5. 무릉도장 정보 조회
         */
        waitForNextCall();

        log.info(
                "무릉 API 호출 - characterName={}",
                character.getCharacterName()
        );

        NexonCharacterDojangResponse dojang =
                mapleCharacterClient.getDojang(ocid);

        /*
         * 랭킹 조회 기준일입니다.
         * 전날 랭킹을 조회합니다.
         */
        LocalDate rankingLocalDate =
                LocalDate.now(KOREA_ZONE).minusDays(1);

        String rankingDate =
                rankingLocalDate.format(
                        DateTimeFormatter.ISO_LOCAL_DATE
                );

        /*
         * 6. 종합 랭킹 조회
         */
        waitForNextCall();

        log.info(
                "종합 랭킹 API 호출 - characterName={}, date={}",
                character.getCharacterName(),
                rankingDate
        );

        NexonOverallRankingResponse overallResponse =
                mapleCharacterClient.getOverallRanking(
                        rankingDate,
                        ocid,
                        null,
                        null
                );

        Integer overallRanking =
                extractRanking(
                        overallResponse,
                        character.getCharacterName()
                );


        OverallClassInfo overallClassInfo =
                extractOverallClassInfo(
                        overallResponse,
                        character.getCharacterName()
                );

        /*
         * 7. 월드 랭킹 조회
         */
        waitForNextCall();

        log.info(
                "월드 랭킹 API 호출 - characterName={}, worldName={}",
                character.getCharacterName(),
                basic.worldName()
        );

        NexonOverallRankingResponse worldResponse =
                mapleCharacterClient.getOverallRanking(
                        rankingDate,
                        ocid,
                        basic.worldName(),
                        null
                );

        Integer worldRanking =
                extractRanking(
                        worldResponse,
                        character.getCharacterName()
                );

        /*
         * 8. 직업 랭킹 조회
         */
        Integer classRanking = null;

        String rankingClass =
                makeRankingClass(overallClassInfo);

        if (rankingClass != null) {
            waitForNextCall();

            log.info(
                    "직업 랭킹 API 호출 - characterName={}, class={}",
                    character.getCharacterName(),
                    rankingClass
            );

            NexonOverallRankingResponse classResponse =
                    mapleCharacterClient.getOverallRanking(
                            rankingDate,
                            ocid,
                            null,
                            rankingClass
                    );

            classRanking =
                    extractRanking(
                            classResponse,
                            character.getCharacterName()
                    );
        } else {
            log.warn(
                    "직업 랭킹 class 값을 생성하지 못했습니다. "
                            + "characterName={}",
                    character.getCharacterName()
            );
        }

        log.info(
                "랭킹 조회 완료 - characterName={}, "
                        + "overallRanking={}, worldRanking={}, "
                        + "classRanking={}",
                character.getCharacterName(),
                overallRanking,
                worldRanking,
                classRanking
        );


        character.updateRanking(
                overallRanking,
                worldRanking,
                classRanking,
                rankingLocalDate
        );



        Integer unionArtifactLevel =
                extractUnionArtifactLevel(union);

        Integer dojangFloor =
                dojang != null
                        ? dojang.dojangBestFloor()
                        : null;


        return CharacterSearchResponse.from(
                character,
                unionArtifactLevel,
                dojangFloor
        );
    }

    private MapleCharacter createCharacter(
            String ocid,
            NexonCharacterBasicResponse basic
    ) {
        MapleCharacter mapleCharacter =
                MapleCharacter.builder()
                        .ocid(ocid)
                        .characterName(
                                basic.characterName()
                        )
                        .worldName(
                                basic.worldName()
                        )
                        .characterClass(
                                basic.characterClass()
                        )
                        .characterClassLevel(
                                basic.characterClassLevel()
                        )
                        .level(
                                basic.characterLevel()
                        )
                        .exp(
                                basic.characterExp()
                        )
                        .expRate(
                                parseExpRate(
                                        basic.characterExpRate()
                                )
                        )
                        .guildName(
                                basic.characterGuildName()
                        )
                        .characterImage(
                                basic.characterImage()
                        )
                        .syncedAt(
                                LocalDateTime.now()
                        )
                        .build();

        return mapleCharacterRepository.save(
                mapleCharacter
        );
    }


    private Optional<NexonOverallRankingItemResponse>
    findCharacterRanking(
            NexonOverallRankingResponse response,
            String characterName
    ) {
        if (response == null
                || response.ranking() == null
                || response.ranking().isEmpty()) {
            return Optional.empty();
        }

        return response.ranking()
                .stream()
                .filter(item -> item != null)
                .filter(item ->
                        item.characterName() != null
                )
                .filter(item ->
                        item.characterName()
                                .equals(characterName)
                )
                .findFirst();
    }


    private Integer extractRanking(
            NexonOverallRankingResponse response,
            String characterName
    ) {
        return findCharacterRanking(
                response,
                characterName
        )
                .map(
                        NexonOverallRankingItemResponse::ranking
                )
                .orElse(null);
    }


    private OverallClassInfo extractOverallClassInfo(
            NexonOverallRankingResponse response,
            String characterName
    ) {
        return findCharacterRanking(
                response,
                characterName
        )
                .map(item ->
                        new OverallClassInfo(
                                item.className(),
                                item.subClassName()
                        )
                )
                .orElse(null);
    }

    private String makeRankingClass(
            OverallClassInfo classInfo
    ) {
        if (classInfo == null
                || classInfo.className() == null
                || classInfo.className().isBlank()) {
            return null;
        }

        String className =
                classInfo.className().trim();

        String subClassName =
                classInfo.subClassName();

        if (subClassName == null
                || subClassName.isBlank()) {
            return className + "-전체 전직";
        }

        return className
                + "-"
                + subClassName.trim();
    }

    private Integer extractUnionArtifactLevel(
            NexonUnionResponse union
    ) {
        if (union == null) {
            return null;
        }

        return union.unionArtifactLevel();
    }

    private Double parseExpRate(String expRate) {
        if (expRate == null || expRate.isBlank()) {
            return null;
        }

        return Double.parseDouble(
                expRate.replace("%", "")
        );
    }

    private record OverallClassInfo(
            String className,
            String subClassName
    ) {
    }

    private void waitForNextCall() {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            throw new IllegalStateException(
                    "API 호출 대기 중 중단되었습니다.",
                    e
            );
        }
    }

    public CharacterEquipmentResponse getEquipment(
            String ocid
    ) {
        log.info(
                "장비 API 호출 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterEquipmentResponse nexonResponse =
                mapleCharacterClient.getEquipment(ocid);

        if (nexonResponse == null) {
            return new CharacterEquipmentResponse(
                    null,
                    null,
                    null,
                    null,
                    java.util.List.of()
            );
        }

        return CharacterEquipmentResponse.from(
                nexonResponse
        );
    }
}