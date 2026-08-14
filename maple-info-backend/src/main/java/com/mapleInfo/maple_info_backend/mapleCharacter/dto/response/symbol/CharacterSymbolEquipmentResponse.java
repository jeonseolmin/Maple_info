package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.symbol;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.symbol.NexonCharacterSymbolEquipmentResponse;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

public record CharacterSymbolEquipmentResponse(
        String date,
        String characterClass,
        Long totalForce,
        SymbolStatSummary totalStats,
        List<SymbolResponse> symbols
) {

    public enum SymbolType {
        ARCANE,
        AUTHENTIC,
        GRAND_AUTHENTIC,
        UNKNOWN
    }

    public record SymbolStatSummary(
            Long str,
            Long dex,
            Long intelligence,
            Long luk,
            Long hp,
            Long dropRate,
            Long mesoRate,
            Long expRate
    ) {
    }

    public record SymbolResponse(
            String name,
            String icon,
            String description,
            SymbolType type,
            Long force,
            Integer level,
            Long str,
            Long dex,
            Long intelligence,
            Long luk,
            Long hp,
            Long dropRate,
            Long mesoRate,
            Long expRate,
            Long growthCount,
            Long requireGrowthCount,
            Double growthRate,
            boolean completed
    ) {
    }

    public static CharacterSymbolEquipmentResponse from(
            NexonCharacterSymbolEquipmentResponse response
    ) {
        if (response == null) {
            return empty();
        }

        List<SymbolResponse> symbols =
                response.symbols() == null
                        ? List.of()
                        : response.symbols()
                          .stream()
                          .filter(Objects::nonNull)
                          .map(
                                  CharacterSymbolEquipmentResponse
                                  ::convertSymbol
                          )
                          .toList();

        long totalForce = symbols.stream()
                .mapToLong(symbol ->
                        nullToZero(symbol.force())
                )
                .sum();

        SymbolStatSummary totalStats =
                new SymbolStatSummary(
                        sumStat(
                                symbols,
                                StatType.STR
                        ),
                        sumStat(
                                symbols,
                                StatType.DEX
                        ),
                        sumStat(
                                symbols,
                                StatType.INT
                        ),
                        sumStat(
                                symbols,
                                StatType.LUK
                        ),
                        sumStat(
                                symbols,
                                StatType.HP
                        ),
                        sumStat(
                                symbols,
                                StatType.DROP_RATE
                        ),
                        sumStat(
                                symbols,
                                StatType.MESO_RATE
                        ),
                        sumStat(
                                symbols,
                                StatType.EXP_RATE
                        )
                );

        return new CharacterSymbolEquipmentResponse(
                response.date(),
                response.characterClass(),
                totalForce,
                totalStats,
                symbols
        );
    }

    private static SymbolResponse convertSymbol(
            NexonCharacterSymbolEquipmentResponse.NexonSymbolResponse symbol
    ) {
        SymbolType symbolType =
                resolveType(symbol.name());

        Long growthCount =
                nullToZero(symbol.growthCount());

        Long requireGrowthCount =
                nullToZero(
                        symbol.requireGrowthCount()
                );

        boolean completed =
                isCompleted(
                        symbolType,
                        symbol.level(),
                        requireGrowthCount
                );

        return new SymbolResponse(
                symbol.name(),
                symbol.icon(),
                symbol.description(),
                symbolType,
                nullToZero(symbol.force()),
                symbol.level(),
                nullToZero(symbol.str()),
                nullToZero(symbol.dex()),
                nullToZero(symbol.intelligence()),
                nullToZero(symbol.luk()),
                nullToZero(symbol.hp()),
                parseRate(symbol.dropRate()),
                parseRate(symbol.mesoRate()),
                parseRate(symbol.expRate()),
                growthCount,
                requireGrowthCount,
                calculateGrowthRate(
                        growthCount,
                        requireGrowthCount,
                        completed
                ),
                completed
        );
    }
    private static boolean isCompleted(
            SymbolType symbolType,
            Integer level,
            Long requireGrowthCount
    ) {
        if (level == null || level <= 0) {
            return false;
        }

        return switch (symbolType) {
            case ARCANE ->
                    level >= 20;

            case AUTHENTIC,
                 GRAND_AUTHENTIC ->
                    level >= 11;

            case UNKNOWN ->
                    requireGrowthCount != null &&
                            requireGrowthCount == 0;
        };
    }
    private static Long parseRate(
            String value
    ) {
        if (
                value == null ||
                        value.isBlank()
        ) {
            return 0L;
        }

        String normalizedValue = value
                .replace("%", "")
                .replace(",", "")
                .trim();

        if (normalizedValue.isBlank()) {
            return 0L;
        }

        try {
            return Long.parseLong(
                    normalizedValue
            );
        } catch (NumberFormatException e) {
            return 0L;
        }
    }
    private static SymbolType resolveType(
            String symbolName
    ) {
        if (
                symbolName == null ||
                        symbolName.isBlank()
        ) {
            return SymbolType.UNKNOWN;
        }

        String normalizedName =
                symbolName.toLowerCase(
                        Locale.ROOT
                );

        /*
         * 그랜드 어센틱에도 '어센틱'이 포함되므로
         * 그랜드 어센틱을 먼저 검사해야 합니다.
         */
        if (
                normalizedName.contains(
                        "그랜드 어센틱"
                )
        ) {
            return SymbolType.GRAND_AUTHENTIC;
        }

        if (
                normalizedName.contains(
                        "어센틱"
                )
        ) {
            return SymbolType.AUTHENTIC;
        }

        if (
                normalizedName.contains(
                        "아케인"
                )
        ) {
            return SymbolType.ARCANE;
        }

        return SymbolType.UNKNOWN;
    }

    private static Double calculateGrowthRate(
            Long growthCount,
            Long requireGrowthCount,
            boolean completed
    ) {
        if (completed) {
            return 100.0;
        }

        if (
                requireGrowthCount == null ||
                        requireGrowthCount <= 0
        ) {
            return 0.0;
        }

        double rate =
                growthCount.doubleValue() /
                        requireGrowthCount.doubleValue() *
                        100.0;

        double limitedRate =
                Math.max(
                        0.0,
                        Math.min(100.0, rate)
                );

        return Math.round(
                limitedRate * 10.0
        ) / 10.0;
    }

    private static Long sumStat(
            List<SymbolResponse> symbols,
            StatType statType
    ) {
        return symbols.stream()
                .mapToLong(symbol ->
                        switch (statType) {
                            case STR ->
                                    nullToZero(
                                            symbol.str()
                                    );

                            case DEX ->
                                    nullToZero(
                                            symbol.dex()
                                    );

                            case INT ->
                                    nullToZero(
                                            symbol.intelligence()
                                    );

                            case LUK ->
                                    nullToZero(
                                            symbol.luk()
                                    );

                            case HP ->
                                    nullToZero(
                                            symbol.hp()
                                    );

                            case DROP_RATE ->
                                    nullToZero(
                                            symbol.dropRate()
                                    );

                            case MESO_RATE ->
                                    nullToZero(
                                            symbol.mesoRate()
                                    );

                            case EXP_RATE ->
                                    nullToZero(
                                            symbol.expRate()
                                    );
                        }
                )
                .sum();
    }

    private static long nullToZero(
            Long value
    ) {
        return value != null
                ? value
                : 0L;
    }

    private static CharacterSymbolEquipmentResponse empty() {
        return new CharacterSymbolEquipmentResponse(
                null,
                null,
                0L,
                new SymbolStatSummary(
                        0L,
                        0L,
                        0L,
                        0L,
                        0L,
                        0L,
                        0L,
                        0L
                ),
                List.of()
        );
    }

    private enum StatType {
        STR,
        DEX,
        INT,
        LUK,
        HP,
        DROP_RATE,
        MESO_RATE,
        EXP_RATE
    }
}