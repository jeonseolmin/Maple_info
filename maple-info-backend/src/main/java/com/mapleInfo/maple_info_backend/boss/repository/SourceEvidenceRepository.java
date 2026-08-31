package com.mapleInfo.maple_info_backend.boss.repository;

import com.mapleInfo.maple_info_backend.boss.entity.SourceEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SourceEvidenceRepository
        extends JpaRepository<SourceEvidence, Long> {

    List<SourceEvidence> findByBossAttemptId(Long bossAttemptId);

    boolean existsBySourceUrl(String sourceUrl);
}