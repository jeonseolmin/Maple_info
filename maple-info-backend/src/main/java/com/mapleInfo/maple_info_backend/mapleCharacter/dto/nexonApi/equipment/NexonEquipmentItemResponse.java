package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.equipment;

import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record NexonEquipmentItemResponse(
        String itemEquipmentPart,
        String itemEquipmentSlot,

        String itemName,
        String itemIcon,
        String itemDescription,

        String itemShapeName,
        String itemShapeIcon,
        String itemGender,
        Integer equipmentLevelIncrease,
        NexonEquipmentOptionResponse itemExceptionalOption,

        String starforce,
        String starforceScrollFlag,

        String potentialOptionGrade,
        @JsonProperty("potential_option_1")
        String potentialOption1,

        @JsonProperty("potential_option_2")
        String potentialOption2,

        @JsonProperty("potential_option_3")
        String potentialOption3,

        String additionalPotentialOptionGrade,
        @JsonProperty("additional_potential_option_1")
        String additionalPotentialOption1,

        @JsonProperty("additional_potential_option_2")
        String additionalPotentialOption2,

        @JsonProperty("additional_potential_option_3")
        String additionalPotentialOption3,

        NexonEquipmentOptionResponse itemTotalOption,
        NexonEquipmentOptionResponse itemBaseOption,
        NexonEquipmentOptionResponse itemAddOption,
        NexonEquipmentOptionResponse itemEtcOption,
        NexonEquipmentOptionResponse itemStarforceOption,

        Integer scrollUpgrade,
        Integer scrollUpgradeableCount,
        Integer cuttableCount,
        String goldenHammerFlag,

        String soulName,
        String soulOption
) {
}