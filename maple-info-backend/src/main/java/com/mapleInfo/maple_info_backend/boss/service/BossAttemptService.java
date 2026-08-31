package com.mapleInfo.maple_info_backend.boss.service;

import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptDetailResponse;
import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptRequest;
import com.mapleInfo.maple_info_backend.boss.dto.BossAttemptResponse;
import com.mapleInfo.maple_info_backend.boss.entity.Boss;
import com.mapleInfo.maple_info_backend.boss.entity.BossAttempt;
import com.mapleInfo.maple_info_backend.boss.entity.BossSpecSnapshot;
import com.mapleInfo.maple_info_backend.boss.entity.SourceEvidence;
import com.mapleInfo.maple_info_backend.boss.repository.BossAttemptRepository;
import com.mapleInfo.maple_info_backend.boss.repository.BossRepository;
import com.mapleInfo.maple_info_backend.boss.repository.BossSpecSnapshotRepository;
import com.mapleInfo.maple_info_backend.boss.repository.SourceEvidenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BossAttemptService {

    private final BossRepository bossRepository;

    private final BossAttemptRepository bossAttemptRepository;
    private final BossSpecSnapshotRepository bossSpecSnapshotRepository;
    private final SourceEvidenceRepository sourceEvidenceRepository;

    @Transactional
    public BossAttemptResponse createAttempt(BossAttemptRequest request) {

        Boss boss = bossRepository.findById(request.getBossId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 보스입니다. bossId=" + request.getBossId()
                        )
                );

        BossAttempt attempt = BossAttempt.builder()
                .boss(boss)
                .characterName(request.getCharacterName())
                .characterClass(request.getCharacterClass())
                .result(request.getResult())

                .partySize(
                        request.getPartySize() == null
                                ? 1
                                : request.getPartySize()
                )

                .clearTimeSeconds(request.getClearTimeSeconds())

                .observedBossRatio(request.getObservedBossRatio())
                .normalizedBossRatio(request.getNormalizedBossRatio())
                .normalizationVersion(request.getNormalizationVersion())

                .playerSkillLevel(
                        request.getPlayerSkillLevel() == null
                                ? BossAttempt.PlayerSkillLevel.UNKNOWN
                                : request.getPlayerSkillLevel()
                )

                .gameVersion(request.getGameVersion())
                .recordedAt(request.getRecordedAt())
                .build();

        BossAttempt savedAttempt =
                bossAttemptRepository.save(attempt);

        BossSpecSnapshot specSnapshot =
                BossSpecSnapshot.builder()
                        .bossAttempt(savedAttempt)

                        .characterLevel(request.getCharacterLevel())
                        .combatPower(request.getCombatPower())

                        .convertedStat(request.getConvertedStat())

                        .bossDamage(request.getBossDamage())
                        .ignoreDefense(request.getIgnoreDefense())
                        .criticalDamage(request.getCriticalDamage())

                        .mainStat(request.getMainStat())
                        .attackPower(request.getAttackPower())

                        .hexaProgress(request.getHexaProgress())

                        .seedRing(request.getSeedRing())
                        .buffDescription(request.getBuffDescription())

                        .build();

        BossSpecSnapshot savedSnapshot =
                bossSpecSnapshotRepository.save(specSnapshot);

        SourceEvidence sourceEvidence =
                SourceEvidence.builder()
                        .bossAttempt(savedAttempt)

                        .sourceType(request.getSourceType())
                        .sourceUrl(request.getSourceUrl())

                        .publishedAt(request.getPublishedAt())

                        .confidenceGrade(
                                request.getConfidenceGrade() == null
                                        ? SourceEvidence.ConfidenceGrade.D
                                        : request.getConfidenceGrade()
                        )

                        .verified(
                                Boolean.TRUE.equals(request.getVerified())
                        )

                        .note(request.getSourceNote())

                        .build();

        SourceEvidence savedEvidence =
                sourceEvidenceRepository.save(sourceEvidence);

        return BossAttemptResponse.builder()
                .attemptId(savedAttempt.getId())
                .specSnapshotId(savedSnapshot.getId())
                .sourceEvidenceId(savedEvidence.getId())
                .build();
    }

    @Transactional(readOnly = true)
    public List<BossAttemptDetailResponse> getAllAttempts() {

        return bossAttemptRepository
                .findAllByOrderByRecordedAtDesc()
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BossAttemptDetailResponse getAttempt(Long attemptId) {

        BossAttempt attempt = bossAttemptRepository.findById(attemptId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "존재하지 않는 보스 기록입니다. attemptId="
                                        + attemptId
                        )
                );

        return toDetailResponse(attempt);
    }

    @Transactional(readOnly = true)
    public List<BossAttemptDetailResponse> getAttemptsByBoss(
            Long bossId
    ) {

        return bossAttemptRepository
                .findByBossIdOrderByRecordedAtDesc(bossId)
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BossAttemptDetailResponse> getAttemptsByClass(
            String characterClass
    ) {

        return bossAttemptRepository
                .findByCharacterClassOrderByRecordedAtDesc(characterClass)
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BossAttemptDetailResponse> getAttempts(
            Long bossId,
            String characterClass
    ) {

        return bossAttemptRepository
                .findByBossIdAndCharacterClassOrderByRecordedAtDesc(
                        bossId,
                        characterClass
                )
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BossAttemptDetailResponse> getAttemptsByRatio(
            Long bossId,
            BigDecimal minRatio,
            BigDecimal maxRatio
    ) {

        return bossAttemptRepository
                .findByBossIdAndObservedBossRatioBetweenOrderByObservedBossRatioAsc(
                        bossId,
                        minRatio,
                        maxRatio
                )
                .stream()
                .map(this::toDetailResponse)
                .toList();
    }

    private BossAttemptDetailResponse toDetailResponse(
            BossAttempt attempt
    ) {

        BossSpecSnapshot snapshot =
                bossSpecSnapshotRepository
                        .findByBossAttemptId(attempt.getId())
                        .orElse(null);

        List<SourceEvidence> evidences =
                sourceEvidenceRepository
                        .findByBossAttemptId(attempt.getId());

        List<BossAttemptDetailResponse.SourceInfo> sources =
                evidences.stream()
                        .map(source ->
                                BossAttemptDetailResponse.SourceInfo.builder()
                                        .sourceId(source.getId())
                                        .sourceType(source.getSourceType())
                                        .sourceUrl(source.getSourceUrl())
                                        .publishedAt(source.getPublishedAt())
                                        .confidenceGrade(
                                                source.getConfidenceGrade()
                                        )
                                        .verified(source.getVerified())
                                        .note(source.getNote())
                                        .build()
                        )
                        .toList();

        return BossAttemptDetailResponse.builder()

                .attemptId(attempt.getId())

                .bossId(attempt.getBoss().getId())
                .bossName(attempt.getBoss().getName())
                .difficulty(attempt.getBoss().getDifficulty())

                .characterName(attempt.getCharacterName())
                .characterClass(attempt.getCharacterClass())

                .result(attempt.getResult())

                .partySize(attempt.getPartySize())
                .clearTimeSeconds(attempt.getClearTimeSeconds())

                .observedBossRatio(attempt.getObservedBossRatio())
                .normalizedBossRatio(attempt.getNormalizedBossRatio())
                .normalizationVersion(
                        attempt.getNormalizationVersion()
                )

                .playerSkillLevel(attempt.getPlayerSkillLevel())

                .gameVersion(attempt.getGameVersion())
                .recordedAt(attempt.getRecordedAt())

                .characterLevel(
                        snapshot != null
                                ? snapshot.getCharacterLevel()
                                : null
                )

                .combatPower(
                        snapshot != null
                                ? snapshot.getCombatPower()
                                : null
                )

                .convertedStat(
                        snapshot != null
                                ? snapshot.getConvertedStat()
                                : null
                )

                .bossDamage(
                        snapshot != null
                                ? snapshot.getBossDamage()
                                : null
                )

                .ignoreDefense(
                        snapshot != null
                                ? snapshot.getIgnoreDefense()
                                : null
                )

                .criticalDamage(
                        snapshot != null
                                ? snapshot.getCriticalDamage()
                                : null
                )

                .mainStat(
                        snapshot != null
                                ? snapshot.getMainStat()
                                : null
                )

                .attackPower(
                        snapshot != null
                                ? snapshot.getAttackPower()
                                : null
                )

                .hexaProgress(
                        snapshot != null
                                ? snapshot.getHexaProgress()
                                : null
                )

                .seedRing(
                        snapshot != null
                                ? snapshot.getSeedRing()
                                : null
                )

                .buffDescription(
                        snapshot != null
                                ? snapshot.getBuffDescription()
                                : null
                )

                .sources(sources)

                .build();
    }
}