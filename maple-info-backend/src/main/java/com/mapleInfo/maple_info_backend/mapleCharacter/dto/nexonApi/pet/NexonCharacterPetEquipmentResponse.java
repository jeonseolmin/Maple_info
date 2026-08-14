package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.pet;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NexonCharacterPetEquipmentResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_gender")
        String characterGender,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("pet_1_name")
        String pet1Name,

        @JsonProperty("pet_1_nickname")
        String pet1Nickname,

        @JsonProperty("pet_1_icon")
        String pet1Icon,

        @JsonProperty("pet_1_description")
        String pet1Description,

        @JsonProperty("pet_1_equipment")
        PetEquipment pet1Equipment,

        @JsonProperty("pet_1_auto_skill")
        PetAutoSkill pet1AutoSkill,

        @JsonProperty("pet_1_pet_type")
        String pet1Type,

        @JsonProperty("pet_1_skill")
        List<String> pet1Skills,

        @JsonProperty("pet_1_date_expire")
        String pet1DateExpire,

        @JsonProperty("pet_1_appearance")
        String pet1Appearance,

        @JsonProperty("pet_1_appearance_icon")
        String pet1AppearanceIcon,

        @JsonProperty("pet_2_name")
        String pet2Name,

        @JsonProperty("pet_2_nickname")
        String pet2Nickname,

        @JsonProperty("pet_2_icon")
        String pet2Icon,

        @JsonProperty("pet_2_description")
        String pet2Description,

        @JsonProperty("pet_2_equipment")
        PetEquipment pet2Equipment,

        @JsonProperty("pet_2_auto_skill")
        PetAutoSkill pet2AutoSkill,

        @JsonProperty("pet_2_pet_type")
        String pet2Type,

        @JsonProperty("pet_2_skill")
        List<String> pet2Skills,

        @JsonProperty("pet_2_date_expire")
        String pet2DateExpire,

        @JsonProperty("pet_2_appearance")
        String pet2Appearance,

        @JsonProperty("pet_2_appearance_icon")
        String pet2AppearanceIcon,

        @JsonProperty("pet_3_name")
        String pet3Name,

        @JsonProperty("pet_3_nickname")
        String pet3Nickname,

        @JsonProperty("pet_3_icon")
        String pet3Icon,

        @JsonProperty("pet_3_description")
        String pet3Description,

        @JsonProperty("pet_3_equipment")
        PetEquipment pet3Equipment,

        @JsonProperty("pet_3_auto_skill")
        PetAutoSkill pet3AutoSkill,

        @JsonProperty("pet_3_pet_type")
        String pet3Type,

        @JsonProperty("pet_3_skill")
        List<String> pet3Skills,

        @JsonProperty("pet_3_date_expire")
        String pet3DateExpire,

        @JsonProperty("pet_3_appearance")
        String pet3Appearance,

        @JsonProperty("pet_3_appearance_icon")
        String pet3AppearanceIcon
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PetEquipment(
            @JsonProperty("item_name")
            String itemName,

            @JsonProperty("item_icon")
            String itemIcon,

            @JsonProperty("item_description")
            String itemDescription,

            @JsonProperty("item_option")
            List<PetEquipmentOption> itemOptions,

            @JsonProperty("scroll_upgrade")
            Integer scrollUpgrade,

            @JsonProperty("scroll_upgradable")
            Integer scrollUpgradable,

            @JsonProperty("item_shape")
            String itemShape,

            @JsonProperty("item_shape_icon")
            String itemShapeIcon
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PetEquipmentOption(
            @JsonProperty("option_type")
            String optionType,

            @JsonProperty("option_value")
            String optionValue
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PetAutoSkill(
            @JsonProperty("skill_1")
            String skill1,

            @JsonProperty("skill_1_icon")
            String skill1Icon,

            @JsonProperty("skill_2")
            String skill2,

            @JsonProperty("skill_2_icon")
            String skill2Icon
    ) {
    }
}