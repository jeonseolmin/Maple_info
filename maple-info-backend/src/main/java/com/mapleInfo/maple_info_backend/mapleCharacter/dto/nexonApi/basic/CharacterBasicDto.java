package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.basic;

public record CharacterBasicDto(
        String character_name,
        String character_class,
        int character_level,
        String character_image
) {}