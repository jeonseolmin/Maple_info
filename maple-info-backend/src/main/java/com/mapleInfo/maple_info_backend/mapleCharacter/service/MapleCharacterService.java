package com.mapleInfo.maple_info_backend.mapleCharacter.service;

import com.mapleInfo.maple_info_backend.mapleCharacter.client.MapleCharacterClient;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.mapleStoryIo.MapleStoryIoBeautyImage;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.android.NexonCharacterAndroidEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonCharacterBasicResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic.NexonOcidResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.beauty.NexonCharacterBeautyResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCharacterCashItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.dojang.NexonCharacterDojangResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonCharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa.NexonCharacterHexaMatrixResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa.NexonCharacterHexaStatResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.pet.NexonCharacterPetEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.popularity.NexonCharacterPopularityResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.ranking.NexonOverallRankingItemResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.ranking.NexonOverallRankingResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.skill.NexonCharacterSkillResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.symbol.NexonCharacterSymbolEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionArtifactResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union.NexonUnionResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.CharacterSearchResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.android.CharacterAndroidEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.beauty.CharacterBeautyResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash.CharacterCashEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment.CharacterEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.hexa.CharacterSixthJobResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.pet.CharacterPetEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.symbol.CharacterSymbolEquipmentResponse;
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
    private final BeautyImageService beautyImageService;
    private final SkinImageService skinImageService;

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
                    java.util.List.of(),
                    null
            );
        }

        return CharacterEquipmentResponse.from(
                nexonResponse
        );
    }

    @Transactional(readOnly = true)
    public CharacterCashEquipmentResponse getCashEquipment(
            String ocid
    ) {
        log.info(
                "캐시 장비 API 호출 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterCashItemResponse nexonResponse =
                mapleCharacterClient.getCashEquipment(ocid);

        return CharacterCashEquipmentResponse.from(
                nexonResponse
        );
    }

    @Transactional(readOnly = true)
    public CharacterBeautyResponse getBeautyEquipment(
            String ocid
    ) {
        log.info(
                "외형 정보 API 호출 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterBeautyResponse nexonResponse =
                mapleCharacterClient.getBeautyEquipment(ocid);

        if (nexonResponse == null) {
            log.warn(
                    "넥슨 외형 응답 없음 - ocidLength={}",
                    ocid != null ? ocid.length() : 0
            );

            return null;
        }

        /*
         * 기본 헤어 이미지
         */
        MapleStoryIoBeautyImage hairImage =
                nexonResponse.characterHair() == null
                        ? MapleStoryIoBeautyImage.empty()
                        : beautyImageService.findHairImage(
                        nexonResponse
                        .characterHair()
                        .hairName(),
                        nexonResponse
                        .characterHair()
                        .baseColor()
                );

        /*
         * 기본 성형 이미지
         */
        MapleStoryIoBeautyImage faceImage =
                nexonResponse.characterFace() == null
                        ? MapleStoryIoBeautyImage.empty()
                        : beautyImageService.findFaceImage(
                        nexonResponse
                        .characterFace()
                        .faceName(),
                        nexonResponse
                        .characterFace()
                        .baseColor()
                );

        /*
         * 기본 피부 이미지
         */
        String skinImageUrl =
                nexonResponse.characterSkin() == null
                        ? null
                        : skinImageService.findImageUrl(
                        nexonResponse
                        .characterSkin()
                        .skinName()
                );

        /*
         * 추가 헤어 이미지
         */
        MapleStoryIoBeautyImage additionalHairImage =
                nexonResponse.additionalCharacterHair() == null
                        ? MapleStoryIoBeautyImage.empty()
                        : beautyImageService.findHairImage(
                        nexonResponse
                        .additionalCharacterHair()
                        .hairName(),
                        nexonResponse
                        .additionalCharacterHair()
                        .baseColor()
                );

        /*
         * 추가 성형 이미지
         */
        MapleStoryIoBeautyImage additionalFaceImage =
                nexonResponse.additionalCharacterFace() == null
                        ? MapleStoryIoBeautyImage.empty()
                        : beautyImageService.findFaceImage(
                        nexonResponse
                        .additionalCharacterFace()
                        .faceName(),
                        nexonResponse
                        .additionalCharacterFace()
                        .baseColor()
                );

        /*
         * 추가 피부 이미지
         */
        String additionalSkinImageUrl =
                nexonResponse.additionalCharacterSkin() == null
                        ? null
                        : skinImageService.findImageUrl(
                        nexonResponse
                        .additionalCharacterSkin()
                        .skinName()
                );

        log.info(
                "외형 이미지 조회 완료 - "
                        + "hair={}, face={}, skin={}, "
                        + "additionalHair={}, additionalFace={}, "
                        + "additionalSkin={}",
                hairImage.imageUrl() != null,
                faceImage.imageUrl() != null,
                skinImageUrl != null,
                additionalHairImage.imageUrl() != null,
                additionalFaceImage.imageUrl() != null,
                additionalSkinImageUrl != null
        );

        return CharacterBeautyResponse.from(
                nexonResponse,
                hairImage.imageUrl(),
                faceImage.imageUrl(),
                skinImageUrl,
                additionalHairImage.imageUrl(),
                additionalFaceImage.imageUrl(),
                additionalSkinImageUrl
        );
    }

    public java.util.List<com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.UnionChampionResponse> getChampionInfoByNames(
            java.util.List<String> characterNames
    ) {
        log.info("수동 입력된 캐릭터들 전적 조회 시작 - 갯수: {}", characterNames.size());

        java.util.List<com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.UnionChampionResponse> resultList = new java.util.ArrayList<>();
        java.util.List<String> targetBosses = java.util.List.of("스우_HARD", "데미안_HARD", "검은마법사_HARD", "세렌_HARD", "칼로스_NORMAL");

        for (String name : characterNames) {
            try {
                // 1. OCID 조회
                waitForNextCall();
                NexonOcidResponse ocidRes = mapleCharacterClient.getOcid(name);

                // 2. 캐릭터 기본 정보 조회
                waitForNextCall();
                NexonCharacterBasicResponse basic = mapleCharacterClient.getBasic(ocidRes.ocid());

                // 3. 보스 킬 데이터 (현재 API 권한 문제로 예외 처리 및 빈 값으로 대체)
                java.util.List<String> myClearedBosses = new java.util.ArrayList<>();
                try {
                    waitForNextCall();
                    var bossKill = mapleCharacterClient.getCharacterBossKill(ocidRes.ocid());
                    if (bossKill != null && bossKill.boss_kill_data() != null) {
                        myClearedBosses.addAll(
                                bossKill.boss_kill_data().stream()
                                        .map(b -> b.boss_name() + "_" + b.boss_difficulty())
                                        .toList()
                        );
                    }
                } catch (Exception e) {
                    log.warn("보스 킬 API 권한이 없어 조회할 수 없습니다. (캐릭터명: {})", name);
                }

                // 4. 타겟 보스 매칭 리스트 생성
                java.util.List<com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.UnionChampionResponse.BossClearStatus> bossList = targetBosses.stream()
                        .map(target -> {
                            String[] split = target.split("_");
                            return new com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.UnionChampionResponse.BossClearStatus(
                                    split[0], split[1], "boss_" + split[0].toLowerCase() + ".png", myClearedBosses.contains(target)
                            );
                        }).toList();

                // 5. 결과 리스트에 추가
                resultList.add(new com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.UnionChampionResponse(
                        basic.characterName(),
                        basic.characterImage(),
                        basic.characterClass(),
                        basic.characterLevel(),
                        bossList
                ));

            } catch (Exception e) {
                log.error("캐릭터 조회 중 오류 발생: {}", name, e);
            }
        }
        return resultList;
    }

    @Transactional(readOnly = true)
    public CharacterPetEquipmentResponse getPetEquipment(
            String ocid
    ) {
        log.info(
                "펫 장비 API 호출 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterPetEquipmentResponse nexonResponse =
                mapleCharacterClient.getPetEquipment(ocid);

        if (nexonResponse == null) {
            log.warn(
                    "넥슨 펫 장비 응답 없음 - ocidLength={}",
                    ocid != null ? ocid.length() : 0
            );
        }

        return CharacterPetEquipmentResponse.from(
                nexonResponse
        );
    }

    @Transactional(readOnly = true)
    public CharacterAndroidEquipmentResponse getAndroidEquipment(
            String ocid
    ) {
        log.info(
                "안드로이드 장비 API 호출 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterAndroidEquipmentResponse nexonResponse =
                mapleCharacterClient.getAndroidEquipment(
                        ocid
                );

        if (nexonResponse == null) {
            log.warn(
                    "넥슨 안드로이드 장비 응답 없음 - ocidLength={}",
                    ocid != null ? ocid.length() : 0
            );
        }

        return CharacterAndroidEquipmentResponse.from(
                nexonResponse
        );
    }

    @Transactional(readOnly = true)
    public CharacterSymbolEquipmentResponse getSymbolEquipment(
            String ocid
    ) {
        log.info(
                "심볼 장비 API 호출 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterSymbolEquipmentResponse nexonResponse =
                mapleCharacterClient.getSymbolEquipment(
                        ocid
                );

        if (nexonResponse == null) {
            log.warn(
                    "넥슨 심볼 장비 응답 없음 - ocidLength={}",
                    ocid != null ? ocid.length() : 0
            );
        }

        return CharacterSymbolEquipmentResponse.from(
                nexonResponse
        );
    }

    @Transactional(readOnly = true)
    public CharacterSixthJobResponse getSixthJob(
            String ocid
    ) {
        log.info(
                "6차·HEXA 정보 조회 시작 - ocidLength={}",
                ocid != null ? ocid.length() : 0
        );

        NexonCharacterSkillResponse skillResponse =
                mapleCharacterClient.getSixthJobSkills(
                        ocid
                );

        NexonCharacterHexaMatrixResponse matrixResponse =
                mapleCharacterClient.getHexaMatrix(
                        ocid
                );

        NexonCharacterHexaStatResponse statResponse =
                mapleCharacterClient.getHexaStat(
                        ocid
                );

        log.info(
                "6차·HEXA 정보 조회 완료 - skills={}, cores={}, activeStatCores={}",
                skillResponse != null &&
                        skillResponse.skills() != null
                        ? skillResponse.skills().size()
                        : 0,
                matrixResponse != null &&
                        matrixResponse.cores() != null
                        ? matrixResponse.cores().size()
                        : 0,
                statResponse != null &&
                        statResponse.activeCores() != null
                        ? statResponse.activeCores().size()
                        : 0
        );

        return CharacterSixthJobResponse.from(
                skillResponse,
                matrixResponse,
                statResponse
        );
    }
}