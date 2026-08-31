package com.mapleInfo.maple_info_backend.boss.repository;

import com.mapleInfo.maple_info_backend.boss.entity.BossAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BossAttemptRepository
        extends JpaRepository<BossAttempt, Long> {

    List<BossAttempt> findAllByOrderByRecordedAtDesc();

    List<BossAttempt> findByBossIdOrderByRecordedAtDesc(
            Long bossId
    );

    List<BossAttempt> findByCharacterClassOrderByRecordedAtDesc(
            String characterClass
    );

    List<BossAttempt> findByBossIdAndCharacterClassOrderByRecordedAtDesc(
            Long bossId,
            String characterClass
    );

    List<BossAttempt>
    findByBossIdAndObservedBossRatioBetweenOrderByObservedBossRatioAsc(
            Long bossId,
            java.math.BigDecimal minRatio,
            java.math.BigDecimal maxRatio
    );
}