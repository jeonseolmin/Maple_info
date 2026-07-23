package com.mapleInfo.maple_info_backend.mapleCharacter.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CharacterRegisterRequest(
        @NotBlank(message = "캐릭터 이름은 필수입니다.")
        String characterName
) {
}
