package com.mapleInfo.maple_info_backend.mapleCharacter.dto.response.cash;

import com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash.NexonCashItemResponse;

import java.util.List;

public record CharacterCashItemResponse(
        String part,
        String slot,
        String name,
        String icon,
        String description,
        List<OptionResponse> options,
        String expireAt,
        String optionExpireAt,
        String label,
        ColoringPrismResponse coloringPrism,
        String gender
) {

    public static CharacterCashItemResponse from(
            NexonCashItemResponse item
    ) {
        if (item == null) {
            return null;
        }

        List<OptionResponse> options =
                item.itemOptions() == null
                        ? List.of()
                        : item.itemOptions().stream()
                          .map(option -> new OptionResponse(
                                  option.optionType(),
                                  option.optionValue()
                          ))
                          .toList();

        ColoringPrismResponse prism = null;

        if (item.coloringPrism() != null) {
            prism = new ColoringPrismResponse(
                    item.coloringPrism().colorRange(),
                    item.coloringPrism().hue(),
                    item.coloringPrism().saturation(),
                    item.coloringPrism().value()
            );
        }

        return new CharacterCashItemResponse(
                item.equipmentPart(),
                item.equipmentSlot(),
                item.itemName(),
                item.itemIcon(),
                item.itemDescription(),
                options,
                item.dateExpire(),
                item.dateOptionExpire(),
                item.itemLabel(),
                prism,
                item.itemGender()
        );
    }

    public record OptionResponse(
            String type,
            String value
    ) {
    }

    public record ColoringPrismResponse(
            String colorRange,
            Integer hue,
            Integer saturation,
            Integer value
    ) {
    }
}