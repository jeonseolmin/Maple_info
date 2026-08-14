package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.hexa;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa.NexonCharacterHexaMatrixResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.hexa.NexonCharacterHexaStatResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.skill.NexonCharacterSkillResponse;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

public record CharacterSixthJobResponse(
        String date,
        String characterClass,
        String skillGrade,
        List<SixthJobSkillResponse> skills,
        List<HexaCoreResponse> cores,
        List<HexaStatCoreResponse> activeStatCores,
        List<HexaStatCoreResponse> presetStatCores
) {

    public enum HexaCoreType {
        SKILL,
        MASTERY,
        ENHANCEMENT,
        COMMON,
        UNKNOWN
    }

    public record SixthJobSkillResponse(
            String name,
            String description,
            Integer level,
            String effect,
            String nextEffect,
            String icon
    ) {
    }

    public record HexaCoreResponse(
            String name,
            Integer level,
            String originalType,
            HexaCoreType type,
            List<String> linkedSkillIds,
            boolean maxLevel
    ) {
    }

    public record HexaStatCoreResponse(
            String slotId,
            String mainStatName,
            String firstSubStatName,
            String secondSubStatName,
            Integer mainStatLevel,
            Integer firstSubStatLevel,
            Integer secondSubStatLevel,
            Integer grade,
            Integer totalLevel
    ) {
    }

    public static CharacterSixthJobResponse from(
            NexonCharacterSkillResponse skillResponse,
            NexonCharacterHexaMatrixResponse matrixResponse,
            NexonCharacterHexaStatResponse statResponse
    ) {
        return new CharacterSixthJobResponse(
                resolveDate(
                        skillResponse,
                        matrixResponse,
                        statResponse
                ),
                resolveCharacterClass(
                        skillResponse,
                        matrixResponse,
                        statResponse
                ),
                skillResponse != null
                        ? skillResponse.skillGrade()
                        : "6",
                convertSkills(skillResponse),
                convertCores(matrixResponse),
                convertStatCores(
                        statResponse != null
                                ? statResponse.activeCores()
                                : null
                ),
                convertStatCores(
                        statResponse != null
                                ? statResponse.presetCores()
                                : null
                )
        );
    }

    private static List<SixthJobSkillResponse> convertSkills(
            NexonCharacterSkillResponse response
    ) {
        if (
                response == null ||
                        response.skills() == null
        ) {
            return List.of();
        }

        return response.skills()
                .stream()
                .filter(Objects::nonNull)
                .map(skill ->
                        new SixthJobSkillResponse(
                                skill.name(),
                                skill.description(),
                                skill.level(),
                                skill.effect(),
                                skill.nextEffect(),
                                skill.icon()
                        )
                )
                .toList();
    }

    private static List<HexaCoreResponse> convertCores(
            NexonCharacterHexaMatrixResponse response
    ) {
        if (
                response == null ||
                        response.cores() == null
        ) {
            return List.of();
        }

        return response.cores()
                .stream()
                .filter(Objects::nonNull)
                .map(core -> {
                    List<String> linkedSkillIds =
                            core.linkedSkills() == null
                                    ? List.of()
                                    : core.linkedSkills()
                                      .stream()
                                      .filter(Objects::nonNull)
                                      .map(
                                              NexonCharacterHexaMatrixResponse
                                              .NexonLinkedSkillResponse
                                              ::skillId
                                      )
                                      .filter(Objects::nonNull)
                                      .filter(id ->
                                              !id.isBlank()
                                      )
                                      .toList();

                    return new HexaCoreResponse(
                            core.name(),
                            core.level(),
                            core.type(),
                            resolveCoreType(
                                    core.type()
                            ),
                            linkedSkillIds,
                            isMaxCoreLevel(
                                    core.level()
                            )
                    );
                })
                .toList();
    }

    private static List<HexaStatCoreResponse> convertStatCores(
            List<NexonCharacterHexaStatResponse.NexonHexaStatCoreResponse>
                    cores
    ) {
        if (cores == null) {
            return List.of();
        }

        return cores.stream()
                .filter(Objects::nonNull)
                .map(core ->
                        new HexaStatCoreResponse(
                                core.slotId(),
                                core.mainStatName(),
                                core.firstSubStatName(),
                                core.secondSubStatName(),
                                nullToZero(
                                        core.mainStatLevel()
                                ),
                                nullToZero(
                                        core.firstSubStatLevel()
                                ),
                                nullToZero(
                                        core.secondSubStatLevel()
                                ),
                                nullToZero(
                                        core.grade()
                                ),
                                calculateTotalLevel(
                                        core
                                )
                        )
                )
                .toList();
    }

    private static HexaCoreType resolveCoreType(
            String type
    ) {
        if (type == null || type.isBlank()) {
            return HexaCoreType.UNKNOWN;
        }

        String normalizedType =
                type.toLowerCase(
                        Locale.ROOT
                );

        if (
                normalizedType.contains(
                        "마스터리"
                )
        ) {
            return HexaCoreType.MASTERY;
        }

        if (
                normalizedType.contains(
                        "강화"
                )
        ) {
            return HexaCoreType.ENHANCEMENT;
        }

        if (
                normalizedType.contains(
                        "공용"
                ) ||
                        normalizedType.contains(
                                "공통"
                        )
        ) {
            return HexaCoreType.COMMON;
        }

        if (
                normalizedType.contains(
                        "스킬"
                )
        ) {
            return HexaCoreType.SKILL;
        }

        return HexaCoreType.UNKNOWN;
    }

    private static boolean isMaxCoreLevel(
            Integer level
    ) {
        return level != null &&
                level >= 30;
    }

    private static Integer calculateTotalLevel(
            NexonCharacterHexaStatResponse.NexonHexaStatCoreResponse core
    ) {
        return nullToZero(
                core.mainStatLevel()
        ) +
                nullToZero(
                        core.firstSubStatLevel()
                ) +
                nullToZero(
                        core.secondSubStatLevel()
                );
    }

    private static String resolveDate(
            NexonCharacterSkillResponse skillResponse,
            NexonCharacterHexaMatrixResponse matrixResponse,
            NexonCharacterHexaStatResponse statResponse
    ) {
        if (
                skillResponse != null &&
                        skillResponse.date() != null
        ) {
            return skillResponse.date();
        }

        if (
                matrixResponse != null &&
                        matrixResponse.date() != null
        ) {
            return matrixResponse.date();
        }

        return statResponse != null
                ? statResponse.date()
                : null;
    }

    private static String resolveCharacterClass(
            NexonCharacterSkillResponse skillResponse,
            NexonCharacterHexaMatrixResponse matrixResponse,
            NexonCharacterHexaStatResponse statResponse
    ) {
        if (
                skillResponse != null &&
                        skillResponse.characterClass() != null
        ) {
            return skillResponse.characterClass();
        }

        if (
                matrixResponse != null &&
                        matrixResponse.characterClass() != null
        ) {
            return matrixResponse.characterClass();
        }

        return statResponse != null
                ? statResponse.characterClass()
                : null;
    }

    private static Integer nullToZero(
            Integer value
    ) {
        return value != null
                ? value
                : 0;
    }

    public static CharacterSixthJobResponse empty() {
        return new CharacterSixthJobResponse(
                null,
                null,
                "6",
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
    }
}