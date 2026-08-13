package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.union;

import java.util.List;

public record UnionRaiderDto(
        List<UnionBlockDto> union_block
) {
    public record UnionBlockDto(
            String block_type,  // 닉네임
            String block_class, // 직업
            int block_level     // 레벨
    ) {}
}