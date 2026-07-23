package com.mapleInfo.maple_info_backend.userCharacter.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UserCharacterRequest(
        @NotBlank
        String characterName
) {
}
