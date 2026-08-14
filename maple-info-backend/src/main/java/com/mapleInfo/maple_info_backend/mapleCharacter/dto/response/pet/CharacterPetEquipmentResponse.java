package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.pet;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.pet.NexonCharacterPetEquipmentResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public record CharacterPetEquipmentResponse(
        String date,
        String characterGender,
        String characterClass,
        List<PetResponse> pets
) {

    public record PetResponse(
            Integer number,
            String name,
            String nickname,
            String icon,
            String description,
            String type,
            List<String> skills,
            String dateExpire,
            String appearance,
            String appearanceIcon,
            PetEquipmentResponse equipment,
            List<PetAutoSkillResponse> autoSkills
    ) {
    }

    public record PetEquipmentResponse(
            String name,
            String icon,
            String description,
            List<PetEquipmentOptionResponse> options,
            Integer scrollUpgrade,
            Integer scrollUpgradable,
            String itemShape,
            String itemShapeIcon
    ) {
    }

    public record PetEquipmentOptionResponse(
            String type,
            String value
    ) {
    }

    public record PetAutoSkillResponse(
            Integer number,
            String name,
            String icon
    ) {
    }

    public static CharacterPetEquipmentResponse from(
            NexonCharacterPetEquipmentResponse response
    ) {
        if (response == null) {
            return empty();
        }

        List<PetResponse> pets = new ArrayList<>();

        addPetIfPresent(
                pets,
                createPet(
                        1,
                        response.pet1Name(),
                        response.pet1Nickname(),
                        response.pet1Icon(),
                        response.pet1Description(),
                        response.pet1Type(),
                        response.pet1Skills(),
                        response.pet1DateExpire(),
                        response.pet1Appearance(),
                        response.pet1AppearanceIcon(),
                        response.pet1Equipment(),
                        response.pet1AutoSkill()
                )
        );

        addPetIfPresent(
                pets,
                createPet(
                        2,
                        response.pet2Name(),
                        response.pet2Nickname(),
                        response.pet2Icon(),
                        response.pet2Description(),
                        response.pet2Type(),
                        response.pet2Skills(),
                        response.pet2DateExpire(),
                        response.pet2Appearance(),
                        response.pet2AppearanceIcon(),
                        response.pet2Equipment(),
                        response.pet2AutoSkill()
                )
        );

        addPetIfPresent(
                pets,
                createPet(
                        3,
                        response.pet3Name(),
                        response.pet3Nickname(),
                        response.pet3Icon(),
                        response.pet3Description(),
                        response.pet3Type(),
                        response.pet3Skills(),
                        response.pet3DateExpire(),
                        response.pet3Appearance(),
                        response.pet3AppearanceIcon(),
                        response.pet3Equipment(),
                        response.pet3AutoSkill()
                )
        );

        return new CharacterPetEquipmentResponse(
                response.date(),
                response.characterGender(),
                response.characterClass(),
                List.copyOf(pets)
        );
    }

    private static PetResponse createPet(
            Integer number,
            String name,
            String nickname,
            String icon,
            String description,
            String type,
            List<String> skills,
            String dateExpire,
            String appearance,
            String appearanceIcon,
            NexonCharacterPetEquipmentResponse.PetEquipment equipment,
            NexonCharacterPetEquipmentResponse.PetAutoSkill autoSkill
    ) {
        if (name == null || name.isBlank()) {
            return null;
        }

        return new PetResponse(
                number,
                name,
                nickname,
                icon,
                description,
                type,
                nullToEmpty(skills),
                dateExpire,
                appearance,
                appearanceIcon,
                convertEquipment(equipment),
                convertAutoSkills(autoSkill)
        );
    }

    private static void addPetIfPresent(
            List<PetResponse> pets,
            PetResponse pet
    ) {
        if (pet != null) {
            pets.add(pet);
        }
    }

    private static PetEquipmentResponse convertEquipment(
            NexonCharacterPetEquipmentResponse.PetEquipment equipment
    ) {
        if (equipment == null) {
            return null;
        }

        List<PetEquipmentOptionResponse> options =
                equipment.itemOptions() == null
                        ? List.of()
                        : equipment.itemOptions()
                          .stream()
                          .filter(Objects::nonNull)
                          .map(option ->
                               new PetEquipmentOptionResponse(
                                       option.optionType(),
                                       option.optionValue()
                               )
                          )
                          .toList();

        return new PetEquipmentResponse(
                equipment.itemName(),
                equipment.itemIcon(),
                equipment.itemDescription(),
                options,
                equipment.scrollUpgrade(),
                equipment.scrollUpgradable(),
                equipment.itemShape(),
                equipment.itemShapeIcon()
        );
    }

    private static List<PetAutoSkillResponse> convertAutoSkills(
            NexonCharacterPetEquipmentResponse.PetAutoSkill autoSkill
    ) {
        if (autoSkill == null) {
            return List.of();
        }

        List<PetAutoSkillResponse> skills =
                new ArrayList<>();

        addAutoSkillIfPresent(
                skills,
                1,
                autoSkill.skill1(),
                autoSkill.skill1Icon()
        );

        addAutoSkillIfPresent(
                skills,
                2,
                autoSkill.skill2(),
                autoSkill.skill2Icon()
        );

        return List.copyOf(skills);
    }

    private static void addAutoSkillIfPresent(
            List<PetAutoSkillResponse> skills,
            Integer number,
            String name,
            String icon
    ) {
        if (name == null || name.isBlank()) {
            return;
        }

        skills.add(
                new PetAutoSkillResponse(
                        number,
                        name,
                        icon
                )
        );
    }

    private static List<String> nullToEmpty(
            List<String> values
    ) {
        if (values == null) {
            return List.of();
        }

        return values.stream()
                .filter(Objects::nonNull)
                .filter(value -> !value.isBlank())
                .toList();
    }

    private static CharacterPetEquipmentResponse empty() {
        return new CharacterPetEquipmentResponse(
                null,
                null,
                null,
                List.of()
        );
    }
}