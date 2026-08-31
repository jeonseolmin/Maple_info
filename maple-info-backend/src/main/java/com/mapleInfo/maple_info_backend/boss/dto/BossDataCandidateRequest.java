package com.mapleInfo.maple_info_backend.boss.dto;

import com.mapleInfo.maple_info_backend.boss.entity.BossDataCandidate;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BossDataCandidateRequest {

    private String bossName;
    private String difficulty;

    private String characterName;
    private String characterClass;

    private Long combatPower;

    private BigDecimal observedBossRatio;

    private Integer clearTimeSeconds;

    private String attemptResult;

    private BossDataCandidate.SourceType sourceType;

    private String sourceUrl;

    private String sourceTitle;

    private String rawText;

    private BigDecimal parserConfidence;

    private LocalDateTime publishedAt;
}