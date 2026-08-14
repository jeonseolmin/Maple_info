package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.android;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.android.NexonCharacterAndroidEquipmentResponse;
import com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash.CharacterCashItemResponse;

import java.util.List;
import java.util.Objects;

public record CharacterAndroidEquipmentResponse(
        String date,
        boolean equipped,
        String name,
        String nickname,
        String icon,
        String description,
        AndroidHairResponse hair,
        AndroidFaceResponse face,
        String skinName,
        List<CharacterCashItemResponse> cashEquipment
) {

    public record AndroidHairResponse(
            String name,
            String baseColor,
            String mixColor,
            String mixRate
    ) {
    }

    public record AndroidFaceResponse(
            String name,
            String baseColor,
            String mixColor,
            String mixRate
    ) {
    }

    public static CharacterAndroidEquipmentResponse from(
            NexonCharacterAndroidEquipmentResponse response
    ) {
        if (
                response == null ||
                        response.androidName() == null ||
                        response.androidName().isBlank()
        ) {
            return empty(
                    response != null
                            ? response.date()
                            : null
            );
        }

        return new CharacterAndroidEquipmentResponse(
                response.date(),
                true,
                response.androidName(),
                response.androidNickname(),
                response.androidIcon(),
                response.androidDescription(),
                convertHair(response.androidHair()),
                convertFace(response.androidFace()),
                response.androidSkinName(),
                convertCashEquipment(
                        response.cashItemEquipment()
                )
        );
    }

    private static AndroidHairResponse convertHair(
            NexonCharacterAndroidEquipmentResponse.AndroidHair hair
    ) {
        if (hair == null) {
            return null;
        }

        return new AndroidHairResponse(
                hair.hairName(),
                hair.baseColor(),
                hair.mixColor(),
                hair.mixRate()
        );
    }

    private static AndroidFaceResponse convertFace(
            NexonCharacterAndroidEquipmentResponse.AndroidFace face
    ) {
        if (face == null) {
            return null;
        }

        return new AndroidFaceResponse(
                face.faceName(),
                face.baseColor(),
                face.mixColor(),
                face.mixRate()
        );
    }

    private static List<CharacterCashItemResponse> convertCashEquipment(
            List<com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCashItemResponse> equipment
    ) {
        if (equipment == null) {
            return List.of();
        }

        return equipment.stream()
                .filter(Objects::nonNull)
                .map(CharacterCashItemResponse::from)
                .filter(Objects::nonNull)
                .toList();
    }

    private static CharacterAndroidEquipmentResponse empty(
            String date
    ) {
        return new CharacterAndroidEquipmentResponse(
                date,
                false,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                List.of()
        );
    }
}