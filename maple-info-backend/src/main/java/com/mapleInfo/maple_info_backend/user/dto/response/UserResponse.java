package com.mapleInfo.maple_info_backend.user.dto.response;

import com.mapleInfo.maple_info_backend.user.entity.enums.Role;

public record UserResponse(
        Long id,
        String mainCharacterName,
        Role role
) {

}
