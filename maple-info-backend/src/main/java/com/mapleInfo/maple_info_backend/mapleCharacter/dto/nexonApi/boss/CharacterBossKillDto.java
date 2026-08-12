package com.mapleInfo.maple_info_backend.mapleCharacter.dto.nexonApi.boss;

import java.util.List;

public record CharacterBossKillDto(
        List<BossKillDataDto> boss_kill_data
) {
    public record BossKillDataDto(
            String boss_name,
            String boss_difficulty
    ) {}
}
