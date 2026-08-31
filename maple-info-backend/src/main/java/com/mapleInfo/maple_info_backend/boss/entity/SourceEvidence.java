package com.mapleInfo.maple_info_backend.boss.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "boss_source_evidence",
        indexes = {
                @Index(name = "idx_boss_source_type", columnList = "source_type")
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SourceEvidence {

    public enum SourceType {
        YOUTUBE,
        INVEN,
        MAPLE_COMMUNITY,
        MAPLE_SCOUTER,
        USER_SUBMISSION,
        OTHER
    }

    public enum ConfidenceGrade {
        S,
        A,
        B,
        C,
        D
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "boss_attempt_id", nullable = false)
    private BossAttempt bossAttempt;

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

    /**
     * 게시글 또는 영상 업로드 시각
     */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /**
     * 데이터 신뢰도
     *
     * S:
     * 전체 영상 + 스펙창 + 클리어시간 확인
     *
     * A:
     * 스펙과 클리어시간 명확
     *
     * B:
     * 일부 값만 확인 가능
     *
     * C:
     * 사용자 텍스트 주장 위주
     *
     * D:
     * 단순 추정/간접 정보
     */
    @Enumerated(EnumType.STRING)
    @Column(
            name = "confidence_grade",
            nullable = false,
            length = 5
    )
    private ConfidenceGrade confidenceGrade;

    /**
     * 사람이 검수했는지 여부
     */
    @Builder.Default
    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    /**
     * 수집/검수 메모
     */
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Builder.Default
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private LocalDateTime createdAt = LocalDateTime.now();
}