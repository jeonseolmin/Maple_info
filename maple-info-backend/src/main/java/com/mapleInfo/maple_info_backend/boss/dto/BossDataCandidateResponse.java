package com.mapleInfo.maple_info_backend.boss.dto;

import com.mapleInfo.maple_info_backend.boss.entity.BossDataCandidate;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class BossDataCandidateResponse {

    private Long id;

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

    private BossDataCandidate.CandidateStatus status;

    private LocalDateTime publishedAt;

    private LocalDateTime createdAt;
}