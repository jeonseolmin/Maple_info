package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record NexonCashItemResponse(
        @JsonProperty("cash_item_equipment_part")
        String equipmentPart,

        @JsonProperty("cash_item_equipment_slot")
        String equipmentSlot,

        @JsonProperty("cash_item_name")
        String itemName,

        @JsonProperty("cash_item_icon")
        String itemIcon,

        @JsonProperty("cash_item_description")
        String itemDescription,

        @JsonProperty("cash_item_option")
        List<NexonCashItemOptionResponse> itemOptions,

        @JsonProperty("date_expire")
        String dateExpire,

        @JsonProperty("date_option_expire")
        String dateOptionExpire,

        @JsonProperty("cash_item_label")
        String itemLabel,

        @JsonProperty("cash_item_coloring_prism")
        NexonCashItemColoringPrismResponse coloringPrism,

        @JsonProperty("item_gender")
        String itemGender
) {
}