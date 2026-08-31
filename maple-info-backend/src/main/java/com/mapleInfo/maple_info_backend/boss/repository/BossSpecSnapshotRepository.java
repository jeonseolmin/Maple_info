package com.mapleInfo.maple_info_backend.boss.repository;

import com.mapleInfo.maple_info_backend.boss.entity.BossSpecSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BossSpecSnapshotRepository
        extends JpaRepository<BossSpecSnapshot, Long> {

    Optional<BossSpecSnapshot> findByBossAttemptId(Long bossAttemptId);
}