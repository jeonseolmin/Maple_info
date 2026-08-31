package com.mapleInfo.maple_info_backend.boss.dto;

import com.mapleInfo.maple_info_backend.boss.entity.BossAttempt;
import com.mapleInfo.maple_info_backend.boss.entity.SourceEvidence;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BossAttemptUpdateRequest {

    private Long bossId;

    private String characterName;
    private String characterClass;

    private BossAttempt.AttemptResult result;

    private Integer partySize;
    private Integer clearTimeSeconds;

    private BigDecimal observedBossRatio;

    private BossAttempt.PlayerSkillLevel playerSkillLevel;

    private String gameVersion;
    private LocalDateTime recordedAt;

    // 당시 스펙

    private Integer characterLevel;
    private Long combatPower;

    private BigDecimal convertedStat;

    private BigDecimal bossDamage;
    private BigDecimal ignoreDefense;
    private BigDecimal criticalDamage;

    private Long mainStat;
    private Long attackPower;

    private BigDecimal hexaProgress;

    private String seedRing;
    private String buffDescription;

    // 출처

    private Long sourceId;

    private SourceEvidence.SourceType sourceType;

    private String sourceUrl;

    private LocalDateTime publishedAt;

    private SourceEvidence.ConfidenceGrade confidenceGrade;

    private Boolean verified;

    private String sourceNote;
}