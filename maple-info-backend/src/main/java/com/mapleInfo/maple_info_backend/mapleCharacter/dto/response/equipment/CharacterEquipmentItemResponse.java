package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.equipment;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment.NexonEquipmentItemResponse;

import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

public record CharacterEquipmentItemResponse(
        String part,
        String slot,

        String name,
        String icon,
        String description,

        String shapeName,
        String shapeIcon,
        String gender,
        Integer equipmentLevel,
        CharacterEquipmentOptionResponse exceptionalOption,

        Integer starforce,
        String starforceScrollFlag,

        String potentialGrade,
        List<String> potentialOptions,

        String additionalPotentialGrade,
        List<String> additionalPotentialOptions,

        CharacterEquipmentOptionResponse totalOption,
        CharacterEquipmentOptionResponse baseOption,
        CharacterEquipmentOptionResponse addOption,
        CharacterEquipmentOptionResponse scrollOption,
        CharacterEquipmentOptionResponse starforceOption,

        Integer scrollUpgrade,
        Integer scrollUpgradeableCount,
        Integer cuttableCount,
        String goldenHammerFlag,

        String soulName,
        String soulOption
) {

    public static CharacterEquipmentItemResponse from(
            NexonEquipmentItemResponse item
    ) {
        return new CharacterEquipmentItemResponse(
                item.itemEquipmentPart(),
                item.itemEquipmentSlot(),

                item.itemName(),
                item.itemIcon(),
                item.itemDescription(),

                item.itemShapeName(),
                item.itemShapeIcon(),
                item.itemGender(),
                item.equipmentLevelIncrease(),
                CharacterEquipmentOptionResponse.from(
                        item.itemExceptionalOption()
                ),

                parseInteger(item.starforce()),
                item.starforceScrollFlag(),

                item.potentialOptionGrade(),
                makeOptions(
                        item.potentialOption1(),
                        item.potentialOption2(),
                        item.potentialOption3()
                ),

                item.additionalPotentialOptionGrade(),
                makeOptions(
                        item.additionalPotentialOption1(),
                        item.additionalPotentialOption2(),
                        item.additionalPotentialOption3()
                ),

                CharacterEquipmentOptionResponse.from(
                        item.itemTotalOption()
                ),
                CharacterEquipmentOptionResponse.from(
                        item.itemBaseOption()
                ),
                CharacterEquipmentOptionResponse.from(
                        item.itemAddOption()
                ),
                CharacterEquipmentOptionResponse.from(
                        item.itemEtcOption()
                ),
                CharacterEquipmentOptionResponse.from(
                        item.itemStarforceOption()
                ),

                item.scrollUpgrade(),
                item.scrollUpgradeableCount(),
                item.cuttableCount(),
                item.goldenHammerFlag(),

                item.soulName(),
                item.soulOption()
        );
    }

    private static List<String> makeOptions(
            String option1,
            String option2,
            String option3
    ) {
        return Stream.of(option1, option2, option3)
                .filter(Objects::nonNull)
                .filter(option -> !option.isBlank())
                .toList();
    }

    private static Integer parseInteger(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return Integer.valueOf(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}