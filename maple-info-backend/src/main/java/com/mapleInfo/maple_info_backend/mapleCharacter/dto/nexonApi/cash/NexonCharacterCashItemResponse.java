package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.cash;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record NexonCharacterCashItemResponse(
        @JsonProperty("date")
        String date,

        @JsonProperty("character_gender")
        String characterGender,

        @JsonProperty("character_class")
        String characterClass,

        @JsonProperty("character_look_mode")
        String characterLookMode,

        @JsonProperty("preset_no")
        Integer presetNo,

        @JsonProperty("cash_item_equipment_base")
        List<NexonCashItemResponse> baseEquipment,

        @JsonProperty("cash_item_equipment_preset_1")
        List<NexonCashItemResponse> preset1,

        @JsonProperty("cash_item_equipment_preset_2")
        List<NexonCashItemResponse> preset2,

        @JsonProperty("cash_item_equipment_preset_3")
        List<NexonCashItemResponse> preset3,

        @JsonProperty("additional_cash_item_equipment_base")
        List<NexonCashItemResponse> additionalBaseEquipment,

        @JsonProperty("additional_cash_item_equipment_preset_1")
        List<NexonCashItemResponse> additionalPreset1,

        @JsonProperty("additional_cash_item_equipment_preset_2")
        List<NexonCashItemResponse> additionalPreset2,

        @JsonProperty("additional_cash_item_equipment_preset_3")
        List<NexonCashItemResponse> additionalPreset3
) {
}