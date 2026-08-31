package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "boss_data_candidate",
        indexes = {
                @Index(
                        name = "idx_boss_candidate_status",
                        columnList = "status"
                ),
                @Index(
                        name = "idx_boss_candidate_class",
                        columnList = "character_class"
                ),
                @Index(
                        name = "idx_boss_candidate_created",
                        columnList = "created_at"
                )
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_boss_candidate_source_url",
                        columnNames = "source_url"
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BossDataCandidate {

    public enum CandidateStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    public enum SourceType {
        YOUTUBE,
        INVEN,
        MAPLE_COMMUNITY,
        MAPLE_SCOUTER,
        OTHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * 아직 정확한 Boss Entity 매칭 전일 수도 있으므로
     * 원본 텍스트 형태로 저장합니다.
     */
    @Column(name = "boss_name", length = 50)
    private String bossName;

    @Column(name = "difficulty", length = 30)
    private String difficulty;

    @Column(name = "character_name", length = 50)
    private String characterName;

    @Column(name = "character_class", length = 50)
    private String characterClass;

    /*
     * 자동 추출된 전투력
     */
    @Column(name = "combat_power")
    private Long combatPower;

    /*
     * 자동 추출된 보스 배율
     */
    @Column(
            name = "observed_boss_ratio",
            precision = 10,
            scale = 3
    )
    private BigDecimal observedBossRatio;

    /*
     * 자동 추출된 클리어 시간
     */
    @Column(name = "clear_time_seconds")
    private Integer clearTimeSeconds;

    /*
     * 파싱된 텍스트에서 성공/실패 여부를 판단할 수 있으면 저장
     */
    @Column(name = "attempt_result", length = 30)
    private String attemptResult;

    @Enumerated(EnumType.STRING)
    @Column(
            name = "source_type",
            nullable = false,
            length = 30
    )
    private SourceType sourceType;

    @Column(
            name = "source_url",
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String sourceUrl;

    @Column(name = "source_title", columnDefinition = "TEXT")
    private String sourceTitle;

    /*
     * 파싱에 사용된 원본 텍스트 일부.
     *
     * 게시글 전체를 복제하는 용도가 아니라
     * 관리자가 판단할 수 있는 범위의 추출 텍스트만 저장합니다.
     */
    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    /*
     * Python 파서가 계산한 신뢰도.
     * 0.0 ~ 1.0
     */
    @Column(
            name = "parser_confidence",
            precision = 5,
            scale = 4
    )
    private BigDecimal parserConfidence;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(
            name = "status",
            nullable = false,
            length = 20
    )
    private CandidateStatus status = CandidateStatus.PENDING;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Builder.Default
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt = LocalDateTime.now();

    public void approve() {
        this.status = CandidateStatus.APPROVED;
    }

    public void reject() {
        this.status = CandidateStatus.REJECTED;
    }
}